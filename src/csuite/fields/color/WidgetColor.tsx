import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetColorUI } from './WidgetColorUI'

// CONFIG
export type Field_color_config = FieldConfig<{ default?: string }, Field_color_types>

// SERIAL
export type Field_color_serial = FieldSerial<{
    type: 'color'
    /** color, stored as string */
    value: string
}>

// VALUE
export type Field_color_value = string

// TYPES
export type Field_color_types = {
    $Type: 'color'
    $Config: Field_color_config
    $Serial: Field_color_serial
    $Value: Field_color_value
    $Field: Field_color
}

// STATE
export class Field_color extends Field<Field_color_types> {
    DefaultHeaderUI = WidgetColorUI
    DefaultBodyUI = undefined
    readonly id: string

    readonly type: 'color' = 'color'

    get baseErrors(): Problem_Ext {
        return null
    }

    readonly defaultValue: string = this.config.default ?? '#000000'
    get hasChanges(): boolean { return this.value !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.defaultValue)

    serial: Field_color_serial

    constructor(
        //
        entity: Entity,
        parent: Field | null,
        schema: ISchema<Field_color>,
        serial?: Field_color_serial,
    ) {
        super(entity, parent, schema)
        this.id = serial?.id ?? nanoid()
        const config = schema.config
        this.serial = serial ?? {
            type: 'color',
            collapsed: config.startCollapsed,
            id: this.id,
            value: config.default ?? '#000000',
        }
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get value(): Field_color_value {
        return this.serial.value
    }
    set value(next: Field_color_value) {
        if (this.serial.value === next) return
        runInAction(() => {
            this.serial.value = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('color', Field_color)
