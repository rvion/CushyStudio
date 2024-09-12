import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { UNVALIDATED2 } from '../../model/FieldConstructor'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'

import { produce } from 'immer'
import { computed } from 'mobx'

import { Field } from '../../model/Field'
import { isProbablySerialString, registerFieldClass } from '../WidgetUI.DI'
import { WidgetNumberUI } from './WidgetNumberUI'

// #region CONFIG
export type Field_number_config = FieldConfig<
    {
        mode: 'int' | 'float'
        default?: number
        min?: number
        max?: number
        softMin?: number
        softMax?: number
        step?: number
        suffix?: string
        text?: string
        hideSlider?: boolean
        forceSnap?: boolean
        /** used as suffix */
        unit?: string
    },
    Field_number_types
>

// #region SERIAL
export type Field_number_serial = FieldSerial<{
    $: 'number'
    value?: number
}>

// #region VALUE
export type Field_number_value = number
export type Field_number_unchecked = Field_number_value | undefined

// #region TYPES
export type Field_number_types = {
    $Type: 'number'
    $Config: Field_number_config
    $Serial: Field_number_serial
    $Value: Field_number_value
    $Unchecked: Field_number_unchecked
    $Field: Field_number
}

// #region STATE
export class Field_number extends Field<Field_number_types> {
    // #region TYPE
    static readonly type: 'number' = 'number'
    static readonly emptySerial: Field_number_serial = { $: 'number' }

    static migrateSerial(serial: object): Maybe<Field_number_serial> {
        // migrate from string with number typed as string
        if (isProbablySerialString(serial)) {
            const prop = serial.value
            if (prop != null && parseInt(prop, 10) === +prop) {
                return { $: 'number', value: +prop }
            }
        }
    }

    // #region CTOR
    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_number>,
        initialMountKey: string,
        serial?: Field_number_serial,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (FieldNumber#constructor ❌)`)
        // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(this.serial)} (FieldNumber#constructor ❌)`)
        this.init(serial, {
            value: computed,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    // #region SERIAL
    protected setOwnSerial(next: Field_number_serial): void {
        if (next.value == null) {
            const def = this.defaultValue
            if (def != null) next = produce(next, (draft) => void (draft.value = def))
        }
        // assign given serial (or default one)
        this.assignNewSerial(next)
    }

    // #region UI
    DefaultHeaderUI = WidgetNumberUI
    DefaultBodyUI = undefined

    readonly forceSnap: boolean = false

    get defaultValue(): number | undefined {
        return this.config.default
    }

    get isOwnSet(): boolean {
        return this.serial.value != null
    }

    get hasChanges(): boolean {
        return this.serial.value !== this.defaultValue
    }

    get ownTypeSpecificProblems(): Maybe<string> {
        if (!this.isSet) return null

        const value = this.value_or_zero
        // < MIN
        if (this.config.min != null && value < this.config.min) {
            return `Value is less than ${this.config.min}`
        }
        // > MAX
        if (this.config.max != null && value > this.config.max) {
            return `Value is greater than ${this.config.max}`
        }
        return null
    }

    get value(): Field_number_value {
        return this.value_or_fail
    }

    set value(next: Field_number_value) {
        if (this.serial.value === next) return
        this.runInValueTransaction((tct) => {
            this.patchSerial((serial) => void (serial.value = next))
        })
    }

    get value_or_fail(): number {
        const val = this.value_unchecked
        if (val == null) throw new Error('Field_number.value_or_fail: not set')
        return val
    }

    get value_or_zero(): number {
        return this.value_unchecked ?? 0
    }

    get value_unchecked(): Field_number_unchecked {
        return this.serial.value
    }

    // #region SETTERS
    /** randomize respect (soft)Min and (soft)max */
    randomize(): void {
        const min = this.config.softMin ?? this.config.min ?? 0
        const max = this.config.softMax ?? this.config.max ?? 100
        this.value = Math.floor(Math.random() * (max - min + 1))
    }
}

// DI
registerFieldClass('number', Field_number)
