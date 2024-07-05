import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'

import { computed, observable, runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
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
    type: 'number'
    val?: number
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
        return this.serial.val !== this.defaultValue
    }

    get ownProblems() {
        if (this.config.min !== undefined && this.value < this.config.min) return `Value is less than ${this.config.min}`
        if (this.config.max !== undefined && this.value > this.config.max) return `Value is greater than ${this.config.max}`
        return null
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_number>,
        serial?: Field_number_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            value: computed,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_number_serial>) {
        this.serial.val = serial?.val ?? this.defaultValue
    }

    /** randomize respect (soft)Min and (soft)max */
    randomize(): void {
        const min = this.config.softMin ?? this.config.min ?? 0
        const max = this.config.softMax ?? this.config.max ?? 100
        this.value = Math.floor(Math.random() * (max - min + 1))
    }

    get value(): Field_number_value {
        return this.serial.val ?? this.config.default ?? 0
    }

    set value(next: Field_number_value) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('number', Field_number)
