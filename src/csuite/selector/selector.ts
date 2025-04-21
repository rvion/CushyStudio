// #region DOC
/*
This `selector` folder is the result of a LOT of thinking.

Inspirations:

- https://www.npmjs.com/package/jsonpath-plus
- https://jqlang.github.io/jq/manual/#types-and-values
- https://fr.wikipedia.org/wiki/ECMAScript_pour_XML
- https://datatracker.ietf.org/doc/html/rfc6902/
- https://www.w3schools.com/xml/xpath_axes.asp
- https://goessner.net/articles/JsonPath/
- https://docs.hevodata.com/sources/engg-analytics/streaming/rest-api/writing-jsonpath-expressions/
- https://jsonpath.com/


examples selectors
    - $.foo.bar                   // '$' is root, '.' is child, 'foo' is nodes with "foo" mount key
    - >@str                       // '>' is  all descendants, '@str' is filter only nodes having type "str"
    - >@str^?(@.value.length>10)  // '^' is parent, '?()' is filter with expression
    - .foo.bar{.baz.quuz | @str.a.b.c.d | {x.y^z | @number } }
    - >@str=(@.map(v => v.value).join('+'))
*/

import type { FieldPattern } from '../../csuite-cushy/presenters/RenderRule'
import type { Selectorable } from './Selectorable'

import { isField } from '../fields/WidgetUI.DI'
import { CShape } from '../model/CSchemaAt'
import { Field } from '../model/Field'
import { exhaust } from '../utils/exhaust'

// import chalk from 'chalk'

// #region TYPES
// prettier-ignore
export type SelectorToken =
   // AXIS --------------------------------------------------------------------
   | StepAxis // "." (`child` in select mode, `parent` in match mode)
              // "^" (`parent` in select mode, `child` in match mode)
              // ">" (`descendants` in select mode, `ancestors` in match mode)
              // "<" (`ancestors` in select mode, `descendants` in match mode)
   // AXIS + FILTER hybrid ----------------------------------------------------
   | StepIndex // [<number>]
   // FILTER ------------------------------------------------------------------
   | StepFilterMountKey // foo
   | StepFilterType // @str
   | StepFilterCode // ?(<jscode>)
   | StepIsRoot // $
   | StepYes // *
   | StepNesting // &
   | StepHasID // #id
   | StepHasTag // %tag
   // LOGIC -------------------------------------------------------------------
   | StepBranches // {or|...,...,...} {and|...,...,...}
   | StepHas // :has()
   | StepHolds // :holds()
   // EXPERIMENTAL ------------------------------------------------------------
   | StepNot // !() 👉 weird semantic; possibly just a `:has-not()` in disguise
   // FLAGS -------------------------------------------------------------------
   | StepDebug // +

type StepDebug = { type: 'debug' }
type StepIsRoot = { type: 'root' }
type StepAxis = { type: 'axis'; axis: Axis }
type StepFilterMountKey = { type: 'mount'; key: string }
type StepFilterType = { type: 'filterType'; fieldType: string }
type StepFilterCode = { type: 'filterCode'; filterCode: string }
type StepIndex = { type: 'index'; index: number }
type StepBranches = { type: 'branches'; branches: SelectorToken[][] }
type StepNot = { type: 'not'; steps: SelectorToken[] }
type StepHas = { type: 'has'; steps: SelectorToken[] }
type StepHolds = { type: 'holds'; steps: SelectorToken[] }
type StepNesting = { type: 'nesting' }
type StepHasID = { type: 'hasId'; id: string }
type StepHasTag = { type: 'hasTag'; tag: string }

type StepYes = { type: 'yes' }

export type FL_RawFieldSelector = Tagged<string, 'FL_RawFieldSelector'>
const axes: Axis[] = ['.', '>', '^', '<']
export type Axis =
   | '.' // child
   | '^' // parent
   | '>' // descendants
   | '<' // ancestors

