import type { FrameAppearance } from '../../frame/FrameTemplates'
import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
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
        // icon?: (ctx: Field_button_context<K>) => string
        onClick?: (ctx: Field_button_context<K>) => void
    },
    Field_button_types<K>
>

// SERIAL
export type Field_button_serial = FieldSerial<{
    type: 'button'
    val: boolean
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
    DefaultHeaderUI = WidgetButtonUI
    DefaultBodyUI = undefined
    readonly id: string

    static readonly type: 'button' = 'button'
    readonly type: 'button' = 'button'
    readonly serial: Field_button_serial

    get baseErrors(): Problem_Ext {
        return null
    }

    constructor(
        //
        entity: Entity,
        parent: Field | null,
        schema: ISchema<Field_button<K>>,
        serial?: Field_button_serial,
    ) {
        super(entity, parent, schema)
        this.id = serial?.id ?? nanoid()
        const config = schema.config
        if (config.text) {
            config.label = config.label ?? ` `
        }

        this.serial = serial ?? {
            type: 'button',
            collapsed: config.startCollapsed,
            id: this.id,
            val: config.default ?? false,
        }

        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get defaultValue(): boolean { return this.config.default ?? false } // prettier-ignore
    get hasChanges(): boolean { return this.serial.val !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.defaultValue)

    get value(): Field_button_value {
        return this.serial.val
    }
    set value(next: boolean) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('button', Field_button)
