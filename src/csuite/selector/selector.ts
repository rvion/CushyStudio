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

import { Field } from '../model/Field'
import { exhaust } from '../utils/exhaust'

// import chalk from 'chalk'

// #region TYPES

// prettier-ignore
export type ASTStep =
    | StepAxis
    | StepFilterMountKey
    | StepFilterType
    | StepFilterCode
    | StepCollect
    | StepIndex
    | StepBranches
    | StepNot
    | StepHas
    | StepIsRoot
    | StepDebug
    | StepYes

type StepDebug = { type: 'debug' }
type StepIsRoot = { type: 'root' }
type StepAxis = { type: 'axis'; axis: Axis }
type StepFilterMountKey = { type: 'mount'; key: string }
type StepFilterType = { type: 'filterType'; fieldType: string }
type StepFilterCode = { type: 'filterCode'; filterCode: string }
type StepCollect = { type: 'collect'; collectCode?: string }
type StepIndex = { type: 'index'; index: number }
type StepBranches = { type: 'branches'; branches: ASTStep[][] }
type StepNot = { type: 'not'; steps: ASTStep[] }
type StepHas = { type: 'has'; steps: ASTStep[] }

type StepLocally = { type: 'has'; steps: ASTStep[] } // & // todo
type StepYes = { type: 'yes' }

export type FL_RawFieldSelector = Tagged<string, 'FL_RawFieldSelector'>
const axes: Axis[] = ['.', '>', '^', '<']
export type Axis =
   | '.' // child
   | '^' // parent
   | '>' // descendants
   | '<' // ancestors
// | '$' // root => is Filter
// | '&' // ownwer => is Filter

enum SelectorMode {
   MATCH = 1,
   SELECT = 2,
}

export interface Selector {
   match: (node: ASTNode) => boolean
   select: (node: ASTNode) => ASTNode[]
}

export type ASTNode = Field

export type ParsedSelector = {
   steps: ASTStep[]
}

/**
 * SelectorParser parses selector strings into an array of ASTSteps.
 */
export class FieldSelector {
   static cache = new Map<string, FieldSelector>()