enum SelectorMode {
   /**
    *  match form end of pattern upwards to start
    *  a.b.c  => means (check we're named "c" > then thaw we have a parent . > that is named "b" ...)
    */
   // todo: rename upwards
   MATCH_UPWARDS = 1,
   /** match from start to end of */
   SELECT = 2,
   /** attempt to match on schema */
   SELECT_SCHEMA = 3,
}

export interface Selector {
   match: (node: ASTNode) => boolean
   select: (node: ASTNode) => ASTNode[]
}

export type ASTNode = Field

export type ParsedSelector = {
   steps: SelectorToken[]
}

/**
 * SelectorParser parses selector strings into an array of ASTSteps.
 */
export class FieldSelector {
   static cache = new Map<string, FieldSelector>()

   // #region CONSTRUCTORS
   static match(
      //
      pattern: FieldPattern<Field>,
      field: Field,
      virtualParents?: Map<Field, Field>,
   ): boolean {
      if (pattern instanceof Field) return pattern === field
      if (Array.isArray(pattern)) return pattern.includes(field)
      // if (pattern instanceof FieldSelector) return pattern.matches(field, virtualParents)
      if (typeof pattern === 'string') return FieldSelector.from(pattern).matches(field, virtualParents)
      if (typeof pattern === 'boolean') return pattern
      return false
   }

   static from(selector: string | ParsedSelector | FieldSelector): FieldSelector {
      // 1.
      if (selector instanceof FieldSelector) return selector

      // 2.
      if (typeof selector === 'string') {
         const prev = FieldSelector.cache.get(selector)
         if (prev) return prev
         const next = new FieldSelector(selector)
         FieldSelector.cache.set(selector, next)
         return next
      }

      // 3.
      return new FieldSelector(selector)
   }

   private axisSkipsForFields: { [key in CATALOG.AllFieldTypes]?: (node: any) => Field } = {
      shared: (node: Z.FShared<Field>) => node.child,
   }

   private position: number = 0
   private length: number
   readonly selector: string

   private constructor(selector: string | ParsedSelector) {
      if (typeof selector === 'string') {
         this.selector = selector
         this.length = selector.length
      } else {
         this.parsed = selector
         this.length = 0
         this.selector = FieldSelector.renderSteps(selector.steps)
      }
   }

   matches(field: Field | Field[], ___?: Map<Field, Field>): boolean {
      const fields = this.runMatch(field, ___)
      return fields.length > 0
   }

   run(field: Field | Field[], mode: SelectorMode, ___?: Map<Field, Field>) {
      if (mode === SelectorMode.MATCH_UPWARDS) return this.runMatch(field, ___)
      if (mode === SelectorMode.SELECT) return this.runSelect(field, ___)
      throw new Error(`Unknown mode "${mode}"`)
   }

   /** returns the roots that given to the selector would select the given fields  */
   runMatch<SCTR extends Selectorable<SCTR>>(field: SCTR | SCTR[], ___?: Map<SCTR, SCTR>): SCTR[] {
      const { steps } = this.parse()
      return this.selectFrom_(field, steps, SelectorMode.MATCH_UPWARDS, ___)
   }

   runSelect<SCTR extends Selectorable<SCTR>>(from: SCTR | SCTR[], ___?: Map<SCTR, SCTR>): SCTR[] {
      const { steps } = this.parse()
      return this.selectFrom_(from, steps, SelectorMode.SELECT, ___)
   }

   // #region EVAL
   isDebugEnabled = false

