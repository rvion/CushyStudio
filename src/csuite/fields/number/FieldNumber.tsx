import type { NumberFormat } from '../../i18n/i18n'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'
import { computed } from 'mobx'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field } from '../../model/Field'
import { isProbablySerialString, registerFieldClass } from '../WidgetUI.DI'
import { WidgetNumberUI } from './WidgetNumberUI'

// #region CONFIG
export type Field_number_config = FieldConfig<
   {
      mode: NumberFormat
      default?: number
      min?: number
      max?: number
      softMin?: number
      softMax?: number
      step?: number
      suffix?: string
      text?: string
      hideSlider?: boolean
      forceSnap?: boolean
      /** used as suffix */
      unit?: string
   },
   Field_number_types
>

// #region SERIAL
export type Field_number_serial = FieldSerial<{
   $: 'number'
   value?: number | string | null
}>

// #region VALUE
export type Field_number_value = number
export type Field_number_unchecked = Field_number_value | string | null | undefined

// #region TYPES
export type Field_number_types = {
   $Type: 'number'
   $Config: Field_number_config
   $Serial: Field_number_serial
   $Value: Field_number_value
   $Unchecked: Field_number_unchecked
   $Field: Field_number
   $Child: never
   $Reflect: Field_number_types
}

// #region STATE
export class Field_number extends Field<Field_number_types> {
   // #region TYPE
   static readonly type: 'number' = 'number'
   static readonly emptySerial: Field_number_serial = { $: 'number' }
   static codegenValueType(config: Field_number_config): string {
      return `number`
   }
   static migrateSerial(serial: object): Maybe<Field_number_serial> {
      // migrate from string with number typed as string
      if (isProbablySerialString(serial)) {
         const prop = serial.value
         if (prop != null && parseInt(prop, 10) === +prop) {
            return { $: 'number', value: +prop }
         }
      }
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_number>,
      initialMountKey: string,
      serial?: Field_number_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (FieldNumber#constructor ❌)`)
      // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(this.serial)} (FieldNumber#constructor ❌)`)
      this.init(serial, {
         value: computed,
         DefaultHeaderUI: false,
         DefaultBodyUI: false,
      })
   }

   // #region SERIAL
   protected setOwnSerial(next: Field_number_serial): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      } else if (typeof next.value === 'string') {
         const parsed = csuiteConfig.i18n.ui.number.parse(next.value, this.config.mode)
         if (!isNaN(parsed)) next = produce(next, (draft) => void (draft.value = parsed))
      }
      // assign given serial (or default one)
      this.assignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI = WidgetNumberUI
   DefaultBodyUI: undefined = undefined

   readonly forceSnap: boolean = false

   get defaultValue(): number | undefined {
      return this.config.default
   }

   get isOwnSet(): boolean {
      return this.serial.value != null
   }

   get hasChanges(): boolean {
      return this.serial.value !== this.defaultValue
   }

   get ownConfigSpecificProblems(): Problem_Ext {
      const i18n = csuiteConfig.i18n
      const out: string[] = []
      const min = this.config.min
      const max = this.config.max
      if (min != null && max != null) {
         if (min > max) {
            // 💬 2024-09-17 rvion: lol, no need to check the opposite 🤦‍♂️
            out.push(i18n.err.int.minGreaterThanMax({ min, max }))
         }
         if (min === max) {
            out.push(i18n.err.int.minSameThanMax({ minmax: min }))
         }
      }
      const def = this.config.default
      if (def != null) {
         if (min != null && def < min) out.push(i18n.err.int.defaultTooSmall({ min, def }))
         if (max != null && def > max) out.push(i18n.err.int.defaultTooBig({ def, max }))
      }
      return out
   }
   get ownTypeSpecificProblems(): Problem_Ext {
      if (!this.isSet) return null

      if (typeof this.value_unchecked === 'string') {
         return csuiteConfig.i18n.err.number.notANumber
      }

      const value = this.value_or_zero
      // < MIN
      if (this.config.min != null && value < this.config.min) {
         return csuiteConfig.i18n.err.number.lessThanMin({ min: this.config.min })
      }
      // > MAX
      if (this.config.max != null && value > this.config.max) {
         return csuiteConfig.i18n.err.number.greaterThanMax({ max: this.config.max })
      }
      return null
   }

   get value(): Field_number_value {
      return this.value_or_fail
   }

   set value(next: Field_number_value | string | null) {
      if (this.serial.value === next) return

      if (typeof next === 'string') {
         if (next.trim() === '') {
            next = null
         } else {
            const parsed = csuiteConfig.i18n.ui.number.parse(next, this.config.mode)
            if (!isNaN(parsed)) next = parsed
         }
      }

      this.patchInTransaction((draft, tct) => {
         draft.value = next
      })
   }

   get value_or_fail(): Field_number_value {
      const val = this.value_unchecked
      if (val == null) throw new Error('Field_number.value_or_fail: not set')
      if (typeof val === 'string') throw new Error('Field_number.value_or_fail: invalid number')

      return val
   }

   get value_or_zero(): number {
      if (typeof this.value_unchecked === 'string') return 0

      return this.value_unchecked ?? 0
   }

   get value_unchecked(): Field_number_unchecked {
      return this.serial.value
   }

   set value_unchecked(next: Field_number_unchecked) {
      this.patchSerial((serial) => void (serial.value = next))
   }

   setValueFromString(stringValue: string): void {
      const parsed = csuiteConfig.i18n.ui.number.parse(stringValue, this.config.mode)
      if (isNaN(parsed)) return
      this.value = parsed
   }

   // #region SETTERS
   /** randomize respect (soft)Min and (soft)max */
   randomize(): void {
      const min = this.config.softMin ?? this.config.min ?? 0
      const max = this.config.softMax ?? this.config.max ?? 100
      this.value = Math.floor(Math.random() * (max - min + 1))
   }
}

// DI
registerFieldClass('number', Field_number)
