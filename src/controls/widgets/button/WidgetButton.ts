import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'
import type { DraftL } from 'src/models/Draft'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetInlineRunUI } from './WidgetButtonUI'

export type Widget_button_context = {
    draft: DraftL
    widget: Widget_button
}

// CONFIG
export type Widget_button_config = WidgetConfigFields<{
    text?: string
    kind?: `primary` | `special` | `warning`
    icon?: (ctx: Widget_button_context) => string
    onClick?: (ctx: Widget_button_context) => void
}>

// SERIAL
export type Widget_button_serial = WidgetSerialFields<{
    type: 'button'
    active: true
    val: boolean
}>

// OUT
export type Widget_button_output = boolean

// TYPES
export type Widget_button_types = {
    $Type: 'button'
    $Input: Widget_button_config
    $Serial: Widget_button_serial
    $Output: Widget_button_output
    $Widget: Widget_button
}

// STATE
export interface Widget_button extends Widget_button_types {}
export class Widget_button implements IWidget<Widget_button_types> {
    HeaderUI = WidgetInlineRunUI
    BodyUI = undefined
    get serialHash(): string {
        return hash(this.value)
    }
    readonly id: string
    readonly type: 'button' = 'button'
    readonly serial: Widget_button_serial
    constructor(public form: Form<any>, public config: Widget_button_config, serial?: Widget_button_serial) {
        if (config.text) {
            config.label = config.label ?? ` `
        }

        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'button',
            collapsed: config.startCollapsed,
            id: this.id,
            active: true,
            val: false,
        }
        makeAutoObservable(this)
    }
    get value(): Widget_button_output {
        return this.serial.active ? this.serial.val : false
    }
}

WidgetDI.Widget_button = Widget_button
