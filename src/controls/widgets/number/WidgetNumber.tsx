import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { computed, makeObservable, observable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
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
export interface Widget_number extends Widget_number_types, IWidgetMixins {}
export class Widget_number implements IWidget<Widget_number_types> {
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

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_number>,
        serial?: Widget_number_serial,
    ) {
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'number',
            collapsed: config.startCollapsed,
            id: this.id,
            val: config.default ?? 0,
        }

        applyWidgetMixinV2(this)
        makeObservable(this, {
            serial: observable,
            value: computed,
        })
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
