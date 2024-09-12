import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { SerialMigrationFunction, UNVALIDATED2 } from '../../model/FieldConstructor'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { Field_string_serial } from '../string/FieldString'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { isProbablySerialString } from '../WidgetUI.DI'
import { WidgetDate_HeaderUI } from './WidgetDateUI'

export type Field_date_config<NULLABLE extends boolean> = FieldConfig<
    {
        default?: NULLABLE extends false //
            ? Date | (() => Date)
            : Date | null | (() => Date | null)
        nullable?: NULLABLE
        placeHolder?: string
        innerIcon?: IconName
    },
    Field_date_types<NULLABLE>
>

// Value
export type Field_date_value<NULLABLE extends boolean> = NULLABLE extends false ? Date : Maybe<Date>
export type Field_date_unchecked<NULLABLE extends boolean> = Field_date_value<NULLABLE> | undefined

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
    $Unchecked: Field_date_unchecked<NULLABLE>
    $Field: Field_date<NULLABLE>
}

//
// ❌ NULLABLE here seems to be incorrect
// - semantic is wrong: it corresponds to HAS_DEFAULT instead of NULLABLE
// - we could be both nullable and have a default
// - is unsafe: look for `ui.date(...)` some of them pretend to be nullable but have no default, and cause crash
// - not propagated using withConfig and other schema cloning methods
// - the default is still wrong compared to before: `default?: NULLABLE extends false ? Date | (() => Date) : Date | null | (() => Date | null)`
// -

export class Field_date<const NULLABLE extends boolean = false> extends Field<Field_date_types<NULLABLE>> {
    static readonly type: 'date' = 'date'
    static readonly emptySerial: Field_date_serial = { $: 'date' }
    static migrateSerial(serial: object): Field_date_serial | null {
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

    private selectedValue_: Field_date_value<NULLABLE> | null = null
    readonly DefaultHeaderUI: CovariantFC<{ field: Field_date<NULLABLE>; readonly?: boolean }> | undefined =
        WidgetDate_HeaderUI<NULLABLE>
    readonly DefaultBodyUI: CovariantFC<{ field: Field_date<NULLABLE> }> | undefined = undefined

    constructor(
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_date<NULLABLE>>,
        initialMountKey: string,
        serial?: Field_date_serial,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        this.init(serial)
    }

    // NULLABILITY ------------------------------------------------------------
    get canBeSetOnOrOff(): NULLABLE {
        return this.config.nullable as NULLABLE
    }

    setOn(): void {
        throw new Error('Field_date: setOn not implemented; set a value directly')
    }

    setOff(): void {
        this.serial.value = undefined
    }

    // ------------------------------------------------------------------------
    get isOwnSet(): boolean {
        if (this.config.nullable) return true
        return this.serial.value != null
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
        return this.value_or_fail
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

    get value_or_fail(): Field_date_value<NULLABLE> {
        if (this.config.nullable || this.selectedValue != null) {
            return this.selectedValue as Field_date_value<NULLABLE>
        }

        throw new Error('Field_date: value is null')
    }

    get value_or_zero(): Field_date_value<NULLABLE> {
        if (this.value_unchecked != null) return this.value_unchecked
        if (this.config.nullable) return null as Field_date_value<NULLABLE>
        return new Date() // ⚠️ zero value set to now ? Maybe new Date(0) would be saner
    }

    get value_unchecked(): Field_date_unchecked<NULLABLE> {
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
        return this.serial.value != this.defaultValue?.toISOString()
    }

    protected setOwnSerial(next: Field_date_serial): void {
        if (next.value == null) {
            const def = this.defaultValue
            if (def != null) next = produce(next, (draft) => void (draft.value = def.toISOString()))
        }

        this.assignNewSerial(next)

        const raw = this.serial.value
        this.selectedValue_ = raw == null ? null : new Date(raw)
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
