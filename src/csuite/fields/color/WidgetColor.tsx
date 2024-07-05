import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetColorUI } from './WidgetColorUI'

// CONFIG
export type Field_color_config = FieldConfig<{ default?: string }, Field_color_types>

// SERIAL
export type Field_color_serial = FieldSerial<{
    type: 'color'
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
    DefaultHeaderUI = WidgetColorUI
    DefaultBodyUI = undefined

    get baseErrors(): Problem_Ext {
        return null
    }

    get defaultValue(): string {
        return this.config.default ?? '#000000'
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }

    reset(): void {
        this.value = this.defaultValue
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_color>,
        serial?: Field_color_serial,
    ) {
        super(repo, root, parent, schema)
        this.setSerial(serial, false)
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_color_serial>) {
        this.serial.value = serial?.value ?? this.defaultValue
    }

    get value(): Field_color_value {
        return this.serial.value ?? this.config.default ?? ''
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
