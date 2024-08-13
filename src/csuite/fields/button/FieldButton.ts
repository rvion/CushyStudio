import type { FrameAppearance } from '../../frame/FrameTemplates'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetButtonUI } from './WidgetButtonUI'

export type Field_button_context<K> = {
    context: K
    widget: Field_button<K>
}

// CONFIG
export type Field_button_config<K = any> = FieldConfig<
    {
        text?: string
        /** @default false */
        default?: boolean
        look?: FrameAppearance
        expand?: boolean
        useContext?: () => K
        onClick?: (ctx: Field_button_context<K>) => void
    },
    Field_button_types<K>
>

// SERIAL
export type Field_button_serial = FieldSerial<{
    $: 'button'
    val?: boolean
}>

// VALUE
export type Field_button_value = boolean

// TYPES
export type Field_button_types<K> = {
    $Type: 'button'
    $Config: Field_button_config<K>
    $Serial: Field_button_serial
    $Value: Field_button_value
    $Field: Field_button<K>
}

// STATE
export class Field_button<K> extends Field<Field_button_types<K>> {
    static readonly type: 'button' = 'button'
    readonly DefaultHeaderUI = WidgetButtonUI
    readonly DefaultBodyUI = undefined

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_button<K>>,
        serial?: Field_button_serial,
    ) {
        super(repo, root, parent, schema)
        const config = schema.config
        if (config.text) config.label = config.label ?? ` `
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_button_serial>): void {
        this.serial.val = serial?.val ?? this.defaultValue
    }

    get value(): Field_button_value {
        return this.serial.val ?? this.defaultValue
    }

    set value(next: boolean) {
        if (this.serial.val === next) return
        this.runInValueTransaction(() => (this.serial.val = next))
    }

    get ownProblems(): Problem_Ext {
        return null
    }

    /** set the value to true */
    setOn(): true {
        return (this.value = true)
    }

    /** set the value to false */
    setOff(): false {
        return (this.value = false)
    }

    /** set value to true if false, and to false if true */
    toggle(): boolean {
        return (this.value = !this.value)
    }

    get defaultValue(): boolean {
        return this.config.default ?? false
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }
}

// DI
registerFieldClass('button', Field_button)
