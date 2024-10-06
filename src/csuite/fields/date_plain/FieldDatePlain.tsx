import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { ISOString } from '../date/ISOString'

import { Temporal } from '@js-temporal/polyfill'
import { produce } from 'immer'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field } from '../../model/Field'
import { Severity } from '../../model/Validation'
import { isProbablySerialDate, isProbablySerialString } from '../WidgetUI.DI'
import { WidgetDatePlain_HeaderUI } from './WidgetDatePlainUI'

// #region Config
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

// #region Value
export type Field_datePlain_value<NULLABLE extends boolean> = //
    NULLABLE extends false //
        ? Temporal.PlainDate
        : Maybe<Temporal.PlainDate>

export type Field_datePlain_unchecked<NULLABLE extends boolean> = //
    Field_datePlain_value<NULLABLE> | undefined

// #region Serial
export type Field_datePlain_serial = FieldSerial<{
    $: 'plaindate'
    value?: ISOString | null
}>

// #region Types
export type Field_datePlain_types<NULLABLE extends boolean> = {
    $Type: 'plaindate'
    $Config: Field_datePlain_config<NULLABLE>
    $Serial: Field_datePlain_serial
    $Value: Field_datePlain_value<NULLABLE>
    $Unchecked: Field_datePlain_unchecked<NULLABLE>
    $Field: Field_datePlain<NULLABLE>
    $Child: never
    $Reflect: Field_datePlain_types<NULLABLE>
}

// #region State
export class Field_datePlain<const NULLABLE extends boolean = false> extends Field<Field_datePlain_types<NULLABLE>> {
    // #region static
    static readonly type: 'plaindate' = 'plaindate'
    static readonly emptySerial: Field_datePlain_serial = { $: 'plaindate' }
    static migrateSerial(serial: object): Maybe<Field_datePlain_serial> {
        if (isProbablySerialString(serial) || isProbablySerialDate(serial)) {
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
    // #region Ctor
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

    // #region serial
    protected setOwnSerial(next: Field_datePlain_serial): void {
        if (next.value === undefined) {
            const def = this.defaultValue
            if (def !== undefined)
                next = produce(next, (draft) => {
                    draft.value = def == null ? null : def.toString()
                })
        }

        this.assignNewSerial(next)

        const raw = this.serial.value
        this.selectedValue_ = raw == null ? null : Temporal.PlainDate.from(raw)
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
            ? 'value' in this.serial
            : this.serial.value != null
    }

    unset(): void {
        this.patchSerial((draft) => {
            delete draft.value
        })
    }

    // #region value

    get value(): Field_datePlain_value<NULLABLE> {
        return this.value_or_fail
    }

    set value(next: Field_datePlain_value<NULLABLE>) {
        if (!this.config.nullable && next == null) {
            throw new Error('Field_datePlain: value is null')
        }

        this.selectedValue_ = next
        this.runInValueTransaction(() => {
            this.patchSerial((draft) => {
                draft.value = next?.toString()
            })
        })
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

    // #region value ext
    private selectedValue_: Field_datePlain_value<NULLABLE> | null = null

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

    // #region validation
    get ownConfigSpecificProblems(): Problem_Ext {
        const out: string[] = []
        if (!this.config.nullable) {
            if ('default' in this.config && this.config.default == null) {
                out.push(csuiteConfig.i18n.err.field.defaultExplicitelySetToNullButFieldNotNullable)
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
        return this.serial.value != this.defaultValue?.toString()
    }

    // #region misc
    setValueFromString(value: string): void {
        const nextValue = !value ? null : Temporal.PlainDate.from(value)

        if (this.config.nullable || nextValue != null) {
            this.value = nextValue as Field_datePlain_value<NULLABLE>
        } else {
            this.selectedValue_ = nextValue
        }
    }

    // #region UI
    readonly DefaultHeaderUI: CovariantFC<{ field: Field_datePlain<NULLABLE>; readonly?: boolean }> | undefined =
        WidgetDatePlain_HeaderUI<NULLABLE>
    readonly DefaultBodyUI: CovariantFC<{ field: Field_datePlain<NULLABLE> }> | undefined = undefined
}
