import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'

import { Temporal } from '@js-temporal/polyfill'
import { produce } from 'immer'

import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { isProbablySerialDate, isProbablySerialString } from '../WidgetUI.DI'
import { WidgetDateTimeZoned_HeaderUI } from './WidgetDateTimeZonedUI'

// #region Config
export type Field_dateTimeZoned_config<NULLABLE extends boolean> = FieldConfig<
   {
      default?: NULLABLE extends false
         ? Temporal.ZonedDateTime | (() => Temporal.ZonedDateTime)
         : Temporal.ZonedDateTime | null | (() => Temporal.ZonedDateTime | null)
      nullable?: NULLABLE
      placeHolder?: string
      innerIcon?: IconName
   },
   Field_dateTimeZoned_types<NULLABLE>
>

// #region Value
export type Field_dateTimeZoned_value<NULLABLE extends boolean> = //
   NULLABLE extends false //
      ? Temporal.ZonedDateTime
      : Maybe<Temporal.ZonedDateTime>

export type Field_dateTimeZoned_unchecked<NULLABLE extends boolean> = //
   Field_dateTimeZoned_value<NULLABLE> | undefined

// #region Serial
export type Field_dateTimeZoned_serial = FieldSerial<{
   $: 'datetimezoned'
   value?: Maybe<string>
}>

// #region Types
export type Field_dateTimeZoned_types<NULLABLE extends boolean> = {
   $Type: 'datetimezoned'
   $Config: Field_dateTimeZoned_config<NULLABLE>
   $Serial: Field_dateTimeZoned_serial
   $Value: Field_dateTimeZoned_value<NULLABLE>
   $Unchecked: Field_dateTimeZoned_value<NULLABLE> | undefined
   $Field: Field_dateTimeZoned<NULLABLE>
   $Child: never
   $Reflect: Field_dateTimeZoned_types<NULLABLE>
}

// #region State
export class Field_dateTimeZoned<const NULLABLE extends boolean = false> extends Field<
   Field_dateTimeZoned_types<NULLABLE>
> {
   // #region Static
   static readonly type: 'datetimezoned' = 'datetimezoned'
   static readonly emptySerial: Field_dateTimeZoned_serial = { $: 'datetimezoned' }
   static codegenValueType(config: Field_dateTimeZoned_config<any>): string {
      if (config.nullable) return 'Maybe<Temporal.ZonedDateTime>'
      return 'Temporal.ZonedDateTime'
   }

   // #region Migration
   static migrateSerial(serial: object): Maybe<Field_dateTimeZoned_serial> {
      if (isProbablySerialString(serial) || isProbablySerialDate(serial)) {
         if (!serial.value) return { $: this.type }
         const parsed = new Date(serial.value)
         if (!isNaN(parsed.getTime())) {
            const value = Temporal.Instant.from(parsed.toISOString())
               .toZonedDateTimeISO(Temporal.Now.timeZoneId())
               .toString()
            return { $: this.type, value }
         }
      }
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_dateTimeZoned<NULLABLE>>,
      initialMountKey: string,
      serial?: Field_dateTimeZoned_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   protected setOwnSerial(next: Field_dateTimeZoned_serial): void {
      // step 1. normalize + inject default if not set but with default
      if (next.value === undefined) {
         const def = this.defaultValue
         if (def !== undefined)
            next = produce(next, (draft) => {
               draft.value = def == null ? null : def.toString()
            })
      }

      this.assignNewSerial(next)

      const raw = this.serial.value
      this.selectedValue_ = raw == null ? null : Temporal.ZonedDateTime.from(raw)
   }

   // #region Nullability
   get canBeToggledWithinParent(): boolean {
      if (this.config.nullable) return true
      return super.canBeToggledWithinParent
   }

   disableSelfWithinParent(): void {
      if (this.config.nullable) {
         this.patchSerial((draft) => void (draft.value = null))
         return
      }
      return super.disableSelfWithinParent()
   }

   // #region Set/Unset
   get isOwnSet(): boolean {
      return this.config.nullable //
         ? 'value' in this.serial
         : this.serial.value != null
   }

   unset(): void {
      this.patchSerial((draft) => {
         delete draft.value
      })
   }

   // #region value
   get value(): Field_dateTimeZoned_value<NULLABLE> {
      return this.value_or_fail
   }

   set value(next: Field_dateTimeZoned_value<NULLABLE>) {
      if (!this.config.nullable && next == null) {
         throw new Error('Field_dateTimeZoned: value is null')
      }
      this.selectedValue_ = next
      this.runInTransaction(() => {
         this.patchSerial((draft) => {
            draft.value = next?.toString()
         })
      })
   }

   get value_or_fail(): Field_dateTimeZoned_value<NULLABLE> {
      if (this.config.nullable || this.selectedValue != null) {
         return this.selectedValue as Field_dateTimeZoned_value<NULLABLE>
      }

      throw new Error('Field_dateTimeZoned: value is null')
   }

   get value_or_zero(): Field_dateTimeZoned_value<NULLABLE> {
      if (this.value_unchecked != null) return this.value_unchecked
      if (this.config.nullable) return null as Field_dateTimeZoned_value<NULLABLE>
      return Temporal.Now.zonedDateTimeISO() // ⚠️ zero value set to now
   }

   get value_unchecked(): Field_dateTimeZoned_unchecked<NULLABLE> {
      return this.selectedValue ?? undefined
   }

   // #region value ext
   private selectedValue_: Field_dateTimeZoned_value<NULLABLE> | null = null

   get selectedValue(): Field_dateTimeZoned_value<NULLABLE> | null {
      return this.selectedValue_
   }

   get defaultValue(): Field_dateTimeZoned_value<NULLABLE> | null {
      if (typeof this.config.default === 'function') {
         return this.config.default()
      }

      if (this.config.default != null || this.config.nullable) {
         return (this.config.default ?? null) as Field_dateTimeZoned_value<NULLABLE>
      }

      return null
   }

   // #region Validation
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      if (this.config.nullable || this.selectedValue != null) return null

      return {
         severity: Severity.Error,
         message: 'Value is required',
      }
   }

   get hasChanges(): boolean {
      return this.serial.value != this.defaultValue?.toString()
   }

   setValueFromString(value: string): void {
      const nextValue = value ? new Date(value) : null
      const zonedNext = nextValue
         ? Temporal.Instant.from(nextValue.toISOString()).toZonedDateTimeISO(Temporal.Now.timeZoneId())
         : null

      if (this.config.nullable || zonedNext != null) {
         this.value = zonedNext as Field_dateTimeZoned_value<NULLABLE>
      } else {
         this.selectedValue_ = zonedNext
      }
   }

   // #region UI
   readonly DefaultHeaderUI:
      | CovariantFC<{ field: Field_dateTimeZoned<NULLABLE>; readonly?: boolean }>
      | undefined = WidgetDateTimeZoned_HeaderUI<NULLABLE>
   readonly DefaultBodyUI: CovariantFC<{ field: Field_dateTimeZoned<NULLABLE> }> | undefined = undefined
}
