import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'

import { computed } from 'mobx'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetNumberUI } from './WidgetNumberUI'

// CONFIG
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

// SERIAL
export type Field_number_serial = FieldSerial<{
    $: 'number'
    value?: number
}>

// VALUE
export type Field_number_value = number

// TYPES
export type Field_number_types = {
    $Type: 'number'
    $Config: Field_number_config
    $Serial: Field_number_serial
    $Value: Field_number_value
    $Field: Field_number
}

// STATE
export class Field_number extends Field<Field_number_types> {
    static readonly type: 'number' = 'number'
    DefaultHeaderUI = WidgetNumberUI
    DefaultBodyUI = undefined

    readonly forceSnap: boolean = false

    get defaultValue(): number {
        return this.config.default ?? 0
    }

    get hasChanges(): boolean {
        return this.serial.value !== this.defaultValue
    }

    get ownProblems(): Maybe<string> {
        // < MIN
        if (this.config.min != null && this.value < this.config.min) {
            return `Value is less than ${this.config.min}`
        }
        // > MAX
        if (this.config.max != null && this.value > this.config.max) {
            return `Value is greater than ${this.config.max}`
        }
        return null
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_number>,
        serial?: Field_number_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            value: computed,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_number_serial>): void {
        this.serial.value = serial?.value ?? (serial as any)?.val ?? this.defaultValue
    }

    /** randomize respect (soft)Min and (soft)max */
    randomize(): void {
        const min = this.config.softMin ?? this.config.min ?? 0
        const max = this.config.softMax ?? this.config.max ?? 100
        this.value = Math.floor(Math.random() * (max - min + 1))
    }

    get value(): Field_number_value {
        return this.serial.value ?? this.config.default ?? 0
    }

    set value(next: Field_number_value) {
        if (this.serial.value === next) return
        this.runInValueTransaction(() => (this.serial.value = next))
    }
}

// DI
registerFieldClass('number', Field_number)
