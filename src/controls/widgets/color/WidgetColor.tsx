import type { Form } from '../../Form'
import type { IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { IWidget } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetColorUI } from './WidgetColorUI'
import { applyWidgetMixinV2 } from 'src/controls/Mixins'

// CONFIG
export type Widget_color_config = WidgetConfigFields<{ default?: string }, Widget_color_types>

// SERIAL
export type Widget_color_serial = WidgetSerialFields<{ type: 'color'; active: true; val: string }>

// OUT
export type Widget_color_output = string

// TYPES
export type Widget_color_types = {
    $Type: 'color'
    $Config: Widget_color_config
    $Serial: Widget_color_serial
    $Value: Widget_color_output
    $Widget: Widget_color
}

// STATE
export interface Widget_color extends Widget_color_types, IWidgetMixins {}
export class Widget_color implements IWidget<Widget_color_types> {
    DefaultHeaderUI = WidgetColorUI
    DefaultBodyUI = undefined
    get serialHash(): string {
        return hash(this.value)
    }
    readonly id: string
    readonly type: 'color' = 'color'

    serial: Widget_color_serial

    constructor(
        //
        public readonly form: Form<any, any>,
        public readonly config: Widget_color_config,
        serial?: Widget_color_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'color',
            collapsed: config.startCollapsed,
            id: this.id,
            active: true,
            val: config.default ?? '',
        }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    get value(): Widget_color_output {
        return this.serial.val
    }
}

// DI
WidgetDI.Widget_color = Widget_color
