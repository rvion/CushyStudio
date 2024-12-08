import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { Field_string_serial } from '../string/FieldString'
import type { ISOString } from './ISOString'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { WidgetDate_HeaderUI } from './WidgetDateUI2'

export type Field_date_config = FieldConfig<
   {
      default?: Date | (() => Date)
      placeHolder?: string
      innerIcon?: IconName
   },
   Field_date_types
>

// Value
export type Field_date_value = Date
export type Field_date_unchecked = Field_date_value | undefined

// SERIAL
export type Field_date_serial = FieldSerial<{
   $: 'date'
   value?: ISOString
}>

// TYPES
export type Field_date_types = {
   $Type: 'date'
   $Config: Field_date_config
   $Serial: Field_date_serial
   $Value: Field_date_value
   $Unchecked: Field_date_unchecked
   $Field: Field_date
   $Child: never
   $Reflect: Field_date_types
}

export class Field_date extends Field<Field_date_types> {
   static readonly type: 'date' = 'date'

   static migrateSerial(serial: FieldSerial<unknown>): Field_date_serial | null {
      if (serial == null) return null

      if (serial.$ === 'str') {
         const stringSerial = serial as Field_string_serial

         if (!stringSerial.value) return { $: this.type }

         const parsed = new Date(stringSerial.value)
         if (!isNaN(parsed.getTime())) {
            return {
               $: this.type,
               value: parsed.toISOString(),
            }
         }
      }

      return null
   }

   readonly DefaultHeaderUI: CovariantFC<{ field: Field_date; readonly?: boolean }> | undefined =
      WidgetDate_HeaderUI
   readonly DefaultBodyUI: CovariantFC<{ field: Field_date }> | undefined = undefined

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_date>,
      initialMountKey: string,
      serial?: Field_date_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   get isOwnSet(): boolean {
      return this.serial.value !== undefined
   }

   get defaultValue(): Field_date_value | undefined {
      if (typeof this.config.default === 'function') return this.config.default()
      return this.config.default
   }

   private _value: Field_date_value | undefined = undefined
   get selectedValue(): Field_date_value | undefined {
      return this._value
   }

   get value(): Field_date_value {
      return this.value_or_fail
   }

   set value(next: Field_date_value) {
      this._setValue(next)
   }

   private _setValue(value: Field_date_value | undefined): void {
      this._value = value
      this.runInTransaction(() => {
         this.patchSerial((draft) => {
            draft.value = value?.toISOString()
         })
      })
   }

   get value_or_fail(): Field_date_value {
      const val = this.value_unchecked
      if (val == null) throw new Error('Field_date.value_or_fail: not set')
      return val
   }

   get value_or_zero(): Field_date_value {
      return this.value_unchecked ?? new Date() // ⚠️ zero value set to now ? Maybe new Date(0) would be saner
   }

   get value_unchecked(): Field_date_unchecked {
      return this.selectedValue
   }

   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      if (this._value != null && isNaN(this._value.getTime()))
         return {
            severity: Severity.Error,
            message: 'Invalid date',
         }

      return null
   }

   get hasChanges(): boolean {
      return this.serial.value != this.defaultValue?.toISOString()
   }

   protected setOwnSerial(next: Field_date_serial): void {
      if (next.value === undefined) {
         const def = this.defaultValue
         if (def !== undefined)
            next = produce(next, (draft) => {
               draft.value = def.toISOString()
            })
      }

      this.assignNewSerial(next)

      const raw = this.serial.value
      this._value = raw == null ? undefined : new Date(raw)
   }

   setValueFromString(value: string): void {
      const nextValue = new Date(value)
      // 🤔 Maybe we could just unset it instead of throwing ?
      if (isNaN(nextValue.getTime())) throw new Error('Field_date.setValueFromString: invalid date')
      this.value = nextValue
   }
}
