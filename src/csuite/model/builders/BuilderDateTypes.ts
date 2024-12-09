import type { FieldTypes } from '../$FieldTypes'
import type { Field } from '../Field'
import type { Temporal } from '@js-temporal/polyfill'

import { Field_date, type Field_date_config } from '../../fields/date/FieldDate'
import { Severity } from '../Validation'
import { BaseBuilder } from './BaseBuilder'
import {
   datePlainToDate,
   dateTimeZonedToDate,
   dateToDatePlain,
   dateToDateTimeZoned,
   deserializeDatePlain,
   deserializeDateTime,
   deserializeDateTimeZoned,
   serializeDatePlain,
   serializeDateTime,
   serializeDateTimeZoned,
} from './date-utils'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
   Date: Apply<this, Field_date<Date>>
   DatePlain: Apply<this, Field_date<Temporal.PlainDate>>
   DateTimeZoned: Apply<this, Field_date<Temporal.ZonedDateTime>>
}

export type Field_date_config_specific<VALUE> = Omit<
   Field_date_config<VALUE>,
   'serialize' | 'deserialize' | 'now' | 'valueToDate' | 'dateToValue' | 'time'
>

export class BuilderDate<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
   static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderDate)

   // #region date
   /**
    * Field for javascript date object
    * 👉 automatically null as default if the field is nullable.
    * see {@link date_} if you don't want that behaviour.
    *
    * @since 2024-08-27
    */
   date(config: Field_date_config_specific<Date> = {}): Schemaᐸ_ᐳ['Date'] {
      const finalConfig: Field_date_config<Date> = {
         ...config,
         serialize: serializeDateTime,
         deserialize: deserializeDateTime,
         valueToDate: (v: Date) => v,
         dateToValue: (d: Date) => d,
         check: (field: Field_date<Date>) => {
            if (field.value_unchecked instanceof Date && isNaN(field.value_unchecked.getTime())) {
               return {
                  severity: Severity.Error,
                  message: 'Invalid date',
               }
            }

            return config.check?.(field)
         },
         time: true,
      }
      return this.buildSchema(Field_date<Date>, finalConfig)
   }

   // #region datePlain

   /**
    * Field for Temporal.PlainDate
    * https://tc39.es/proposal-temporal/docs/#Temporal-PlainDate
    *
    * A Temporal.PlainTime object represents a wall-clock time that is
    * not associated with a particular date or time zone, e.g. 7:39 PM.
    *
    * @since 2024-08-27
    *
    * 👉 automatically null as default if the field is nullable.
    * see {@link datePlain_} if you don't want that behaviour.
    *
    */
   datePlain(config: Field_date_config_specific<Temporal.PlainDate> = {}): Schemaᐸ_ᐳ['DatePlain'] {
      const finalConfig: Field_date_config<Temporal.PlainDate> = {
         ...config,
         serialize: serializeDatePlain,
         deserialize: deserializeDatePlain,
         valueToDate: datePlainToDate,
         dateToValue: dateToDatePlain,
         time: false,
      }
      return this.buildSchema(Field_date<Temporal.PlainDate>, finalConfig)
   }

   // #region dateTimeZoned

   /**
    * Field for Temporal.ZonedDateTime
    *
    * https://tc39.es/proposal-temporal/docs/#Temporal-ZonedDateTime
    *
    * A `Temporal.ZonedDateTime` is a timezone-aware, calendar-aware date/time
    * object that represents a real event that has happened (or will happen) at
    * a particular exact time from the perspective of a particular region on
    * Earth, e.g. December 7th, 1995 at 3:24 AM in US Pacific time (in
    * Gregorian calendar). This type is optimized for use cases that require a
    * time zone, including DST-safe arithmetic and interoperability with RFC
    * 5545 (iCalendar).
    *
    * 👉 automatically null as default if the field is nullable.
    * see {@link dateTimeZoned_} if you don't want that behaviour.
    *
    * @since 2024-08-27
    */
   dateTimeZoned(
      config: Field_date_config_specific<Temporal.ZonedDateTime> = {},
   ): Schemaᐸ_ᐳ['DateTimeZoned'] {
      const finalConfig: Field_date_config<Temporal.ZonedDateTime> = {
         ...config,
         serialize: serializeDateTimeZoned,
         deserialize: deserializeDateTimeZoned,
         time: true,
         valueToDate: dateTimeZonedToDate,
         dateToValue: dateToDateTimeZoned,
      }
      return this.buildSchema(Field_date<Temporal.ZonedDateTime>, finalConfig)
   }
}
