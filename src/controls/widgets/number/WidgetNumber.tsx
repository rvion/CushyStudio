import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetNumberUI } from './WidgetNumberUI'

// CONFIG
export type Widget_number_config = WidgetConfigFields<{
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
}>

// SERIAL
export type Widget_number_serial = WidgetSerialFields<{ type: 'number'; val: number }>

// OUT
export type Widget_number_output = number

// TYPES
export type Widget_number_types = {
    $Type: 'number'
    $Input: Widget_number_config
    $Serial: Widget_number_serial
    $Output: Widget_number_output
    $Widget: Widget_number
}

// STATE
export interface Widget_number extends Widget_number_types {}
export class Widget_number implements IWidget<Widget_number_types> {
    HeaderUI = WidgetNumberUI
    BodyUI = undefined
    get serialHash () { return hash(this.value) } // prettier-ignore
    readonly id: string
    readonly type: 'number' = 'number'
    readonly forceSnap: boolean = false

    serial: Widget_number_serial
    readonly defaultValue: number = this.config.default ?? 0
    get isChanged() { return this.serial.val !== this.defaultValue } // prettier-ignore
    reset = () => { this.serial.val = this.defaultValue } // prettier-ignore

    constructor(public readonly form: Form<any>, public readonly config: Widget_number_config, serial?: Widget_number_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'number',
            collapsed: config.startCollapsed,
            id: this.id,
            val: config.default ?? 0,
        }

        makeObservable(this, {
            serial: observable,
            value: computed,
        })
    }

    set value(val: Widget_number_output) {
        this.serial.val = val
    }
    get value(): Widget_number_output {
        return this.serial.val
    }
}

// DI
WidgetDI.Widget_number = Widget_number
