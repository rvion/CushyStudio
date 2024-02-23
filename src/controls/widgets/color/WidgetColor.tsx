import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_color_config = WidgetConfigFields<{ default?: string }>

// SERIAL
export type Widget_color_serial = WidgetSerialFields<{ type: 'color'; active: true; val: string }>

// OUT
export type Widget_color_output = string

// TYPES
export type Widget_color_types = {
    $Type: 'color'
    $Input: Widget_color_config
    $Serial: Widget_color_serial
    $Output: Widget_color_output
}

// STATE
export interface Widget_color extends Widget_color_types {}
export class Widget_color implements IWidget<Widget_color_types> {
    get serialHash(): string {
        return hash(this.value)
    }
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'color' = 'color'

    serial: Widget_color_serial

    constructor(public readonly form: Form<any>, public readonly config: Widget_color_config, serial?: Widget_color_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'color',
            collapsed: config.startCollapsed,
            id: this.id,
            active: true,
            val: config.default ?? '',
        }
        makeAutoObservable(this)
    }

    get value(): Widget_color_output {
        return this.serial.val
    }
}

// DI
WidgetDI.Widget_color = Widget_color
