import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { Field_string_serial } from '../string/FieldString'
import type { ISOString } from './ISOString'

import { produce } from 'immer'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { isProbablySerialString } from '../WidgetUI.DI'
import { WidgetDate_HeaderUI } from './WidgetDateUI'

// #region Config
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

// #region Value
export type Field_date_value<NULLABLE extends boolean> = //
    NULLABLE extends false //
        ? Date
        : Maybe<Date>

export type Field_date_unchecked<NULLABLE extends boolean> = //
    Field_date_value<NULLABLE> | undefined

// #region Serial
export type Field_date_serial = FieldSerial<{
    $: 'date'
    value?: ISOString | null
}>

// #region Types
export type Field_date_types<NULLABLE extends boolean> = {
    $Type: 'date'
    $Config: Field_date_config<NULLABLE>
    $Serial: Field_date_serial
    $Value: Field_date_value<NULLABLE>
    $Unchecked: Field_date_unchecked<NULLABLE>
    $Field: Field_date<NULLABLE>
    $Child: never
    $Reflect: Field_date_types<NULLABLE>
}

// #region State
export class Field_date<const NULLABLE extends boolean = false> extends Field<Field_date_types<NULLABLE>> {
    // #region static
    static readonly type: 'date' = 'date'
    static readonly emptySerial: Field_date_serial = { $: 'date' }

    // #region migration
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

    // #region Ctor
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

    // #region serial
    protected setOwnSerial(next: Field_date_serial): void {
        if (next.value === undefined) {
            const def = this.defaultValue
            if (def !== undefined)
                next = produce(next, (draft) => {
                    draft.value = def == null ? def : def.toISOString()
                })
        }

        this.assignNewSerial(next)

        const raw = this.serial.value
        this.selectedValue_ = raw == null ? null : new Date(raw)
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
            ? this.serial.value !== undefined
            : this.serial.value != null
    }

    unset(): void {
        this.patchSerial((draft) => {
            delete draft.value
        })
    }

    // #region value
    get value(): Field_date_value<NULLABLE> {
        return this.value_or_fail
    }

    set value(next: Field_date_value<NULLABLE>) {
        if (!this.config.nullable && next == null) {
            throw new Error('Field_date: value is null')
        }

        this.selectedValue_ = next
        this.runInValueTransaction(() => {
            this.patchSerial((draft) => {
                draft.value = next?.toISOString()
            })
        })
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

    // #region value ext
    private selectedValue_: Field_date_value<NULLABLE> | null = null

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

    // #region validation
    get ownConfigSpecificProblems(): Problem_Ext {
        const out: string[] = []
        if (!this.config.nullable) {
            if ('default' in this.config) {
                const def = this.config.default
                if (def == null) out.push(csuiteConfig.i18n.err.field.defaultExplicitelySetToNullButFieldNotNullable)
            }
        }
        return out
    }

    get ownTypeSpecificProblems(): Problem_Ext {
        if (this.config.nullable || this.selectedValue != null) return null

        return {
            severity: Severity.Error,
            message: 'Value is required',
        }
    }
    // #region changes
    get hasChanges(): boolean {
        return this.serial.value != this.defaultValue?.toISOString()
    }

    // #region misc
    setValueFromString(value: string): void {
        const nextValue = !value ? null : new Date(value)

        if (nextValue && isNaN(nextValue.getTime())) {
            throw new Error('Field_date: invalid date')
        }

        if (this.config.nullable || nextValue != null) {
            this.value = nextValue as Field_date_value<NULLABLE>
        } else {
            this.selectedValue_ = nextValue
        }
    }

    // #region UI
    readonly DefaultHeaderUI: CovariantFC<{ field: Field_date<NULLABLE>; readonly?: boolean }> | undefined =
        WidgetDate_HeaderUI<NULLABLE>

    readonly DefaultBodyUI: CovariantFC<{ field: Field_date<NULLABLE> }> | undefined = undefined
}