   static match(
      //
      pattern: FieldPattern<Field>,
      field: Field,
      virtualParents?: Map<Field, Field>,
   ): boolean {
      if (pattern instanceof Field) return pattern === field
      if (Array.isArray(pattern)) return pattern.includes(field)
      if (pattern instanceof FieldSelector) return pattern.matches(field, virtualParents)
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

   axisSkips: { [key in CATALOG.AllFieldTypes]?: (node: any) => Field } = {
      shared: (node: Z.FShared<Field>) => node.child,
   }

   private position: number = 0
   private length: number
   readonly selector: string

   private constructor(
      selector: string | ParsedSelector,
      //   public from: Field | null = null,
   ) {
      if (typeof selector === 'string') {
         this.selector = selector
         this.length = selector.length
      } else {
         this.parsed = selector
         this.length = 0
         this.selector = FieldSelector.renderSteps(selector.steps)
      }
   }

   // match mode actually works against those:
   // get inverse() {
   //    const { steps } = this.parse()
   //    const stepsInverse: ASTStep[] = steps.toReversed().map((step) => {
   //       if (step.type === 'axis') {
   //          if (step.axis === '.') return { type: 'axis', axis: '^' }
   //          if (step.axis === '^') return { type: 'axis', axis: '.' }
   //          if (step.axis === '>') return { type: 'axis', axis: '<' }
   //          if (step.axis === '<') return { type: 'axis', axis: '>' }
   //       }
   //       return step
   //    })
   //    return stepsInverse
   // }

   // #region HIGH LEVEL API
   matches(
      //
      field: Field | Field[],
      ___?: Map<Field, Field>,
   ): boolean {
      const { fields } = this.runMatch(field, ___)
      return fields.length > 0
   }

   run(
      //
      field: Field | Field[],
      mode: SelectorMode,
      ___?: Map<Field, Field>,
   ) {
      if (mode === SelectorMode.MATCH) return this.runMatch(field, ___)
      if (mode === SelectorMode.SELECT) return this.runSelect(field, ___)
      throw new Error(`Unknown mode "${mode}"`)
   }
   runMatch(
      //
      field: Field | Field[],
      ___?: Map<Field, Field>,
   ): { fields: Field[]; values: any[] } {
      const { steps } = this.parse()
      return this.selectFrom_(field, steps, SelectorMode.MATCH, ___)
   }
   runSelect(
      //
      from: Field | Field[],
      ___?: Map<Field, Field>,
   ): { fields: Field[]; values: any[] } {
      const { steps } = this.parse()
      return this.selectFrom_(from, steps, SelectorMode.SELECT, ___)
   }

   isDebugEnabled = false
   private selectFrom_(
      //
      from: Field[] | Field,
      steps_: ASTStep[],
      mode: SelectorMode,
      ___?: Map<Field, Field>,
   ) {
      let candidates: Field[] = Array.isArray(from) ? from : [from]
      let steps = mode === SelectorMode.MATCH ? steps_.toReversed() : steps_
      const values: any[] = []
      for (const step of steps) {
         if (this.isDebugEnabled) {
            const stepIndex = steps.indexOf(step)
            const start = steps.slice(0, stepIndex)
            const startStr = FieldSelector.renderSteps(start)
            console.log(`[🧠] `, startStr, [candidates.map((c) => c.path)])
         }
         // early abort
         if (candidates.length === 0) return { fields: [], values: values }

         // mount
         if (step.type === 'mount') {
            candidates = candidates.filter((node) => node.mountKey === step.key)
         }

         // dbg
         else if (step.type === 'debug') {
            this.isDebugEnabled = true
         }

         // filterType
         else if (step.type === 'filterType') {
            candidates = candidates.filter(
               (node) => node.type === (step.fieldType === 'str' ? 'str' : step.fieldType),
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
            candidates = candidates.filter((node) => node.parent == null)
         }

         // has
         else if (step.type === 'has') {
            candidates = candidates.filter((node) => {
               const subSelector = FieldSelector.from({ steps: step.steps })
               const res = node.selectFirstOrNull(subSelector)
               return res != null
            })
         }

         // not
         else if (step.type === 'not') {
            // throw new Error('❌ not is not implemented')
            candidates = candidates.filter((node) => {
               const subSelector = FieldSelector.from({ steps: step.steps })
               const res = node.selectFirstOrNull(subSelector)
               return res == null
            })
         }

         // axis
         else if (step.type === 'axis') {
            candidates = this.applyAxis(candidates, step, mode, ___)
         }

         // axis
         else if (step.type === 'yes') {
            // noop
         }

         // branches
         else if (step.type === 'branches') {
            candidates = this.applyBranch(candidates, step, mode)
         }

         // index
         else if (step.type === 'index') {
            candidates = candidates.map((c) => c.childrenActive.at(step.index)).filter(Boolean) as Field[]
         }

         // collect
         else if (step.type === 'collect') {
            if (step.collectCode) {
               try {
                  const func = new Function(`return ${step.collectCode};`)
                  const result = func.call(candidates)
                  values.push(result)
               } catch (e) {
                  console.error(`Error evaluating collect code "${step.collectCode}":`, e)
               }
            }
         }
         // exhaus
         else {
            exhaust(step)
            throw new Error(`Unknown step type "${(step as any).type}"`)
         }
      }

      return { fields: candidates, values }
   }

   static renderSteps(steps: ASTStep[]): string {
      return steps.map(FieldSelector.renderStep).join('')
   }
   static renderStep(step: ASTStep): string {
      if (step.type === 'axis') return step.axis
      if (step.type === 'mount') return `${step.key}`
      if (step.type === 'filterType') return `@${step.fieldType}`
      if (step.type === 'filterCode') return `?(${step.filterCode})`
      if (step.type === 'collect') return `=(${step.collectCode})`
      if (step.type === 'index') return `[${step.index}]`
      if (step.type === 'branches')
         return `{${step.branches.map((b) => b.map(FieldSelector.renderStep).join('|')).join(' | ')}}`
      if (step.type === 'not') return `!(${step.steps.map(FieldSelector.renderStep).join('')})`
      if (step.type === 'has') return `:has(${step.steps.map(FieldSelector.renderStep).join('')})`
      if (step.type === 'root') return `$`
      if (step.type === 'debug') return `+`
      if (step.type === 'yes') return `*`
      exhaust(step)
      throw new Error(`Unknown step type "${(step as any).type}"`)
   }

   // #region MATCH
   /** Applies an axis step to the current candidates. */
   private applyAxis(
      //
      candidates: Field[],
      step: StepAxis,
      mode: SelectorMode,
      ___?: Map<Field, Field>,
   ): Field[] {
      const nextNodes: Set<Field> = new Set()
      const addChildNode = (node: Field | null): void => {
         if (node == null) return
         const skip_ = this.axisSkips[node.type]
         if (skip_ != null) node = skip_(node)
         nextNodes.add(node)
      }
      const addParentNode = (node: Field | null): void => {
         if (node == null) return
         const skip_ = this.axisSkips[node.type]
         if (skip_ != null) node = node.parent
         if (node == null) return
         nextNodes.add(node)
      }
      for (const at of candidates) {
         if (mode === SelectorMode.MATCH) {
            if (step.axis === '.') addParentNode(___?.get(at) ?? at.parent)
            else if (step.axis === '^') at.childrenAll.forEach(addChildNode)
            else if (step.axis === '>') at.ancestors.forEach(addParentNode)
            else if (step.axis === '<') at.descendants.forEach(addChildNode)
            else throw new Error(`Invalid axis "${step.axis}"`)
         } else {
            if (step.axis === '.') at.childrenAll.forEach(addChildNode)
            else if (step.axis === '^') addParentNode(___?.get(at) ?? at.parent)
            else if (step.axis === '>') at.descendants.forEach(addChildNode)
            else if (step.axis === '<') at.ancestors.forEach(addParentNode)
            else throw new Error(`Invalid axis "${step.axis}"`)
         }
      }

      return [...nextNodes.values()]
   }

   /** Applies a branch step to the current candidates. */
   private applyBranch(
      //
      candidates: Field[],
      step: StepBranches,
      mode: SelectorMode,
   ): Field[] {
      let branchResults: Field[] = []
      for (const branch of step.branches) {
         const branchSelector = new FieldSelector({ steps: branch })
         const { fields } = branchSelector.run(candidates, mode)
         branchResults = branchResults.concat(fields)
      }
      return Array.from(new Set(branchResults))
   }

   // #region PARSE
   parsed: ParsedSelector | null = null

   /**
    * Parses the entire selector string into an array of ASTSteps.
    * @returns ParsedSelector
    */
   parse(): ParsedSelector {
      if (this.parsed != null) return this.parsed

      const steps: ASTStep[] = []
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
   parseStep(): ASTStep {
      this.consumeWhitespace()
      const char = this.peek()!
      if (char === '{') return this.parseBranches()
      else if (char === '*') return this.parseYes()
      else if (char === '$') return this.parseRoot()
      else if (char === '@') return this.parseFilterType()
      else if (char === '=') return this.parseCollector()
      else if (char === '[') return this.parseIndex()
      else if (char === '?') return this.parseFilterCode()
      else if (char === '!') return this.parseNot()
      else if (char === ':') return this.parseHas()
      else if (char === '+') return this.parseDebug()
      else if (/[a-zA-Z0-9_-]/.test(char!)) return this.parseFilterKey()
      else if (axes.includes(char as any)) return this.parseAxisStep()
      else
         this.FAIL(
            `Unexpected character '${char}' at position ${this.position} in selector "${this.selector}"`,
         )
   }

   /** Parses a single axis step. */
   private parseAxisStep(): ASTStep {
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
      const branches: ASTStep[][] = []
      let currentBranch: ASTStep[] = []
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
   parseCollector(): StepCollect {
      this.consumeCharOrThrow('=')
      const code: string = this.consumeParenthesisGroup()
      return { type: 'collect', collectCode: code }
   }

   /** Parses a reducer after '='. */
   parseIndex(): StepIndex {
      this.consumeCharOrThrow('[')
      const index: number = this.consumeNextNumber()
      this.consumeCharOrThrow(']')
      return { type: 'index', index }
   }

   parseNot(): StepNot {
      this.consumeCharOrThrow('!')
      this.consumeCharOrThrow('(')
      const steps: ASTStep[] = []
      while (true) {
         if (this.peek() === ')') break
         const step: ASTStep = this.parseStep()
         steps.push(step)
      }
      this.consumeCharOrThrow(')')
      return { type: 'not', steps: steps }
   }

   parseHas(): StepHas {
      this.consumeCharOrThrow(':')
      this.consumeCharOrThrow('h')
      this.consumeCharOrThrow('a')
      this.consumeCharOrThrow('s')
      this.consumeCharOrThrow('(')
      const steps: ASTStep[] = []
      while (true) {
         if (this.peek() === ')') break
         const step: ASTStep = this.parseStep()
         steps.push(step)
      }
      this.consumeCharOrThrow(')')
      return { type: 'has', steps: steps }
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