   private selectFrom_<SCTR extends Selectorable<SCTR>>(
      from: SCTR[] | SCTR,
      steps_: SelectorToken[],
      mode: SelectorMode,
      ___?: Map<SCTR, SCTR>,
   ): SCTR[] {
      let candidates: SCTR[] = Array.isArray(from) ? from : [from]
      const steps = mode === SelectorMode.MATCH_UPWARDS ? steps_.toReversed() : steps_

      for (const step of steps) {
         if (this.isDebugEnabled) {
            const stepIndex = steps.indexOf(step)
            const start = steps.slice(0, stepIndex)
            const startStr = FieldSelector.renderSteps(start)
            console.log(`[🧠] `, startStr, [candidates.map((c) => c.zPath)])
         }
         // early abort
         if (candidates.length === 0) return [] /* values: values */

         // mount
         if (step.type === 'mount') {
            candidates = candidates.filter((node) => node.zMountKey === step.key)
         }

         // dbg
         else if (step.type === 'debug') {
            this.isDebugEnabled = true
         }

         // filterType
         else if (step.type === 'filterType') {
            candidates = candidates.filter(
               (node) => node.zType === (step.fieldType === 'str' ? 'str' : step.fieldType),
            )
         }

         // filterCode
         else if (step.type === 'filterCode') {
            candidates = candidates.filter((node): boolean => {
               try {
                  const func = new Function('node', `return ${step.filterCode.replaceAll('@.', 'node.')};`)
                  return func(node)
               } catch (e) {
                  console.error(`Error evaluating filter code "${step.filterCode}":`, e)
                  return false
               }
            })
         }

         // root
         else if (step.type === 'root') {
            candidates = candidates.filter((node) => node.zParent == null)
         }

         // nesting
         else if (step.type === 'nesting') {
            throw new Error('nesting should have already been resolved at this point')
         }

         // HasID
         else if (step.type === 'hasId') {
            candidates = candidates.filter((c) => c.zUid === step.id)
         }

         // HasTag
         else if (step.type === 'hasTag') {
            candidates = candidates.filter((c) => c.zConfig.tags?.includes(step.tag) ?? false)
         }

         // has sub-content
         else if (step.type === 'holds') {
            candidates = candidates.filter((node) => {
               const subSelector = FieldSelector.from({ steps: step.steps })
               const res = subSelector.runSelect(node)[0]
               return res != null
            })
         }

         // has sub-shape
         else if (step.type === 'has') {
            candidates = candidates.filter((node) => {
               const subSelector = FieldSelector.from({ steps: step.steps })
               const schemaAt = isField(node) ? node.zShape : node
               if (schemaAt == null) throw new Error('schemaAt is null')
               const res = subSelector.runSelect(schemaAt)[0]
               return res != null
            })
         }

         // not
         else if (step.type === 'not') {
            // throw new Error('❌ not is not implemented')
            candidates = candidates.filter((node) => {
               const subSelector = FieldSelector.from({ steps: step.steps })
               const res = subSelector.runSelect(node)[0]
               return res == null
            })
         }

         // axis
         else if (step.type === 'axis') {
            // candidates = this.applyAxis(candidates, step, mode, ___)
            const nextNodes: Set<SCTR> = new Set()
            const addChildNode = (node: Maybe<SCTR>): void => {
               if (node == null) return
               const skip_ = isField(node) ? this.axisSkipsForFields[node.zType] : null
               if (skip_ != null) node = skip_(node) as unknown /* 🔴 */ as SCTR
               nextNodes.add(node)
            }
            const addParentNode = (node: Maybe<SCTR>): void => {
               if (node == null) return
               const skip_ = isField(node) ? this.axisSkipsForFields[node.zType] : null
               if (skip_ != null) node = node.zParent as SCTR
               if (node == null) return
               nextNodes.add(node)
            }
            for (const at of candidates) {
               if (mode === SelectorMode.MATCH_UPWARDS) {
                  if (step.axis === '.') addParentNode(___?.get(at) ?? at.zParent)
                  else if (step.axis === '^') at.zChildrenAll.forEach(addChildNode)
                  else if (step.axis === '>') at.zAncestors.forEach(addParentNode)
                  else if (step.axis === '<') at.zDescendants.forEach(addChildNode)
                  else throw new Error(`Invalid axis "${step.axis}"`)
               } else {
                  if (step.axis === '.') at.zChildrenAll.forEach(addChildNode)
                  else if (step.axis === '^') addParentNode(___?.get(at) ?? at.zParent)
                  else if (step.axis === '>') at.zDescendants.forEach(addChildNode)
                  else if (step.axis === '<') at.zAncestors.forEach(addParentNode)
                  else throw new Error(`Invalid axis "${step.axis}"`)
               }
            }

            candidates = [...nextNodes.values()]
         }

         // yes
         else if (step.type === 'yes') {
            // noop
         }

         // branches
         else if (step.type === 'branches') {
            const next = new Set<SCTR>()
            for (const branch of step.branches) {
               const branchSelector = new FieldSelector({ steps: branch })
               const nexts =
                  mode === SelectorMode.MATCH_UPWARDS
                     ? branchSelector.runMatch(candidates, ___)
                     : branchSelector.runSelect(candidates, ___)
               for (const n of nexts) next.add(n)
            }
            candidates = Array.from(next)
         }

         // index
         else if (step.type === 'index') {
            if (mode === SelectorMode.MATCH_UPWARDS) {
               candidates = candidates
                  .filter((t) => t.zParent?.zChildrenActive.at(step.index) === t)
                  .map((t) => t.zParent!)
            }
            //
            else {
               candidates = candidates //
                  .map((c) => c.zChildrenActive.at(step.index))
                  .filter(Boolean) as SCTR[]
            }
         }

         // exhaus
         else {
            exhaust(step)
            throw new Error(`Unknown step type "${(step as any).type}"`)
         }
      }

      return candidates // { fields: candidates /* 🌩️ values */ }
   }

