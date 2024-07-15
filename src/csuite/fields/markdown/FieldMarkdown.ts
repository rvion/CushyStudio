import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { FC } from 'react'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
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
    $: 'markdown'
}>

// VALUE
export type Field_markdown_value = { $: 'markdown' }

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

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_markdown>,
        serial?: Field_markdown_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial)
    }

    protected setOwnSerial(serial: Maybe<Field_markdown_serial>): void {}

    get DefaultHeaderUI(): FC<{ field: Field_markdown }> | undefined {
        if (this.config.inHeader) return WidgetMardownUI
        return undefined
    }

    get DefaultBodyUI(): FC<{ field: Field_markdown }> | undefined {
        if (this.config.inHeader) return undefined
        return WidgetMardownUI
    }

    get ownProblems(): Problem_Ext {
        return null
    }

    get markdown(): string {
        const md = this.config.markdown
        if (typeof md === 'string') return md
        return md(this)
    }

    /**
     * always return false, because the text isn't part of the serial, it's part of the config
     * markdown fields have NO value
     */
    get hasChanges(): boolean {
        return false
    }

    /** do nothing, see coment on the hasChange getter */
    // ⏸️ reset(): void {}

    /** do nothing, see coment on the hasChange getter */
    set value(_: Field_markdown_value) {}

    get value(): Field_markdown_value {
        return this.serial
    }
}

// DI
registerFieldClass('markdown', Field_markdown)
