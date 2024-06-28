import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetMardownUI } from './WidgetMarkdownUI'

// CONFIG
export type Widget_markdown_config = FieldConfig<
    {
        markdown: string | ((self: Widget_markdown) => string)
        inHeader?: boolean
    },
    Widget_markdown_types
>

// SERIAL
export type Widget_markdown_serial = FieldSerial<{
    type: 'markdown'
}>

// VALUE
export type Widget_markdown_value = { type: 'markdown' }

// TYPES
export type Widget_markdown_types = {
    $Type: 'markdown'
    $Config: Widget_markdown_config
    $Serial: Widget_markdown_serial
    $Value: Widget_markdown_value
    $Field: Widget_markdown
}

// STATE
export class Widget_markdown extends BaseField<Widget_markdown_types> {
    readonly id: string
    readonly type: 'markdown' = 'markdown'
    readonly serial: Widget_markdown_serial

    get DefaultHeaderUI() {
        if (this.config.inHeader) return WidgetMardownUI
        return undefined
    }

    get DefaultBodyUI() {
        if (this.config.inHeader) return undefined
        return WidgetMardownUI
    }

    get baseErrors(): Problem_Ext {
        return null
    }

    get markdown(): string {
        const md = this.config.markdown
        if (typeof md === 'string') return md
        return md(this)
    }

    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_markdown>,
        serial?: Widget_markdown_serial,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? {
            type: 'markdown',
            collapsed: config.startCollapsed,
            id: this.id,
        }
        this.init()
    }

    /** always return false */
    hasChanges = false

    /** do nothing */
    reset(): void {}

    set value(val: Widget_markdown_value) {
        // do nothing; markdown have no real value; only config
        // this.value = val
    }
    get value(): Widget_markdown_value {
        return this.serial
    }
}

// DI
registerWidgetClass('markdown', Widget_markdown)
