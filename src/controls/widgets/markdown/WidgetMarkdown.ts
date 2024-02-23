import type { Form } from '../../Form'
import type { Widget_group } from '../group/WidgetGroup'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_markdown_config = WidgetConfigFields<{ markdown: string | ((formRoot: Widget_group<any>) => string) }>

// SERIAL
export type Widget_markdown_serial = WidgetSerialFields<{ type: 'markdown'; active: true }>

// OUT
export type Widget_markdown_output = { type: 'markdown'; active: true }

// TYPES
export type Widget_markdown_types = {
    $Type: 'markdown'
    $Input: Widget_markdown_config
    $Serial: Widget_markdown_serial
    $Output: Widget_markdown_output
}

// STATE
export interface Widget_markdown extends Widget_markdown_types {}
export class Widget_markdown implements IWidget<Widget_markdown_types> {
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'markdown' = 'markdown'
    readonly serial: Widget_markdown_serial

    get serialHash(): string {
        return this.id
    }

    get markdown(): string {
        const md = this.config.markdown
        if (typeof md === 'string') return md
        return md(this.form._ROOT)
    }

    constructor(public form: Form<any>, public config: Widget_markdown_config, serial?: Widget_markdown_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type: 'markdown', collapsed: config.startCollapsed, active: true, id: this.id }
        makeAutoObservable(this)
    }

    get value(): Widget_markdown_output {
        return this.serial
    }
}

// DI
WidgetDI.Widget_markdown = Widget_markdown
