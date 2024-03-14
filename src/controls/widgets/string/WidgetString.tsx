import type { IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Form } from 'src/controls/Form'
import type { IWidget } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetString_HeaderUI, WidgetString_TextareaBodyUI, WidgetString_TextareaHeaderUI } from './WidgetStringUI'
import { applyWidgetMixinV2 } from 'src/controls/Mixins'

// CONFIG
export type Widget_string_config = WidgetConfigFields<
    {
        default?: string
        textarea?: boolean
        placeHolder?: string
        inputType?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'time' | 'date' | 'datetime-local' | 'color'
    },
    Widget_string_types
>

// SERIAL
export type Widget_string_serial = WidgetSerialFields<{ type: 'str'; val?: string }>

// VALUE
export type Widget_string_value = string

// TYPES
export type Widget_string_types = {
    $Type: 'str'
    $Config: Widget_string_config
    $Serial: Widget_string_serial
    $Value: Widget_string_value
    $Widget: Widget_string
}

// STATE
export interface Widget_string extends Widget_string_types, IWidgetMixins {}
export class Widget_string implements IWidget<Widget_string_types> {
    get DefaultHeaderUI() {
        if (this.config.textarea) return WidgetString_TextareaHeaderUI
        else return WidgetString_HeaderUI
    }
    get DefaultBodyUI() {
        if (this.config.textarea) return WidgetString_TextareaBodyUI
        return undefined
    }
    readonly border = false
    readonly id: string
    readonly type: 'str' = 'str'
    get serialHash () { return hash(this.value) } // prettier-ignore

    serial: Widget_string_serial
    readonly defaultValue: string = this.config.default ?? ''
    get isChanged() { return this.serial.val !== this.defaultValue } // prettier-ignore
    reset = () => { this.serial.val = this.defaultValue } // prettier-ignore

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly config: Widget_string_config,
        serial?: Widget_string_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'str',
            val: this.config.default,
            collapsed: config.startCollapsed,
            id: this.id,
        }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    set value(next: Widget_string_value) {
        // this.form.
        this.serial.val = next
    }
    get value(): Widget_string_value {
        return this.serial.val ?? this.config.default ?? ''
    }
}

// DI
WidgetDI.Widget_string = Widget_string
