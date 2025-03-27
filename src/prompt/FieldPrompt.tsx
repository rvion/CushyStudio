import type { CSchema } from '../csuite/model/CSchema'
import type { FieldConstructor } from '../csuite/model/FieldConstructor'
import type { Repository } from '../csuite/model/Repository'
import type { Problem_Ext } from '../csuite/model/Validation'
import type { Tree } from '@lezer/common'

import { produce } from 'immer'

import { registerFieldClass } from '../csuite/fields/WidgetUI.DI'
import { Field } from '../csuite/model/Field'
import { compilePrompt } from './compiler/_compile'
import { parser } from './grammar/grammar.parser'
import { PromptAST } from './grammar/grammar.practical'

export type CompiledPrompt = {
   /** e.g. "score_9 score_8 BREAK foo bar baz" */
   promptIncludingBreaks: string
   /**
    * only filled when prompt has `break`s
    * will return list of break-separated subprompts
    * e.g. ["score_9 score_8"], ["foo bar baz"]" */
   subPrompts: string[]
   debugText: string[]
}

// #region Config
export type Field_prompt_ownConfig = {
   default?: string
   placeHolder?: string
}

// #region Serial from value
export const Field_prompt_fromValue = (val: Field_prompt_value): Field_prompt['Ҩserial'] => ({
   $: 'prompt',
   val: val.text,
})

// #region Serial
export type Field_prompt_ownSerial = {
   $: 'prompt'
   /** when undefined, the field is considered unset */
   val?: string
}

// #region Value
export type Field_prompt_value = Field_prompt
export type Field_prompt_unchecked = Field_prompt

// #region State
export interface Field_prompt {
   ['Ҩtype']: 'prompt'
   ['ҨownConfig']: Field_prompt_ownConfig
   ['ҨownSerial']: Field_prompt_ownSerial
   ['Ҩvalue']: Field_prompt_value
   ['Ҩunchecked']: Field_prompt_value | undefined
   Ҩfield: Field_prompt
   ['Ҩchild']: never
}
export class Field_prompt extends Field {
   // #region types
   static readonly type: 'prompt' = 'prompt'
   static readonly unsetSerial: Field_prompt['Ҩserial'] = { $: 'prompt' }
   static codeForTypescriptValue = () => `Field_prompt`
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val'])
   static generateSerial(
      value: Maybe<Field_prompt['Ҩvalue']>,
      config: Field_prompt['Ҩconfig'],
   ): Field_prompt['Ҩserial'] {
      if (value == null && config.default == null) return this.unsetSerial
      return { $: 'prompt', val: value != null ? value.ϟserial.val : config.default }
   }
   static migrateSerial(): undefined {}

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_prompt>,
      initialMountKey: string,
      serial?: Field_prompt['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   get ϟisOwnSet(): boolean {
      return typeof this.ϟserial.val === 'string'
   }

   // #region UI
   // DefaultHeaderUI = WidgetPromptCollapsibleUI
   // DefaultBodyUI = WidgetPromptUI // WidgetPromptUI

   get ϟisCollapsible(): boolean {
      return true
   }

   // #region validation
   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   // #region change tracking
   get ϟhasChanges(): boolean {
      return (this.ϟserial.val ?? '') !== (this.ϟconfig.default ?? '')
   }

   protected ϟsetOwnSerial(next: Field_prompt['Ҩserial']): void {
      // assign default value if not value set but has default value
      if (next.val == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.val = def))
      }

      this.ϟassignNewSerial(next)
   }

   // sentinel value so we know when to trigger update effect in the UI to update
   // codemirror uncontrolled component
   _valueUpdatedViaAPIAt: Maybe<Timestamp> = null

   /** DO NOT CALL YOURSELF; use `field.text =` setter instead */
   setText_INTERNAL(next: string): void {
      if (this.ϟserial.val === next) return
      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((draft) => {
            draft.val = next
         })
      })
   }

   setText(next: string): void {
      this.text = next
   }
   set text(next: string) {
      if (this.ϟserial.val === next) return
      this.ϟrunInTransaction(() => {
         // widget prompt uses codemirror, and codemirror manage its internal state itsef.
         // making the widget "uncontrolled". Usual automagical mobx-reactivity may not always apply.
         // To allow CodeMirror editor to react to external value changes, we need to use an effect in the UI.
         // To know when to run the effect, we update `valueUpdatedViaAPIAt` here to trigger the effect.
         this._valueUpdatedViaAPIAt = Date.now() as Timestamp
         this.ϟpatchSerial((draft) => {
            draft.val = next
         })
      })
   }

   // the raw unparsed text
   get text(): string {
      return this.ϟserial.val ?? ''
   }

   // the parsed tree
   get ast(): PromptAST {
      return new PromptAST(this.text)
   }

   get ast_generic(): Tree {
      return parser.parse(this.ϟserial.val ?? '')
   }

   get defaultValue(): string | undefined {
      return this.ϟconfig.default
   }

   override ϟset(valOrKey: Field_prompt | string): this {
      if (valOrKey instanceof Field_prompt) this.ϟvalue = valOrKey.ϟvalue
      else this.ϟpatchInTransaction((next) => void (next.val = valOrKey))
      return this
   }

   override ϟgetSetValue(): this['Ҩsetvalue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.ϟserial.val
   }

   // #region value
   get ϟvalue(): Field_prompt_value {
      return this
      // return {
      //     text: this.serial.val ?? this.config.default ?? '',
      //     tree: this.ast,
      // }
   }

   set ϟvalue(next: Field_prompt_value) {
      if (next !== this) throw new Error('not implemented')
      // do nothing, value it the instance itself
   }

   get ϟvalue_or_fail(): Field_prompt_value {
      if (this.ϟserial.val == null) throw new Error('Field_prompt.value_or_fail: not set')
      return this
   }

   get ϟvalue_unchecked(): Field_prompt_unchecked {
      return this
   }

   public ϟisValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_prompt)) return false
      return this.ϟvalue_unchecked === other.ϟvalue_unchecked
   }

   get ϟvalue_or_zero(): Field_prompt_value {
      return this
   }

   // #region ...

   get animateResize(): false {
      // codemirror resize automatically every time a line is added
      // the animation is just annoying there.
      return false
   }

   compile = (p: {
      /** for wildcard */
      seed?: number
      onLora: (lora: Comfy.Slots['LoraLoader.lora_name']) => void
      /** @default true */
      printWildcards?: boolean
   }): CompiledPrompt => {
      return compilePrompt({
         ctx: cushy,
         text: this.text,
         //
         onLora: p.onLora,
         seed: p.seed,
         printWildcards: p.printWildcards,
      })
   }
}

// DI
registerFieldClass('prompt', Field_prompt)
Field_prompt satisfies FieldConstructor<Field_prompt>
