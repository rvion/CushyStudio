import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetColorUI } from './WidgetColorUI'

// CONFIG
export type Field_color_config = FieldConfig<{ default?: string }, Field_color_types>

// SERIAL
export type Field_color_serial = FieldSerial<{
    $: 'color'
    /** color, stored as string */
    value?: string
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
    static readonly type: 'color' = 'color'
    readonly DefaultHeaderUI = WidgetColorUI
    readonly DefaultBodyUI = undefined

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_color>,
        serial?: Field_color_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_color_serial>): void {
        this.serial.value = serial?.value ?? this.defaultValue
    }

    get value(): Field_color_value {
        return this.serial.value ?? this.config.default ?? ''
    }

    set value(next: Field_color_value) {
        if (this.serial.value === next) return
        this.runInValueTransaction(() => (this.serial.value = next))
    }

    get ownProblems(): Problem_Ext {
        return null
    }

    get defaultValue(): string {
        return this.config.default ?? '#000000'
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }
}

// DI
registerFieldClass('color', Field_color)
