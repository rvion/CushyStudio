import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { Field_string_serial } from '../string/FieldString'
import type { ISOString } from './ISOString'

import { produce } from 'immer'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { isProbablySerialString } from '../WidgetUI.DI'
import { WidgetDate_HeaderUI } from './WidgetDateUI'

// #region Config
export type Field_date_config<VALUE> = FieldConfig<
   {
      default?: VALUE | undefined | null | (() => VALUE | undefined | null)
      placeHolder?: string
      innerIcon?: IconName
      serialize: (d: VALUE) => ISOString | null
      /* This should throw if the string is invalid */
      deserialize: (s: ISOString) => VALUE | null
      valueToDate: (v: VALUE) => Date
      dateToValue: (d: Date) => VALUE
      time: boolean
   },
   Field_date_types<VALUE>
>

// #region Value
export type Field_date_value<VALUE> = VALUE
export type Field_date_unchecked<VALUE> = Maybe<Field_date_value<VALUE>>

// #region Serial
export type Field_date_serial = FieldSerial<{
   $: 'date'
   value?: ISOString | null
}>

// #region Types
export type Field_date_types<VALUE> = {
   $Type: 'date'
   $Config: Field_date_config<VALUE>
   $Serial: Field_date_serial
   $Value: Field_date_value<VALUE>
   $Unchecked: Field_date_unchecked<VALUE>
   $Field: Field_date<VALUE>
   $Child: never
   $Reflect: Field_date_types<VALUE>
}

// #region State
export class Field_date<VALUE> extends Field<Field_date_types<VALUE>> {
   // #region static
   static readonly type: 'date' = 'date'
   static readonly emptySerial: Field_date_serial = { $: 'date' }

   // #region migration
   static migrateSerial(serial: object): Field_date_serial | null {
      const anySerial = serial as any
      if (
         typeof anySerial === 'object' &&
         ['datetimezoned', 'plaindate'].includes(anySerial?.$) &&
         (typeof anySerial.value === 'string' || anySerial.value === null)
      ) {
         return { $: 'date', value: anySerial.value }
      }

      if (isProbablySerialString(serial)) {
         const stringSerial = serial as Field_string_serial
         if (!stringSerial.value) return { $: this.type }
         const parsed = new Date(stringSerial.value)
         if (!isNaN(parsed.getTime())) {
            return { $: this.type, value: parsed.toISOString() }
         }
      }

      return null
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_date<VALUE>>,
      initialMountKey: string,
      serial?: Field_date_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   protected setOwnSerial(next: Field_date_serial): void {
      if (next.value === undefined) {
         const def = this.defaultValue
         if (def !== undefined)
            next = produce(next, (draft) => {
               draft.value = def == null ? def : this.config.serialize(def)
            })
      }

      this.assignNewSerial(next)

      const raw = this.serial.value
      let deserialized: Field_date_value<VALUE> | null | undefined = null
      try {
         deserialized = raw === null || raw === undefined ? raw : this.config.deserialize(raw)
         this.selectedValue_ = deserialized
      } catch (e) {
         this.selectedValue_ = null
      }

      this.stringValue_ = this.selectedValue_ != null ? this.format(this.selectedValue_) : raw
   }

   // #region Set/Unset
   get isOwnSet(): boolean {
      return this.serial.value !== undefined
   }

   unset(): void {
      this.patchSerial((draft) => {
         delete draft.value
      })
   }

   // #region value
   get value(): Field_date_value<VALUE> {
      return this.value_or_fail
   }

   set value(next: Field_date_unchecked<VALUE> | Date) {
      const nextValue = next instanceof Date ? this.config.dateToValue(next) : next

      this.selectedValue_ = nextValue
      this.stringValue_ = nextValue != null ? this.format(nextValue) : null
      this.runInTransaction(() => {
         this.patchSerial((draft) => {
            draft.value = nextValue != null ? this.config.serialize(nextValue) : null
         })
      })
   }

   get value_or_fail(): Field_date_value<VALUE> {
      if (this.isValidSelectedValue) {
         return this.selectedValue as Field_date_value<VALUE>
      }

      throw new Error('Field_date: value_or_fail called on invalid value')
   }

   get value_or_zero(): Field_date_value<VALUE> {
      if (this.isValidSelectedValue && this.value_unchecked != null) return this.value_unchecked
      return this.config.dateToValue(new Date()) // ⚠️ zero value set to now ? Maybe new Date(0) would be saner
   }

   get value_unchecked(): Field_date_unchecked<VALUE> {
      return this.selectedValue
   }

   // #region value ext
   private stringValue_: Maybe<string> = undefined
   get stringValueUnchecked(): Maybe<string> {
      return this.stringValue_
   }
   private selectedValue_: Field_date_unchecked<VALUE> = undefined

   get selectedValue(): Field_date_unchecked<VALUE> {
      return this.selectedValue_
   }
   get isValidSelectedValue(): boolean {
      return this.selectedValue_ != null
   }

   get defaultValue(): Field_date_unchecked<VALUE> {
      if (typeof this.config.default === 'function') {
         return (this.config.default as () => VALUE | null | undefined)()
      }

      return this.config.default
   }

   // #region format/parse
   public format(value: VALUE): string {
      return csuiteConfig.i18n.ui.date.format(
         this.config.valueToDate(value),
         this.config.time ? 'datetime' : 'date',
      )
   }

   public parse(value: string): Field_date_value<VALUE> {
      return this.config.dateToValue(csuiteConfig.i18n.ui.date.parse(value))
   }

   // #region validation
   get ownConfigSpecificProblems(): Problem_Ext {
      const out: string[] = []

      if ('default' in this.config) {
         const def = this.config.default
         if (def == null) out.push(csuiteConfig.i18n.err.field.defaultExplicitelySetToNullButFieldNotNullable)
      }

      return out
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      if (
         (this.stringValue_ != null && this.selectedValue == null) ||
         (this.selectedValue != null && !this.isValidSelectedValue)
      ) {
         return {
            severity: Severity.Error,
            message: csuiteConfig.i18n.err.date.invalid,
         }
      }
      if (this.selectedValue == null) {
         return {
            severity: Severity.Error,
            message: csuiteConfig.i18n.err.field.not_set,
         }
      }

      return null
   }
   // #region changes
   get hasChanges(): boolean {
      return (
         this.serial.value != (this.defaultValue == null ? null : this.config.serialize(this.defaultValue))
      )
   }

   // #region misc
   setValueFromString(value: string): void {
      this.stringValue_ = value?.trim() || null
      let nextValue: Field_date_value<VALUE> | null = null
      try {
         nextValue = !this.stringValue_ ? null : this.parse(this.stringValue_)
      } catch (e) {
         this.selectedValue_ = null
         this.runInTransaction(() => {
            this.patchSerial((draft) => {
               draft.value = this.stringValue_ || null
            })
         })
         return
      }

      this.value = nextValue as Field_date_value<VALUE>
   }

   // #region UI
   readonly DefaultHeaderUI: CovariantFC<{ field: Field_date<VALUE>; readonly?: boolean }> | undefined =
      WidgetDate_HeaderUI

   readonly DefaultBodyUI: CovariantFC<{ field: Field_date<VALUE> }> | undefined = undefined
}
