import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { Field_date_serial } from '../date/FieldDate'
import type { Field_string_serial } from '../string/FieldString'

import { Temporal } from '@js-temporal/polyfill'
import { produce } from 'immer'

import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { isProbablySerialDate, isProbablySerialString } from '../WidgetUI.DI'
import { WidgetDateTimeZoned_HeaderUI } from './WidgetDateTimeZonedUI'

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
export type Field_dateTimeZoned_unchecked<NULLABLE extends boolean> = Field_dateTimeZoned_value<NULLABLE> | undefined

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
    $Unchecked: Field_dateTimeZoned_value<NULLABLE> | undefined
    $Field: Field_dateTimeZoned<NULLABLE>
}

// #region STATE
export class Field_dateTimeZoned<const NULLABLE extends boolean = false> extends Field<Field_dateTimeZoned_types<NULLABLE>> {
    // #region TYPE
    static readonly type: 'datetimezoned' = 'datetimezoned'
    static readonly emptySerial: Field_dateTimeZoned_serial = { $: 'datetimezoned' }
    static migrateSerial(serial: object): Maybe<Field_dateTimeZoned_serial> {
        if (isProbablySerialString(serial) || isProbablySerialDate(serial)) {
            if (!serial.value) return { $: this.type }
            const parsed = new Date(serial.value)
            if (!isNaN(parsed.getTime())) {
                const value = Temporal.Instant.from(parsed.toISOString()).toZonedDateTimeISO(Temporal.Now.timeZoneId()).toString()
                return { $: this.type, value }
            }
        }
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
        initialMountKey: string,
        serial?: Field_dateTimeZoned_serial,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        this.init(serial)
    }

    get isOwnSet(): boolean {
        if (this.config.nullable) return true
        return this.serial.value != null
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
        return this.value_or_fail
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

    protected setOwnSerial(next: Field_dateTimeZoned_serial): void {
        if (next.value == null) {
            const def = this.defaultValue
            if (def != null) next = produce(next, (draft) => void (draft.value = def.toString()))
        }

        this.assignNewSerial(next)

        const raw = this.serial.value
        this.selectedValue_ = raw == null ? null : Temporal.ZonedDateTime.from(raw)
    }

    setValueFromString(value: string): void {
        const nextValue = value ? new Date(value) : null
        const zonedNext = nextValue
            ? Temporal.Instant.from(nextValue.toISOString()).toZonedDateTimeISO(Temporal.Now.timeZoneId())
            : null

        if (this.config.nullable || this.selectedValue != null) {
            this.value = zonedNext as Field_dateTimeZoned_value<NULLABLE>
        } else {
            this.selectedValue_ = zonedNext
        }
    }
}
