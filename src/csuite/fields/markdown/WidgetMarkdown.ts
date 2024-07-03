import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetMardownUI } from './WidgetMarkdownUI'

// CONFIG
export type Field_markdown_config = FieldConfig<
    {
        markdown: string | ((self: Field_markdown) => string)
        inHeader?: boolean
    },
    Field_markdown_types
>

// SERIAL
export type Field_markdown_serial = FieldSerial<{
    type: 'markdown'
}>

// VALUE
export type Field_markdown_value = { type: 'markdown' }

// TYPES
export type Field_markdown_types = {
    $Type: 'markdown'
    $Config: Field_markdown_config
    $Serial: Field_markdown_serial
    $Value: Field_markdown_value
    $Field: Field_markdown
}

// STATE
export class Field_markdown extends Field<Field_markdown_types> {
    static readonly type: 'markdown' = 'markdown'

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
        parent: Field | null,
        schema: ISchema<Field_markdown>,
        serial?: Field_markdown_serial,
    ) {
        super(entity, parent, schema)
        const config = schema.config
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

    set value(val: Field_markdown_value) {
        // do nothing; markdown have no real value; only config
        // this.value = val
    }
    get value(): Field_markdown_value {
        return this.serial
    }
}

// DI
registerWidgetClass('markdown', Field_markdown)
