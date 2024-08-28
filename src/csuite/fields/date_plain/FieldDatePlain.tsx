import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { Field_string_serial } from '../string/FieldString'

import { Temporal } from '@js-temporal/polyfill'

import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { WidgetDatePlain_HeaderUI } from './WidgetDatePlainUI'

export type Field_datePlain_config<NULLABLE extends boolean> = FieldConfig<
    {
        default?: NULLABLE extends false
            ? Temporal.PlainDate | (() => Temporal.PlainDate)
            : Temporal.PlainDate | null | (() => Temporal.PlainDate | null)
        nullable?: NULLABLE
        placeHolder?: string
        innerIcon?: IconName
    },
    Field_datePlain_types<NULLABLE>
>

// Value
export type Field_datePlain_value<NULLABLE extends boolean> = NULLABLE extends false
    ? Temporal.PlainDate
    : Maybe<Temporal.PlainDate>

// SERIAL
export type Field_datePlain_serial = FieldSerial<{
    $: 'plaindate'
    value?: string
}>

// TYPES
export type Field_datePlain_types<NULLABLE extends boolean> = {
    $Type: 'plaindate'
    $Config: Field_datePlain_config<NULLABLE>
    $Serial: Field_datePlain_serial
    $Value: Field_datePlain_value<NULLABLE>
    $Field: Field_datePlain<NULLABLE>
}

export class Field_datePlain<const NULLABLE extends boolean = false> extends Field<Field_datePlain_types<NULLABLE>> {
    static readonly type: 'plaindate' = 'plaindate'

    static migrateSerial(serial: FieldSerial<unknown>): Field_datePlain_serial | null {
        if (serial == null) return null

        if (serial.$ === 'str') {
            const stringSerial = serial as Field_string_serial

            if (!stringSerial.value) return { $: this.type }

            const parsed = new Date(stringSerial.value)
            if (!isNaN(parsed.getTime())) {
                return {
                    $: this.type,
                    value: Temporal.PlainDate.from({
                        year: parsed.getFullYear(),
                        month: parsed.getMonth() + 1,
                        day: parsed.getDate(),
                    }).toString(),
                }
            }
        }

        return null
    }

    private selectedValue_: Field_datePlain_value<NULLABLE> | null = null
    readonly DefaultHeaderUI: CovariantFC<{ field: Field_datePlain<NULLABLE>; readonly?: boolean }> | undefined =
        WidgetDatePlain_HeaderUI<NULLABLE>
    readonly DefaultBodyUI: CovariantFC<{ field: Field_datePlain<NULLABLE> }> | undefined = undefined

    constructor(
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_datePlain<NULLABLE>>,
        serial?: Field_datePlain_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial)
    }

    get selectedValue(): Field_datePlain_value<NULLABLE> | null {
        return this.selectedValue_
    }

    get defaultValue(): Field_datePlain_value<NULLABLE> | null {
        if (typeof this.config.default === 'function') {
            return this.config.default()
        }

        if (this.config.default != null || this.config.nullable) {
            return (this.config.default ?? null) as Field_datePlain_value<NULLABLE>
        }

        return null
    }

    get value(): Field_datePlain_value<NULLABLE> {
        if (this.config.nullable || this.selectedValue != null) {
            return this.selectedValue as Field_datePlain_value<NULLABLE>
        }

        throw new Error('Field_date: value is null')
    }

    set value(next: Field_datePlain_value<NULLABLE>) {
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

    protected setOwnSerial(serial: Maybe<Field_datePlain_serial>): void {
        this.serial.value = serial?.value ?? this.defaultValue?.toString()
        this.selectedValue_ = !this.serial.value ? null : Temporal.PlainDate.from(this.serial.value)
    }

    setValueFromString(value: string): void {
        const nextValue = !value ? null : Temporal.PlainDate.from(value)

        if (this.config.nullable || this.selectedValue != null) {
            this.value = nextValue as Field_datePlain_value<NULLABLE>
        } else {
            this.selectedValue_ = nextValue
        }
    }
}