   // #region RENDER
   static renderSteps(steps: SelectorToken[]): string {
      return steps.map(FieldSelector.renderStep).join('')
   }

   static renderStep(step: SelectorToken): string {
      if (step.type === 'axis') return step.axis
      if (step.type === 'mount') return `${step.key}`
      if (step.type === 'filterType') return `@${step.fieldType}`
      if (step.type === 'filterCode') return `?(${step.filterCode})`
      if (step.type === 'index') return `[${step.index}]`
      if (step.type === 'branches') return `{${step.branches.map((b) => b.map(FieldSelector.renderStep).join('|')).join(' | ')}}` // prettier-ignore
      if (step.type === 'not') return `!(${step.steps.map(FieldSelector.renderStep).join('')})`
      if (step.type === 'has') return `:has(${step.steps.map(FieldSelector.renderStep).join('')})`
      if (step.type === 'holds') return `:holds(${step.steps.map(FieldSelector.renderStep).join('')})`
      if (step.type === 'root') return `$`
      if (step.type === 'debug') return `+`
      if (step.type === 'yes') return `*`
      if (step.type === 'hasId') return `#${step.id}`
      if (step.type === 'hasTag') return `%${step.tag}`
      if (step.type === 'nesting') return `&`
      exhaust(step)
      throw new Error(`Unknown step type "${(step as any).type}"`)
   }

   // #region PARSE
   parsed: ParsedSelector | null = null

   /**
    * Parses the entire selector string into an array of ASTSteps.
    * @returns ParsedSelector
    */
   parse(): ParsedSelector {
      if (this.parsed != null) return this.parsed

      const steps: SelectorToken[] = []
      while (this.position < this.length) {
         this.consumeWhitespace()
         steps.push(this.parseStep())
      }

      const parsed: ParsedSelector = { steps }
      this.parsed = parsed
      return parsed
   }

