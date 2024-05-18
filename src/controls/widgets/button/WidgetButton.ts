import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
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
        kind?: `primary` | `special` | `warning`
        useContext?: () => K
        icon?: (ctx: Widget_button_context<K>) => string
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
    get config() { return this.spec.config } // prettier-ignore
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
        const config = spec.config
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

        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

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
