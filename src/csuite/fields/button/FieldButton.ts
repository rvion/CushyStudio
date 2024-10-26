import type { FrameAppearance } from '../../frame/FrameTemplates'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { isProbablySerialBool, isProbablySerialButton, registerFieldClass } from '../WidgetUI.DI'
import { WidgetButtonUI } from './WidgetButtonUI'

export type Field_button_context<K> = {
   context: K
   widget: Field_button<K>
}

// #region CONFIG
export type Field_button_config<K = any> = FieldConfig<
   {
      text?: string
      /** @default false */
      default?: boolean
      look?: FrameAppearance
      expand?: boolean
      useContext?: () => K
      onClick?: (ctx: Field_button_context<K>) => void
   },
   Field_button_types<K>
>

// #region SERIAL
export type Field_button_serial = FieldSerial<{
   $: 'button'
   value?: boolean
}>

// #region VALUE
export type Field_button_value = boolean
export type Field_button_unchecked = Field_button_value | undefined

// #region TYPES
export type Field_button_types<K> = {
   $Type: 'button'
   $Config: Field_button_config<K>
   $Serial: Field_button_serial
   $Value: Field_button_value
   $Unchecked: Field_button_unchecked
   $Field: Field_button<K>
   $Child: never
   $Reflect: Field_button_types<K>
}

// STATE
export class Field_button<K> extends Field<Field_button_types<K>> {
   // #region TYPE
   static readonly type: 'button' = 'button'
   static readonly emptySerial: Field_button_serial = { $: 'button' }
   static migrateSerial(serial: object): Maybe<Field_button_serial> {
      if (isProbablySerialBool(serial) || isProbablySerialButton(serial)) {
         if ('val' in serial) {
            const recoveredVal = serial.val
            if (typeof recoveredVal !== 'boolean')
               throw new Error(`Field_button: invalid legacy 'val' serial`)
            const { val, $, ...rest } = serial
            const out: Field_button_serial = {
               $: this.type,
               value: recoveredVal,
               ...rest,
            }
            return out
         }
      }
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_button<K>>,
      initialMountKey: string,
      serial?: Field_button_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      const config = schema.config
      if (config.text) config.label = config.label ?? ` `
      this.init(serial, {
         DefaultHeaderUI: false,
         DefaultBodyUI: false,
      })
   }

   // #region UI
   readonly DefaultHeaderUI = WidgetButtonUI
   readonly DefaultBodyUI = undefined

   // #region SERIAL
   protected setOwnSerial(next: Field_button_serial): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      this.assignNewSerial(next)
   }

   // #region CHILDREN

   // #region VALUE
   get value(): Field_button_value {
      return this.value_or_fail
      // if (!this.hasMagicDefault && !this.isSet) throw new Error('Field_Button.value: not set')
      // return this.serial.value ?? this.defaultValue ?? false /* <- zero */
   }

   set value(next: boolean) {
      if (this.serial.value === next) return
      this.runInValueTransaction(() => this.patchSerial((serial) => void (serial.value = next)))
   }

   get value_or_fail(): Field_button_value {
      const val = this.value_unchecked
      if (val == null) throw new Error('Field_button.value_or_fail: not set')
      return val
   }

   get value_or_zero(): Field_button_value {
      return this.serial.value ?? false
   }

   get value_unchecked(): Field_button_unchecked {
      return this.serial.value
   }

   get defaultValue(): boolean | undefined {
      return this.config.default
   }

   // #region CHANGES
   get isOwnSet(): boolean {
      return this.serial.value !== undefined
   }

   get hasChanges(): boolean {
      if (!this.isSet) return false
      if (this.serial.value === this.defaultValue) return false
      return true
   }

   // #region VALIDATION

   // #region PROBLEMS
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region NULLABILITY
   get canBeSetOnOrOff(): true {
      return true
   }

   /** set the value to true */
   setOn(): void {
      this.value = true
   }

   /** set the value to false */
   setOff(): void {
      this.value = false
   }

   // #region SETTERS
   /** set value to true if false, and to false if true */
   toggle(): boolean {
      return (this.value = !this.value_or_zero)
   }

   // #region MOCK
   randomize(): void {
      const r = Math.random()
      this.value = r > 0.5
   }
}

// DI
registerFieldClass('button', Field_button)
