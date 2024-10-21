import type { FieldTypes } from '../$FieldTypes'

import { Field_date, type Field_date_config } from '../../fields/date/FieldDate'
import { Field_datePlain, type Field_datePlain_config } from '../../fields/date_plain/FieldDatePlain'
import { Field_dateTimeZoned, type Field_dateTimeZoned_config } from '../../fields/datetime_zoned/FieldDateTimeZoned'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
    Date: HKT<boolean>
    DatePlain: HKT<boolean>
    DateTimeZoned: HKT<boolean>
}

export class BuilderDate<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderDate)

    // #region date
    /**
     * Field for javascipt date object
     * 👉 automatically null as default if the field is nullable.
     * see {@link date_} if you don't want that behaviour.
     *
     * @since 2024-08-27
     */
    date<NULLABLE extends boolean = false>(config: Field_date_config<NULLABLE> = {}): Apply<Schemaᐸ_ᐳ['Date'], NULLABLE> {
        const autoDefault: any = config.nullable ? null : undefined
        return this.date_({ default: autoDefault, ...config })
    }

    /**
     * Field for javascipt date object
     * @since 2024-08-27
     */
    date_<NULLABLE extends boolean = false>(config: Field_date_config<NULLABLE> = {}): Apply<Schemaᐸ_ᐳ['Date'], NULLABLE> {
        return this.buildSchema(Field_date<NULLABLE>, config)
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
    datePlain<NULLABLE extends boolean = false>(
        config: Field_datePlain_config<NULLABLE> = {},
    ): Apply<Schemaᐸ_ᐳ['DatePlain'], NULLABLE> {
        // 💬 2024-09-20 rvion:
        // | impossible to type this correctly until we get rid of the
        // | `NULLALBLE` modal type template,
        // | unless we split this into two function
        const autoDefault: any = config.nullable ? null : undefined
        return this.datePlain_({ default: autoDefault, ...config })
    }

    /**
     * Field for Temporal.PlainDate
     * https://tc39.es/proposal-temporal/docs/#Temporal-PlainDate
     *
     * A Temporal.PlainTime object represents a wall-clock time that is
     * not associated with a particular date or time zone, e.g. 7:39 PM.
     *
     * @since 2024-08-27
     *
     */
    datePlain_<NULLABLE extends boolean = false>(
        config: Field_datePlain_config<NULLABLE> = {},
    ): Apply<Schemaᐸ_ᐳ['DatePlain'], NULLABLE> {
        return this.buildSchema(Field_datePlain<NULLABLE>, config)
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
    dateTimeZoned<NULLABLE extends boolean = false>(
        config: Field_dateTimeZoned_config<NULLABLE> = {},
    ): Apply<Schemaᐸ_ᐳ['DateTimeZoned'], NULLABLE> {
        const autoDefault: any = config.nullable ? null : undefined
        return this.dateTimeZoned_({ default: autoDefault, ...config })
    }

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
     * @since 2024-08-27
     */
    dateTimeZoned_<NULLABLE extends boolean = false>(
        config: Field_dateTimeZoned_config<NULLABLE> = {},
    ): Apply<Schemaᐸ_ᐳ['DateTimeZoned'], NULLABLE> {
        return this.buildSchema(Field_dateTimeZoned<NULLABLE>, config)
    }
}
