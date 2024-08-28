import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { Field_string_serial } from '../string/FieldString'

import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { WidgetDate_HeaderUI } from './WidgetDateUI'

export type Field_date_config<NULLABLE extends boolean> = FieldConfig<
    {
        default?: NULLABLE extends false ? Date | (() => Date) : Date | null | (() => Date | null)
        nullable?: NULLABLE
        placeHolder?: string
        innerIcon?: IconName
    },
    Field_date_types<NULLABLE>
>

// Value
export type Field_date_value<NULLABLE extends boolean> = NULLABLE extends false ? Date : Maybe<Date>

// SERIAL
export type Field_date_serial = FieldSerial<{
    $: 'date'
    value?: string
}>

// TYPES
export type Field_date_types<NULLABLE extends boolean> = {
    $Type: 'date'
    $Config: Field_date_config<NULLABLE>
    $Serial: Field_date_serial
    $Value: Field_date_value<NULLABLE>
    $Field: Field_date<NULLABLE>
}

export class Field_date<const NULLABLE extends boolean = false> extends Field<Field_date_types<NULLABLE>> {
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

    private selectedValue_: Field_date_value<NULLABLE> | null = null
    readonly DefaultHeaderUI: CovariantFC<{ field: Field_date<NULLABLE>; readonly?: boolean }> | undefined =
        WidgetDate_HeaderUI<NULLABLE>
    readonly DefaultBodyUI: CovariantFC<{ field: Field_date<NULLABLE> }> | undefined = undefined

    constructor(
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_date<NULLABLE>>,
        serial?: Field_date_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial)
    }

    get selectedValue(): Field_date_value<NULLABLE> | null {
        return this.selectedValue_
    }

    get defaultValue(): Field_date_value<NULLABLE> | null {
        if (typeof this.config.default === 'function') {
            return this.config.default()
        }

        if (this.config.default != null || this.config.nullable) {
            return (this.config.default ?? null) as Field_date_value<NULLABLE>
        }

        return null
    }

    get value(): Field_date_value<NULLABLE> {
        if (this.config.nullable || this.selectedValue != null) {
            return this.selectedValue as Field_date_value<NULLABLE>
        }

        throw new Error('Field_date: value is null')
    }

    set value(next: Field_date_value<NULLABLE>) {
        if (this.config.nullable || next != null) {
            this.selectedValue_ = next
            this.runInValueTransaction(() => {
                this.serial.value = next?.toISOString()
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
        return this.serial.value != this.defaultValue?.toISOString()
    }

    protected setOwnSerial(serial: Maybe<Field_date_serial>): void {
        this.serial.value = serial?.value ?? this.defaultValue?.toISOString()
        this.selectedValue_ = !this.serial.value ? null : new Date(this.serial.value)
    }

    setValueFromString(value: string): void {
        const nextValue = !value ? null : new Date(value)

        if (nextValue && isNaN(nextValue.getTime())) {
            throw new Error('Field_date: invalid date')
        }

        if (this.config.nullable || this.selectedValue != null) {
            this.value = nextValue as Field_date_value<NULLABLE>
        } else {
            this.selectedValue_ = nextValue
        }
    }
}
