import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
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
export interface Widget_markdown extends Widget_markdown_types {}
export class Widget_markdown extends BaseWidget implements IWidget<Widget_markdown_types> {
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
        super()
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type: 'markdown', collapsed: config.startCollapsed, active: true, id: this.id }
        makeAutoObservableInheritance(this)
    }

    setValue(val: Widget_markdown_value) {
        this.value = val
    }
    set value(val: Widget_markdown_value) {
        // do nothing; markdown have no real value; only config
    }
    get value(): Widget_markdown_value {
        return this.serial
    }
}

// DI
registerWidgetClass('markdown', Widget_markdown)
