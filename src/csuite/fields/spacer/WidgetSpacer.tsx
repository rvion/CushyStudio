import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { observable } from 'mobx'
import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSpacerUI } from './WidgetSpacerUI'

/**
 * Bool Config
 * @property {string} label2 - test
 */
export type Field_spacer_config = FieldConfig<{}, Field_spacer_types>

// SERIAL
export type Field_spacer_serial = FieldSerial<{ type: 'spacer' }>

// SERIAL FROM VALUE
export const Field_spacer_fromValue = (val: Field_spacer_value): Field_spacer_serial => ({
    type: 'spacer',
})

// VALUE
export type Field_spacer_value = boolean

// TYPES
export type Field_spacer_types = {
    $Type: 'spacer'
    $Config: Field_spacer_config
    $Serial: Field_spacer_serial
    $Value: Field_spacer_value
    $Field: Field_spacer
}

// STATE
export class Field_spacer extends Field<Field_spacer_types> {
    DefaultHeaderUI = WidgetSpacerUI
    DefaultBodyUI = undefined
    get baseErrors(): Problem_Ext {
        return null
    }
    readonly id: string

    readonly type: 'spacer' = 'spacer'
    serial: Field_spacer_serial

    hasChanges = false
    reset(): void {}

    constructor(
        //
        entity: Entity,
        parent: Field | null,
        schema: ISchema<Field_spacer>,
        serial?: Field_spacer_serial,
    ) {
        super(entity, parent, schema)
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            id: this.id,
            type: 'spacer',
            collapsed: false,
        }

        this.init({
            serial: observable,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get value() {
        return false
    }
    set value(val) {
        // do nothing
    }
}

// DI
registerWidgetClass('spacer', Field_spacer)