   /**
    * parsing is kept as-simple-as-can-be,
    * we need to always be able to decide what to parsed based on the current char
    * we need to always be able to know when to stop parsing from one of the few tokens possibles
    */
   parseStep(): SelectorToken {
      this.consumeWhitespace()
      const char = this.peek()!
      if (char === '{') return this.parseBranches()
      else if (char === '*') return this.parseYes()
      else if (char === '$') return this.parseRoot()
      else if (char === '@') return this.parseFilterType()
      else if (char === '[') return this.parseIndex()
      else if (char === '?') return this.parseFilterCode()
      else if (char === '!') return this.parseNot()
      else if (char === ':') {
         this.consumeCharOrThrow(':')
         const verb = this.consumeNextWord()
         if (verb === 'has') return this.parseHas()
         if (verb === 'holds') return this.parseHolds()
         throw new Error(`Unknown verb "${verb}" at position ${this.position} in selector "${this.selector}"`)
      } else if (char === '+') return this.parseDebug()
      else if (char === '&') return this.parseNested()
      else if (char === '#') return this.parseHasId()
      else if (char === '%') return this.parseHasTag()
      else if (/["a-zA-Z0-9_-]/.test(char!)) return this.parseFilterKey()
      else if (axes.includes(char as any)) return this.parseAxisStep()
      else
         this.FAIL(
            `Unexpected character '${char}' at position ${this.position} in selector "${this.selector}"`,
         )
   }

   private parseNested(): StepNesting {
      this.consumeCharOrThrow('&')
      return { type: 'nesting' }
   }

   private parseHasId(): StepHasID {
      this.consumeCharOrThrow('#')
      const fieldID = this.consumeNextWord()
      return { type: 'hasId', id: fieldID }
   }
   private parseHasTag(): StepHasTag {
      this.consumeCharOrThrow('%')
      const fieldTag = this.consumeNextWord()
      return { type: 'hasTag', tag: fieldTag }
   }

   /** Parses a single axis step. */
   private parseAxisStep(): SelectorToken {
      const axis = this.parseAxis()
      this.consumeWhitespace()
      return { type: 'axis', axis }
   }

   /** Parses a single axis step. */
   private parseDebug(): StepDebug {
      this.consumeCharOrThrow('+')
      this.isDebugEnabled = true
      return { type: 'debug' }
   }

   /** Parses a single axis step. TODO: merge with funtion above */
   private parseAxis(): Axis {
      for (const axis of axes) {
         if (this.selector.startsWith(axis, this.position)) {
            this.position += axis.length
            return axis
         }
      }
      throw new Error(`Invalid axis at position ${this.position} in selector "${this.selector}"`)
   }

   /** Parses a branch step. */
   private parseBranches(): StepBranches {
      const branches: SelectorToken[][] = []
      let currentBranch: SelectorToken[] = []
      this.position++
      while (this.position < this.length) {
         this.consumeWhitespace()
         const char = this.peek()
         if (char === '}') {
            this.position++ // Skip '}'
            if (currentBranch.length > 0) {
               branches.push(currentBranch)
            }
            return { type: 'branches', branches }
         } else if (char === '|') {
            this.position++ // Skip '|'
            if (currentBranch.length > 0) {
               branches.push(currentBranch)
               currentBranch = []
            }
         } else {
            const step = this.parseStep()
            currentBranch.push(step)
         }
      }

      throw new Error(`Unclosed '{' in selector "${this.selector}"`)
   }

   /** Parses a reducer after '='. */
   parseIndex(): StepIndex {
      this.consumeCharOrThrow('[')
      const index: number = this.consumeNextNumber()
      this.consumeCharOrThrow(']')
      return { type: 'index', index }
   }

   parseNot(): StepNot {
      this.consumeCharOrThrow('!(')
      const steps: SelectorToken[] = []
      while (true) {
         if (this.peek() === ')') break
         const step: SelectorToken = this.parseStep()
         steps.push(step)
      }
      this.consumeCharOrThrow(')')
      return { type: 'not', steps: steps }
   }

   parseHas(): StepHas {
      this.consumeCharOrThrow('(')
      const steps: SelectorToken[] = []
      while (true) {
         if (this.peek() === ')') break
         const step: SelectorToken = this.parseStep()
         steps.push(step)
      }
      this.consumeCharOrThrow(')')
      return { type: 'has', steps: steps }
   }
   parseHolds(): StepHolds {
      this.consumeCharOrThrow('(')
      const steps: SelectorToken[] = []
      while (true) {
         if (this.peek() === ')') break
         const step: SelectorToken = this.parseStep()
         steps.push(step)
      }
      this.consumeCharOrThrow(')')
      return { type: 'holds', steps: steps }
   }

   /** Parses a reducer after '='. */
   parseFilterCode(): StepFilterCode {
      this.consumeCharOrThrow('?')
      const code: string = this.consumeParenthesisGroup()
      return { type: 'filterCode', filterCode: code }
   }

   parseFilterKey(): StepFilterMountKey {
      const word = this.consumeNextWord()
      return { type: 'mount', key: word }
   }

   parseRoot(): StepIsRoot {
      this.consumeCharOrThrow('$')
      return { type: 'root' }
   }

   parseYes(): StepYes {
      this.consumeCharOrThrow('*')
      return { type: 'yes' }
   }

   parseFilterType(): StepFilterType {
      this.consumeCharOrThrow('@')
      const fieldType = this.consumeNextWord()
      return { type: 'filterType', fieldType }
   }

   // #region HELPERS
   private consumeParenthesisGroup(): string {
      const startPos = this.position
      let depth = 0
      while (this.position < this.length) {
         const char = this.selector[this.position]!
         this.position++
         if (char === '(') depth++
         else if (char === ')') {
            if (depth > 0) depth--
            else this.FAIL(`Unbalanced parentheses in selector "${this.selector}"`)
            if (depth === 0) break
         }
      }
      if (depth > 0) this.FAIL(`Unbalanced parentheses in selector "${this.selector}"`, startPos)
      return this.selector.slice(startPos, this.position)
   }

   private consumeNextWord(): string {
      // quoted word
      if (this.peek() === '"') {
         this.consumeCharOrThrow('"')
         const word = this.consumeWhile((char) => char !== '"')
         this.consumeCharOrThrow('"')
         return word
      }

      const word = this.consumeWhile((char) => /[a-zA-Z0-9_-]/.test(char))
      if (word.length === 0)
         this.FAIL(`Expected word at position ${this.position} in selector "${this.selector}"`)
      return word
   }

   private consumeNextNumber(): number {
      const word = this.consumeWhile((char) => /[-0-9_]/.test(char))
      if (word.length === 0)
         this.FAIL(`Expected word at position ${this.position} in selector "${this.selector}"`)
      return parseInt(word.replaceAll('_', ''), 10)
   }

   private consumeWhile(check: (char: string) => boolean): string {
      const startPos = this.position
      while (this.position < this.length) {
         const char = this.selector[this.position]!
         // console.log(`[🤠] `, this.position, char)
         if (!check(char)) break
         this.position++
      }
      return this.selector.slice(startPos, this.position)
   }

   private consumeCharOrThrow(expected: string): void {
      for (let i = 0; i < expected.length; i++) {
         const char = this.selector[this.position]
         if (char !== expected[i])
            this.FAIL(`Expected '${expected[i]}' at position ${this.position} in selector "${this.selector}"`)
         this.position++
      }
   }

   /** Returns the current character without advancing the position. */
   private peek(): string | undefined {
      return this.selector[this.position]
   }

   /** Skips whitespace characters. */
   private consumeWhitespace(): void {
      while (this.position < this.length && /\s/.test(this.selector[this.position]!)) {
         this.position++
      }
   }

   FAIL(
      //
      msg: string,
      from: Maybe<number> = undefined,
      to: number = this.position,
   ): never {
      from ??= to
      console.log(`❗️ ${/* chalk.red */ msg}`)
      console.log('❗️', this.selector)
      console.log('❗️', ' '.repeat(from) + /* chalk.redBright.bold */ '^'.repeat(to - from + 1))
      throw new Error(msg)
   }
}
