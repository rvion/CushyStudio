import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetInlineRunUI } from './WidgetButtonUI'

export type Widget_button_context<K> = {
    context: K
    widget: Widget_button<K>
}

// CONFIG
export type Widget_button_config<K = any> = WidgetConfigFields<
    {
        text?: string
        /** @default false */
        default?: boolean
        kind?: `primary` | `special` | `warning`
        useContext?: () => K
        // icon?: (ctx: Widget_button_context<K>) => string
        onClick?: (ctx: Widget_button_context<K>) => void
    },
    Widget_button_types<K>
>

// SERIAL
export type Widget_button_serial = WidgetSerialFields<{
    type: 'button'
    val: boolean
}>

// VALUE
export type Widget_button_value = boolean

// TYPES
export type Widget_button_types<K> = {
    $Type: 'button'
    $Config: Widget_button_config<K>
    $Serial: Widget_button_serial
    $Value: Widget_button_value
    $Widget: Widget_button<K>
}

// STATE
export interface Widget_button<K> extends Widget_button_types<K> {}
export class Widget_button<K> extends BaseWidget implements IWidget<Widget_button_types<K>> {
    DefaultHeaderUI = WidgetInlineRunUI
    DefaultBodyUI = undefined
    readonly id: string

    readonly type: 'button' = 'button'
    readonly serial: Widget_button_serial

    get baseErrors(): Problem_Ext {
        return null
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_button<K>>,
        serial?: Widget_button_serial,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        if (config.text) {
            config.label = config.label ?? ` `
        }

        this.serial = serial ?? {
            type: 'button',
            collapsed: config.startCollapsed,
            id: this.id,
            val: config.default ?? false,
        }

        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get defaultValue(): boolean { return this.config.default ?? false } // prettier-ignore
    get hasChanges() { return this.serial.val !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.defaultValue)

    get value(): Widget_button_value {
        return this.serial.val
    }
    setValue(val: boolean) {
        this.value = val
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
registerWidgetClass('button', Widget_button)
