import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'
import { hash } from 'ohash'

export type Widget_string_config = WidgetConfigFields<{ default?: string; textarea?: boolean; placeHolder?: string }>
export type Widget_string_serial = WidgetSerialFields<{ type: 'str'; val?: string }>
export type Widget_string_output = string
export type Widget_string_types = {
    $Type: 'str'
    $Input: Widget_string_config
    $Serial: Widget_string_serial
    $Output: Widget_string_output
}

// STATE
export interface Widget_string extends WidgetTypeHelpers<Widget_string_types> {}
export class Widget_string implements IWidget<Widget_string_types> {
    get serialHash () { return hash(this.value) } // prettier-ignore
    get isVerticalByDefault(): boolean {
        if (this.config.textarea) return true
        return false
    }

    get isCollapsible() { return this.config.textarea ?? false } // prettier-ignore

    readonly id: string
    readonly type: 'str' = 'str'

    serial: Widget_string_serial

    constructor(public readonly form: FormBuilder, public readonly config: Widget_string_config, serial?: Widget_string_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'str',
            collapsed: config.startCollapsed,
            id: this.id,
        }
        makeAutoObservable(this)
    }

    get value(): Widget_string_output {
        return this.serial.val ?? this.config.default ?? ''
    }
}

// DI
WidgetDI.Widget_string = Widget_string
