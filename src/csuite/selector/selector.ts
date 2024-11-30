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
import type { Field } from '../model/Field'

// import chalk from 'chalk'

// #region TYPES

// prettier-ignore
export type ASTStep =
    | StepAxis
    | StepFilterMountKey
    | StepFilterType
    | StepFilterCode
    | StepCollect
    | StepBranches

type StepAxis = { type: 'axis'; axis: Axis }
type StepFilterMountKey = { type: 'mount'; key: string }
type StepFilterType = { type: 'filterType'; fieldType: string }
type StepFilterCode = { type: 'filterCode'; filterCode: string }
type StepCollect = { type: 'collect'; collectCode?: string }
type StepBranches = { type: 'branches'; branches: ASTStep[][] }

const axes: Axis[] = ['$', '.', '>', '^', '<']
export type Axis =
   | '$' // root
   | '.' // child
   | '>' // descendants
   | '^' // parent
   | '<' // ancestors

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
   private position: number = 0
   private length: number
   private selector: string

   constructor(
      selector: string | ParsedSelector,
      //   public from: Field | null = null,
   ) {
      if (typeof selector === 'string') {
         this.selector = selector
         this.length = selector.length
      } else {
         this.parsed = selector
         this.length = 0
         this.selector = ''
      }
   }

   // #region HIGH LEVEL API
   match(field: Field, from?: Field): boolean {
      const { fields: selected } = this.selectFrom(from ?? field.root.descendantsIncludingSelf)
      return selected.includes(field)
   }

   selectFrom(from: Field | Field[]): { fields: Field[]; values: any[] } {
      const { steps } = this.parse()
      let candidates: Field[] = Array.isArray(from) ? from : [from]
      const values: any[] = []
      for (const step of steps) {
         // early abort
         if (candidates.length === 0) return { fields: [], values: values }

         if (step.type === 'mount') candidates = candidates.filter((node) => node.mountKey === step.key)
         else if (step.type === 'filterType')
            candidates = candidates.filter(
               (node) => node.type === (step.fieldType === 'str' ? 'str' : step.fieldType),
            )
         else if (step.type === 'filterCode')
            candidates = candidates.filter((node) => {
               try {
                  const func = new Function('node', `return ${step.filterCode.replaceAll('@.', 'node.')};`)
                  return func(node)
               } catch (e) {
                  console.error(`Error evaluating filter code "${step.filterCode}":`, e)
                  return false
               }
            })
         else if (step.type === 'axis') candidates = this.applyAxis(candidates, step)
         else if (step.type === 'branches') candidates = this.applyBranch(candidates, step)
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
         } else throw new Error(`Unknown step type "${(step as any).type}"`)
      }

      return { fields: candidates, values }
   }

   // #region MATCH
   /** Applies an axis step to the current candidates. */
   private applyAxis(candidates: Field[], step: StepAxis): Field[] {
      const nextNodes: Set<Field> = new Set()
      const addNode = (node: Field | null): void => {
         if (node == null) return
         nextNodes.add(node)
      }
      for (const at of candidates) {
         if (step.axis === '$') addNode(at.root)
         else if (step.axis === '.') at.childrenAll.forEach(addNode)
         else if (step.axis === '>') at.descendants.forEach(addNode)
         else if (step.axis === '^') addNode(at.parent)
         else if (step.axis === '<') at.ancestors.forEach(addNode)
         else throw new Error(`Invalid axis "${step.axis}"`)
      }

      return [...nextNodes.values()]
   }

   /** Applies a branch step to the current candidates. */
   private applyBranch(candidates: Field[], step: StepBranches): Field[] {
      let branchResults: Field[] = []
      for (const branch of step.branches) {
         const branchSelector = new FieldSelector('')
         branchSelector.parsed = { steps: branch }
         const { fields: selected } = branchSelector.selectFrom(candidates)
         branchResults = branchResults.concat(selected)
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
      else if (char === '@') return this.parseFilterType()
      else if (char === '=') return this.parseCollector()
      else if (char === '?') return this.parseFilterCode()
      else if (/[a-zA-Z0-9]/.test(char!)) return this.parseFilterKey()
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
   parseFilterCode(): StepFilterCode {
      this.consumeCharOrThrow('?')
      const code: string = this.consumeParenthesisGroup()
      return { type: 'filterCode', filterCode: code }
   }

   parseFilterKey(): StepFilterMountKey {
      const word = this.consumeNextWord()
      return { type: 'mount', key: word }
   }

   parseFilterType(): StepFilterType {
      this.consumeCharOrThrow('@')
      const fieldType = this.consumeNextWord()
      return { type: 'filterType', fieldType }
   }

   // /** Splits a filter string by '|' operators not enclosed in parentheses. */
   // private splitByOr(filterStr: string): string[] {
   //     const parts: string[] = []
   //     let current = ''
   //     let depth = 0

   //     for (let i = 0; i < filterStr.length; i++) {
   //         const char = filterStr[i]
   //         if (char === '(') {
   //             depth++
   //         } else if (char === ')') {
   //             if (depth > 0) depth--
   //             else {
   //                 throw new Error(`Unbalanced parentheses in filter string "${filterStr}"`)
   //             }
   //         } else if (char === '|' && depth === 0) {
   //             parts.push(current)
   //             current = ''
   //             continue
   //         }
   //         current += char
   //     }

   //     if (depth !== 0) {
   //         throw new Error(`Unbalanced parentheses in filter string "${filterStr}"`)
   //     }

   //     if (current) {
   //         parts.push(current)
   //     }

   //     return parts
   // }

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
      const word = this.consumeWhile((char) => /[a-zA-Z0-9_]/.test(char))
      if (word.length === 0)
         this.FAIL(`Expected word at position ${this.position} in selector "${this.selector}"`)
      return word
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
      const char = this.selector[this.position]
      if (char !== expected)
         throw new Error(`Expected '${expected}' at position ${this.position} in selector "${this.selector}"`)
      this.position++
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
