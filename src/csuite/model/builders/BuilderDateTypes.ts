import type { Temporal } from '@js-temporal/polyfill'

import { Field_date } from '../../fields/date/FieldDate'
import { memoizedFN } from '../../hashUtils/hash'
import { IDENTITY } from '../../utils/identity'
import { CSchema } from '../CSchema'
import { type Problem_Ext, Severity } from '../Validation'
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
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

export type BuilderDateMixin = {
   date(config?: Field_date_config_specific<Date>): Z.SDate
   // TODO: rename temporalPlainDate (do the same for type aliases)
   datePlain(config?: Field_date_config_specific<Temporal.PlainDate>): Z.SDatePlain
   // TODO: rename temporalZonedDatetime (do the same for type aliases)
   dateTimeZoned(config?: Field_date_config_specific<Temporal.ZonedDateTime>): Z.DateTimeZoned
   // TODO:
}

export type Field_date_config_specific<VALUE> = Omit<
   Field_date<VALUE>['{config}'],
   'serialize' | 'deserialize' | 'now' | 'valueToDate' | 'dateToValue' | 'time' | 'codeForTypescriptValue'
> & { time?: boolean }

const BuilderDateImpl = (): BuilderDateMixin =>
   defineSchemaBuilderMixin<BuilderDateMixin>({
      // #region date
      /**
       * Field for javascript date object
       * 👉 automatically null as default if the field is nullable.
       * see {@link date_} if you don't want that behaviour.
       *
       */
      date(config: Field_date_config_specific<Date> = {}): Z.SDate {
         return CSchema.new(Field_date<Date>, {
            ...config,
            serialize: serializeDateTime,
            deserialize: deserializeDateTime,
            valueToDate: IDENTITY,
            dateToValue: IDENTITY,
            codeForTypescriptValue: 'Date',
            check: memoizedFN(
               this,
               'date',
               (field: Field_date<Date>): Problem_Ext => {
                  if (field.zValueUnchecked instanceof Date && isNaN(field.zValueUnchecked.getTime()))
                     return { path: field.zPath, severity: Severity.Error, message: 'Invalid date' }
                  return config.check?.(field)
               },
               [config],
            ),
            time: config.time != null ? config.time : true,
         })
      },

      // #region datePlain

      /**
       * Field for Temporal.PlainDate
       * https://tc39.es/proposal-temporal/docs/#Temporal-PlainDate
       *
       * A Temporal.PlainTime object represents a wall-clock time that is
       * not associated with a particular date or time zone, e.g. 7:39 PM.
       *
       * 👉 automatically null as default if the field is nullable.
       * see {@link datePlain_} if you don't want that behaviour.
       *
       */
      datePlain(config: Field_date_config_specific<Temporal.PlainDate> = {}): Z.SDatePlain {
         return CSchema.new(Field_date<Temporal.PlainDate>, {
            ...config,
            serialize: serializeDatePlain,
            deserialize: deserializeDatePlain,
            codeForTypescriptValue: 'Temporal.PlainDate',
            valueToDate: datePlainToDate,
            dateToValue: dateToDatePlain,
            time: false,
         })
      },

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
       */
      dateTimeZoned(config: Field_date_config_specific<Temporal.ZonedDateTime> = {}): Z.DateTimeZoned {
         return CSchema.new(Field_date<Temporal.ZonedDateTime>, {
            ...config,
            serialize: serializeDateTimeZoned,
            deserialize: deserializeDateTimeZoned,
            codeForTypescriptValue: 'Temporal.ZonedDateTime',
            time: true,
            valueToDate: dateTimeZonedToDate,
            dateToValue: dateToDateTimeZoned,
         })
      },
   })

export const BuilderDateDescriptors: Record<string, PropertyDescriptor> =
   Object.getOwnPropertyDescriptors(BuilderDateImpl())
