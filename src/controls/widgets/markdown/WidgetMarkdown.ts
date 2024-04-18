import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetMardownUI } from './WidgetMarkdownUI'

// CONFIG
export type Widget_markdown_config = WidgetConfigFields<
    {
        markdown: string | ((form: Form) => string)
        inHeader?: boolean
    },
    Widget_markdown_types
>

// SERIAL
export type Widget_markdown_serial = WidgetSerialFields<{
    type: 'markdown'
    active: true
}>

// VALUE
export type Widget_markdown_value = { type: 'markdown' }

// TYPES
export type Widget_markdown_types = {
    $Type: 'markdown'
    $Config: Widget_markdown_config
    $Serial: Widget_markdown_serial
    $Value: Widget_markdown_value
    $Widget: Widget_markdown
}

// STATE
export interface Widget_markdown extends Widget_markdown_types, IWidgetMixins {}
export class Widget_markdown implements IWidget<Widget_markdown_types> {
    get DefaultHeaderUI() {
        if (this.config.inHeader) return WidgetMardownUI
        return undefined
    }

    get DefaultBodyUI() {
        if (this.config.inHeader) return undefined
        return WidgetMardownUI
    }

    get alignLabel() {
        if (this.config.inHeader) return false
    }

    get baseErrors(): Problem_Ext {
        return null
    }
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'markdown' = 'markdown'
    readonly serial: Widget_markdown_serial

    get markdown(): string {
        const md = this.config.markdown
        if (typeof md === 'string') return md
        return md(this.form)
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_markdown>,
        serial?: Widget_markdown_serial,
    ) {
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type: 'markdown', collapsed: config.startCollapsed, active: true, id: this.id }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    get value(): Widget_markdown_value {
        return this.serial
    }
}

// DI
registerWidgetClass('markdown', Widget_markdown)
