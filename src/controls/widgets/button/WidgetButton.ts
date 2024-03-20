import type { Form } from '../../Form'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'
import type { DraftL } from 'src/models/Draft'

import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetInlineRunUI } from './WidgetButtonUI'
import { applyWidgetMixinV2 } from '../../Mixins'

export type Widget_button_context = {
    draft: DraftL
    widget: Widget_button
}

// CONFIG
export type Widget_button_config = WidgetConfigFields<
    {
        text?: string
        kind?: `primary` | `special` | `warning`
        icon?: (ctx: Widget_button_context) => string
        onClick?: (ctx: Widget_button_context) => void
    },
    Widget_button_types
>

// SERIAL
export type Widget_button_serial = WidgetSerialFields<{
    type: 'button'
    val: boolean
}>

// VALUE
export type Widget_button_value = boolean

// TYPES
export type Widget_button_types = {
    $Type: 'button'
    $Config: Widget_button_config
    $Serial: Widget_button_serial
    $Value: Widget_button_value
    $Widget: Widget_button
}

// STATE
export interface Widget_button extends Widget_button_types, IWidgetMixins {}
export class Widget_button implements IWidget<Widget_button_types> {
    DefaultHeaderUI = WidgetInlineRunUI
    DefaultBodyUI = undefined
    readonly id: string
    readonly type: 'button' = 'button'
    readonly serial: Widget_button_serial
    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public config: Widget_button_config,
        serial?: Widget_button_serial,
    ) {
        if (config.text) {
            config.label = config.label ?? ` `
        }

        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'button',
            collapsed: config.startCollapsed,
            id: this.id,
            val: false,
        }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    get value(): Widget_button_value {
        return this.serial.val
    }
    set value(next: boolean) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.bumpValue()
        })
    }
}

// DI
WidgetDI.Widget_button = Widget_button
