import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { observable } from 'mobx'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSpacerUI } from './WidgetSpacerUI'

/**
 * Bool Config
 * @property {string} label2 - test
 */
export type Field_spacer_config = FieldConfig<{}, Field_spacer_types>

// SERIAL
export type Field_spacer_serial = FieldSerial<{
    type: 'spacer'
}>

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

    static readonly type: 'spacer' = 'spacer'

    hasChanges = false
    reset(): void {}

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_spacer>,
        serial?: Field_spacer_serial,
    ) {
        super(repo, root, parent, schema)
        this.setSerial(serial, false)
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_spacer_serial>): void {}

    get value() {
        return false
    }
    set value(val) {}
}

// DI
registerWidgetClass('spacer', Field_spacer)
