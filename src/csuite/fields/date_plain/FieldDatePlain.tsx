import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { Field_string_serial } from '../string/FieldString'

import { Temporal } from '@js-temporal/polyfill'
import { produce } from 'immer'

import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { isProbablySerialString } from '../WidgetUI.DI'
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
export type Field_datePlain_unchecked<NULLABLE extends boolean> = Field_datePlain_value<NULLABLE> | undefined

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
    $Unchecked: Field_datePlain_unchecked<NULLABLE>
    $Field: Field_datePlain<NULLABLE>
}

export class Field_datePlain<const NULLABLE extends boolean = false> extends Field<Field_datePlain_types<NULLABLE>> {
    // #region TYPE
    static readonly type: 'plaindate' = 'plaindate'
    static readonly emptySerial: Field_datePlain_serial = { $: 'plaindate' }
    static migrateSerial(serial: object): Maybe<Field_datePlain_serial> {
        if (isProbablySerialString(serial)) {
            if (!serial.value) return { $: this.type }
            const parsed = new Date(serial.value)
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
        initialMountKey: string,
        serial?: Field_datePlain_serial,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        this.init(serial)
    }

    get isOwnSet(): boolean {
        if (this.config.nullable) return true
        return this.serial.value != null
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
        return this.value_or_fail
    }

    set value(next: Field_datePlain_value<NULLABLE>) {
        if (this.config.nullable || next != null) {
            this.selectedValue_ = next
            this.runInValueTransaction(() => {
                this.serial.value = next?.toString()
            })
        } else {
            throw new Error('Field_datePlain: value is null')
        }
    }

    get value_or_fail(): Field_datePlain_value<NULLABLE> {
        if (this.config.nullable || this.selectedValue != null) {
            return this.selectedValue as Field_datePlain_value<NULLABLE>
        }

        throw new Error('Field_datePlain: value is null')
    }

    get value_or_zero(): Field_datePlain_value<NULLABLE> {
        if (this.value_unchecked != null) return this.value_unchecked
        if (this.config.nullable) return null as Field_datePlain_value<NULLABLE>
        return Temporal.Now.plainDateISO() // ⚠️ zero value set to now
    }

    get value_unchecked(): Field_datePlain_unchecked<NULLABLE> {
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

    protected setOwnSerial(next: Field_datePlain_serial): void {
        if (next.value == null) {
            const def = this.defaultValue
            if (def != null) next = produce(next, (draft) => void (draft.value = def.toString()))
        }

        this.assignNewSerial(next)

        const raw = this.serial.value
        this.selectedValue_ = raw == null ? null : Temporal.PlainDate.from(raw)
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
