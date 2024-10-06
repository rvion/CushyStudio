import type { EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { _extractDefaultValue } from './_extractDefaultValue'
import { WidgetEnumUI } from './WidgetEnumUI'

// #region Config
export type Field_enum_config<O extends EnumValue> = FieldConfig<
    {
        enumName: string
        default?: O
        extraDefaults?: string[]
        filter?: (v: EnumValue) => boolean
        appearance?: 'select' | 'tab'
        /**
         * @since 2024-07-22
         * allow to wrap the list of values if they take more than 1 SLH (standard line height)
         */
        wrap?: boolean
    },
    Field_enum_types<O>
>

// #region Serial
export type Field_enum_serial<O extends EnumValue> = FieldSerial<{
    $: 'enum'
    val?: O
}>

// #region Value
export type Field_enum_value<O extends EnumValue> = O // Requirable[T]

// #region Types
export type Field_enum_types<O extends EnumValue> = {
    $Type: 'enum'
    $Config: Field_enum_config<O>
    $Serial: Field_enum_serial<O>
    $Value: Field_enum_value<O>
    $Unchecked: Field_enum_value<O> | undefined
    $Field: Field_enum<O>
    $Child: never
    $Reflect: Field_enum_types<O>
}

// #region State
export class Field_enum<O extends EnumValue> extends Field<Field_enum_types<O>> {
    // #region Static
    static readonly type: 'enum' = 'enum'
    static readonly emptySerial: Field_enum_serial<any> = { $: 'enum' }
    static migrateSerial(): undefined {}

    // #region UI
    DefaultHeaderUI = WidgetEnumUI
    DefaultBodyUI = undefined

    get defaultValue(): Field_enum_value<O> {
        return this.config.default ?? (this.possibleValues[0] as any)
    }

    get hasChanges(): boolean {
        return this.serial.val !== this.defaultValue
    }

    // #region Validation
    get ownTypeSpecificProblems(): Problem_Ext {
        return null
    }
    get ownConfigSpecificProblems(): Problem_Ext {
        return null
    }

    // #region Ctor
    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_enum<O>>,
        initialMountKey: string,
        serial?: Field_enum_serial<O>,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    // #region serial
    get isOwnSet(): boolean {
        return this.serial.val !== undefined
    }

    reset(): void {
        this.value = this.defaultValue
    }

    unset(): void {
        this.serial.val = undefined
    }

    get possibleValues(): EnumValue[] {
        return cushy.schema.knownEnumsByName.get(this.config.enumName as any)?.values ?? []
    }

    private _isValidValue(v: any): v is O {
        const isValidDef = this.possibleValues.includes(v)
        return isValidDef
    }

    protected setOwnSerial(next: Field_enum_serial<O>): void {
        // handle default
        if (next?.val === undefined) {
            const def = _extractDefaultValue(this.config)
            if (def != null) {
                const isValidDef = this.possibleValues.includes(def)
                if (!this._isValidValue(def)) {
                    throw new Error(`Invalid default value ${def} for enum ${this.config.enumName}`)
                }
                const nextXX = def as any as O
                // 🔴 ping @globi
                // @ts-ignore
                next = produce(next, (draft) => void (draft.val = nextXX))
            }
        }
        // this.serial.val =
        //     next?.val ?? //
        //     _extractDefaultValue(this.config) ??
        //     (this.possibleValues[0] as any)
        this.assignNewSerial(next)
    }

    get status(): CleanedEnumResult<any> {
        return cushy.fixEnumValue(this.serial.val as any, this.config.enumName)
    }

    // #region value
    get value(): Field_enum_value<O> {
        return this.status.finalValue
    }

    set value(next: Field_enum_value<O>) {
        if (this.serial.val === next) return
        this.runInValuePatch((draft) => (draft.val = next))
    }

    get value_or_fail(): Field_enum_value<O> {
        return this.status.finalValue /* 🔴 */
    }

    get value_or_zero(): Field_enum_value<O> {
        return this.status.finalValue /* 🔴 */
    }

    get value_unchecked(): Field_enum_value<O> {
        return this.status.finalValue /* 🔴 */
    }
}

// DI
registerFieldClass('enum', Field_enum)
