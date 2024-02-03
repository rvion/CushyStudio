// 🟢
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { Tree } from '@lezer/common'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'
import { hash } from 'ohash'
import { parser } from './grammar/grammar.parser'

export type Widget_cmprompt_config = WidgetConfigFields<{ default?: string; textarea?: boolean; placeHolder?: string }>
export type Widget_cmprompt_serial = WidgetSerialFields<{ type: 'cmprompt'; val?: string }>
export type Widget_cmprompt_output = { text: string; tree: Tree }
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

    // the raw unparsed text
    get text() {
        return this.serial.val ?? ''
    }
    // the parsed tree
    get ast(): Tree {
        return parser.parse(this.serial.val ?? '')
    }
    get result(): Widget_cmprompt_output {
        return {
            text: this.serial.val ?? this.config.default ?? '',
            tree: this.ast,
        }
    }
}

// DI
WidgetDI.Widget_cmprompt = Widget_cmprompt
