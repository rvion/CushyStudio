// 🟢
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'
import { hash } from 'ohash'

export type Widget_cmprompt_config = WidgetConfigFields<{ default?: string; textarea?: boolean; placeHolder?: string }>
export type Widget_cmprompt_serial = WidgetSerialFields<{ type: 'cmprompt'; val?: string }>
export type Widget_cmprompt_output = string
export type Widget_cmprompt_types = {
    $Type: 'cmprompt'
    $Input: Widget_cmprompt_config
    $Serial: Widget_cmprompt_serial
    $Output: Widget_cmprompt_output
}

// STATE
export interface Widget_cmprompt extends WidgetTypeHelpers<Widget_cmprompt_types> {}
export class Widget_cmprompt implements IWidget<Widget_cmprompt_types> {
    get serialHash () { return hash(this.result) } // prettier-ignore
    get isVerticalByDefault(): boolean {
        if (this.config.textarea) return true
        return false
    }

    get isCollapsible() { return this.config.textarea ?? false } // prettier-ignore

    readonly id: string
    readonly type: 'cmprompt' = 'cmprompt'

    serial: Widget_cmprompt_serial

    constructor(
        public readonly form: FormBuilder,
        public readonly config: Widget_cmprompt_config,
        serial?: Widget_cmprompt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'cmprompt',
            collapsed: config.startCollapsed,
            id: this.id,
        }
        makeAutoObservable(this)
    }

    get result(): Widget_cmprompt_output {
        return this.serial.val ?? this.config.default ?? ''
    }
}

// DI
WidgetDI.Widget_cmprompt = Widget_cmprompt
