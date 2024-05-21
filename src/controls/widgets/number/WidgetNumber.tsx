import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { computed, observable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetNumberUI } from './WidgetNumberUI'

// CONFIG
export type Widget_number_config = WidgetConfigFields<
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
    Widget_number_types
>

// SERIAL
export type Widget_number_serial = WidgetSerialFields<{ type: 'number'; val: number }>

// VALUE
export type Widget_number_value = number

// TYPES
export type Widget_number_types = {
    $Type: 'number'
    $Config: Widget_number_config
    $Serial: Widget_number_serial
    $Value: Widget_number_value
    $Widget: Widget_number
}

// STATE
export interface Widget_number extends Widget_number_types {}
export class Widget_number extends BaseWidget implements IWidget<Widget_number_types> {
    DefaultHeaderUI = WidgetNumberUI
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'number' = 'number'
    readonly forceSnap: boolean = false

    serial: Widget_number_serial
    readonly defaultValue: number = this.config.default ?? 0
    get isChanged() { return this.serial.val !== this.defaultValue } // prettier-ignore
    reset = () => {
        if (this.serial.val === this.defaultValue) return
        this.value = this.defaultValue
    }

    get baseErrors() {
        if (this.config.min !== undefined && this.value < this.config.min) return `Value is less than ${this.config.min}`
        if (this.config.max !== undefined && this.value > this.config.max) return `Value is greater than ${this.config.max}`
        return null
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_number>,
        serial?: Widget_number_serial,
    ) {
        super()
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'number',
            collapsed: config.startCollapsed,
            id: this.id,
            val: config.default ?? 0,
        }

        this.init({
            serial: observable,
            value: computed,
        })
    }

    setValue(val: Widget_number_value) {
        this.value = val
    }
    set value(next: Widget_number_value) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.bumpValue()
        })
    }
    get value(): Widget_number_value {
        return this.serial.val
    }
}

// DI
registerWidgetClass('number', Widget_number)
