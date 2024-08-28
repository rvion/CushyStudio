import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Field_date_serial } from '../date/FieldDate'
import type { BaseSchema, CovariantFC, Field_string_serial, IconName, Problem_Ext, Repository } from 'src/cushy-forms/main'

import { Temporal } from '@js-temporal/polyfill'

import { WidgetDateTimeZoned_HeaderUI } from './WidgetDateTimeZonedUI'
import { Field, Severity } from 'src/cushy-forms/main'

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

// Value
export type Field_dateTimeZoned_value<NULLABLE extends boolean> = NULLABLE extends false
    ? Temporal.ZonedDateTime
    : Maybe<Temporal.ZonedDateTime>

// SERIAL
export type Field_dateTimeZoned_serial = FieldSerial<{
    $: 'datetimezoned'
    value?: string
}>

// TYPES
export type Field_dateTimeZoned_types<NULLABLE extends boolean> = {
    $Type: 'datetimezoned'
    $Config: Field_dateTimeZoned_config<NULLABLE>
    $Serial: Field_dateTimeZoned_serial
    $Value: Field_dateTimeZoned_value<NULLABLE>
    $Field: Field_dateTimeZoned<NULLABLE>
}

export class Field_dateTimeZoned<const NULLABLE extends boolean = false> extends Field<Field_dateTimeZoned_types<NULLABLE>> {
    static readonly type: 'datetimezoned' = 'datetimezoned'

    static migrateSerial(serial: FieldSerial<unknown>): Field_dateTimeZoned_serial | null {
        if (serial == null) return null

        if (serial.$ === 'str' || serial.$ === 'date') {
            const stringSerial = serial as Field_string_serial | Field_date_serial

            if (!stringSerial.value) return { $: this.type }

            const parsed = new Date(stringSerial.value)
            if (!isNaN(parsed.getTime())) {
                return {
                    $: this.type,
                    value: Temporal.Instant.from(parsed.toISOString()).toZonedDateTimeISO(Temporal.Now.timeZone()).toString(),
                }
            }
        }

        return null
    }

    private selectedValue_: Field_dateTimeZoned_value<NULLABLE> | null = null
    readonly DefaultHeaderUI: CovariantFC<{ field: Field_dateTimeZoned<NULLABLE>; readonly?: boolean }> | undefined =
        WidgetDateTimeZoned_HeaderUI<NULLABLE>
    readonly DefaultBodyUI: CovariantFC<{ field: Field_dateTimeZoned<NULLABLE> }> | undefined = undefined

    constructor(
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_dateTimeZoned<NULLABLE>>,
        serial?: Field_dateTimeZoned_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial)
    }

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

    get value(): Field_dateTimeZoned_value<NULLABLE> {
        if (this.config.nullable || this.selectedValue != null) {
            return this.selectedValue as Field_dateTimeZoned_value<NULLABLE>
        }

        throw new Error('Field_date: value is null')
    }

    set value(next: Field_dateTimeZoned_value<NULLABLE>) {
        if (this.config.nullable || next != null) {
            this.selectedValue_ = next
            this.runInValueTransaction(() => {
                this.serial.value = next?.toString()
            })
        } else {
            throw new Error('Field_date: value is null')
        }
    }

    get ownProblems(): Problem_Ext {
        if (this.config.nullable || this.selectedValue != null) return null

        return {
            severity: Severity.Error,
            message: 'Value is required',
        }
    }

    get hasChanges(): boolean {
        return this.serial.value != this.defaultValue?.toString()
    }

    protected setOwnSerial(serial: Maybe<Field_dateTimeZoned_serial>): void {
        this.serial.value = serial?.value ?? this.defaultValue?.toString()
        this.selectedValue_ = !this.serial.value ? null : Temporal.ZonedDateTime.from(this.serial.value)
    }

    setValueFromString(value: string): void {
        const nextValue = value ? new Date(value) : null
        const zonedNext = nextValue
            ? Temporal.Instant.from(nextValue.toISOString()).toZonedDateTimeISO(Temporal.Now.timeZone())
            : null

        if (this.config.nullable || this.selectedValue != null) {
            this.value = zonedNext as Field_dateTimeZoned_value<NULLABLE>
        } else {
            this.selectedValue_ = zonedNext
        }
    }
}
