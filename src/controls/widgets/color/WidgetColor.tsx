import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetColorUI } from './WidgetColorUI'

// CONFIG
export type Widget_color_config = WidgetConfigFields<{ default?: string }, Widget_color_types>

// SERIAL
export type Widget_color_serial = WidgetSerialFields<{
    type: 'color'
    /** color, stored as string */
    value: string
}>

// VALUE
export type Widget_color_value = string

// TYPES
export type Widget_color_types = {
    $Type: 'color'
    $Config: Widget_color_config
    $Serial: Widget_color_serial
    $Value: Widget_color_value
    $Widget: Widget_color
}

// STATE
export interface Widget_color extends Widget_color_types {}
export class Widget_color extends BaseWidget implements IWidget<Widget_color_types> {
    DefaultHeaderUI = WidgetColorUI
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'color' = 'color'

    get baseErrors(): Problem_Ext {
        return null
    }

    readonly defaultValue: string = this.config.default ?? '#000000'
    get isChanged() { return this.value !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.defaultValue)

    serial: Widget_color_serial

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_color>,
        serial?: Widget_color_serial,
    ) {
        super()
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'color',
            collapsed: config.startCollapsed,
            id: this.id,
            value: config.default ?? '#000000',
        }
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get value(): Widget_color_value {
        return this.serial.value
    }
    setValue(val: Widget_color_value) {
        this.value = val
    }
    set value(next: Widget_color_value) {
        if (this.serial.value === next) return
        runInAction(() => {
            this.serial.value = next
            this.bumpValue()
        })
    }
}

// DI
registerWidgetClass('color', Widget_color)
