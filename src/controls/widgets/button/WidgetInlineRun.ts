import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_inlineRun_config = WidgetConfigFields<{ text?: string; kind?: `primary` | `special` | `warning` }>

// SERIAL
export type Widget_inlineRun_serial = WidgetSerialFields<{ type: 'inlineRun'; active: true; val: boolean }>

// OUT
export type Widget_inlineRun_output = boolean

// TYPES
export type Widget_inlineRun_types = {
    $Type: 'inlineRun'
    $Input: Widget_inlineRun_config
    $Serial: Widget_inlineRun_serial
    $Output: Widget_inlineRun_output
}

// STATE
export interface Widget_inlineRun extends Widget_inlineRun_types {}
export class Widget_inlineRun implements IWidget<Widget_inlineRun_types> {
    get serialHash(): string {
        return hash(this.value)
    }
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'inlineRun' = 'inlineRun'
    readonly serial: Widget_inlineRun_serial
    constructor(public form: Form<any>, public config: Widget_inlineRun_config, serial?: Widget_inlineRun_serial) {
        if (config.text) {
            config.label = config.label ?? ` `
        }

        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type: 'inlineRun', collapsed: config.startCollapsed, id: this.id, active: true, val: false }
        makeAutoObservable(this)
    }
    get value(): Widget_inlineRun_output {
        return this.serial.active ? this.serial.val : false
    }
}

WidgetDI.Widget_inlineRun = Widget_inlineRun
