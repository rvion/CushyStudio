import type { BaseSchema } from '../csuite/model/BaseSchema'
import type { FieldConfig } from '../csuite/model/FieldConfig'
import type { FieldSerial } from '../csuite/model/FieldSerial'
import type { Repository } from '../csuite/model/Repository'
import type { Problem_Ext } from '../csuite/model/Validation'
import type { Tree } from '@lezer/common'

import { produce } from 'immer'

import { registerFieldClass } from '../csuite/fields/WidgetUI.DI'
import { Field } from '../csuite/model/Field'
import { compilePrompt } from './compiler/_compile'
import { parser } from './grammar/grammar.parser'
import { PromptAST } from './grammar/grammar.practical'
import { WidgetPromptCollapsibleUI } from './widgets/WidgetPromptCollapsibleUI'
import { WidgetPromptUI } from './widgets/WidgetPromptUI'

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
export type Field_prompt_config = FieldConfig<
   {
      default?: string
      placeHolder?: string
   },
   Field_prompt_types
>

// #region Serial from value
export const Field_prompt_fromValue = (val: Field_prompt_value): Field_prompt_serial => ({
   $: 'prompt',
   val: val.text,
})

// #region Serial
export type Field_prompt_serial = FieldSerial<{
   $: 'prompt'

   /** when undefined, the field is considered unset */
   val?: string
}>

// #region Value
export type Field_prompt_value = Field_prompt
export type Field_prompt_unchecked = Field_prompt

// #region $FieldTypes
export type Field_prompt_types = {
   $Type: 'prompt'
   $Config: Field_prompt_config
   $Serial: Field_prompt_serial
   $Value: Field_prompt_value
   $Unchecked: Field_prompt_value | undefined
   $Field: Field_prompt
   $Child: never
   $Reflect: Field_prompt_types
}

// #region State
export class Field_prompt extends Field<Field_prompt_types> {
   // #region types
   static readonly type: 'prompt' = 'prompt'
   static readonly emptySerial: Field_prompt_serial = { $: 'prompt' }
   static migrateSerial(): undefined {}

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_prompt>,
      initialMountKey: string,
      serial?: Field_prompt_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)

      this.init(serial, {
         DefaultHeaderUI: false,
         DefaultBodyUI: false,
      })
   }

   get isOwnSet(): boolean {
      return typeof this.serial.val === 'string'
   }

   // #region UI
   DefaultHeaderUI = WidgetPromptCollapsibleUI
   DefaultBodyUI = WidgetPromptUI // WidgetPromptUI

   // DefaultHeaderUI = () => createElement(WidgetPrompt_LineUI, { widget: this })
   // DefaultBodyUI = () => createElement(WidgetPromptUI, { widget: this })
   // DefaultHeaderUI = WidgetPrompt_LineUI
   // DefaultBodyUI = WidgetPromptUI

   get isCollapsible(): boolean {
      return true
   }

   // #region validation
   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   // #region change tracking
   get hasChanges(): boolean {
      return (this.serial.val ?? '') !== (this.config.default ?? '')
   }

   protected setOwnSerial(next: Field_prompt_serial): void {
      // assign default value if not value set but has default value
      if (next.val == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.val = def))
      }

      this.assignNewSerial(next)
   }

   // sentinel value so we know when to trigger update effect in the UI to update
   // codemirror uncontrolled component
   _valueUpdatedViaAPIAt: Maybe<Timestamp> = null

   /** DO NOT CALL YOURSELF; use `field.text =` setter instead */
   setText_INTERNAL(next: string): void {
      if (this.serial.val === next) return
      this.runInValueTransaction(() => {
         this.patchSerial((draft) => {
            draft.val = next
         })
      })
   }

   setText(next: string): void {
      this.text = next
   }
   set text(next: string) {
      if (this.serial.val === next) return
      this.runInSerialTransaction(() => {
         // widget prompt uses codemirror, and codemirror manage its internal state itsef.
         // making the widget "uncontrolled". Usual automagical mobx-reactivity may not always apply.
         // To allow CodeMirror editor to react to external value changes, we need to use an effect in the UI.
         // To know when to run the effect, we update `valueUpdatedViaAPIAt` here to trigger the effect.
         this._valueUpdatedViaAPIAt = Date.now() as Timestamp
         this.patchSerial((draft) => {
            draft.val = next
         })
      })
   }

   // the raw unparsed text
   get text(): string {
      return this.serial.val ?? ''
   }

   // the parsed tree
   get ast(): PromptAST {
      return new PromptAST(this.text)
   }

   get ast_generic(): Tree {
      return parser.parse(this.serial.val ?? '')
   }

   get defaultValue(): string | undefined {
      return this.config.default
   }

   // #region value
   get value(): Field_prompt_value {
      return this
      // return {
      //     text: this.serial.val ?? this.config.default ?? '',
      //     tree: this.ast,
      // }
   }

   set value(next: Field_prompt_value) {
      if (next !== this) throw new Error('not implemented')
      // do nothing, value it the instance itself
   }

   get value_or_fail(): Field_prompt_value {
      if (this.serial.val == null) throw new Error('Field_prompt.value_or_fail: not set')
      return this
   }

   get value_unchecked(): Field_prompt_unchecked {
      return this
   }

   get value_or_zero(): Field_prompt_value {
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
