import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { FC } from 'react'

import { computed, observable, runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetBoolUI } from './WidgetBoolUI'

/**
 * Bool Config
 * @property {string} label2 - test
 */
export type Field_bool_config = FieldConfig<
    {
        /**
         * default value; true or false
         * @default: false
         */
        default?: boolean

        /** (legacy ?) Label to display to the right of the widget. */
        label2?: string

        /** Text to display, drawn by the widget itself. */
        text?: string

        /**
         * The display style of the widget.
         * - `check `: Shows a simple checkbox.
         * - `button`: Shows a toggle-able button.
         *
         *  Defaults to 'check'
         */
        display?: 'check' | 'button'

        /** Whether or not to expand the widget to take up as much space as possible
         *
         *      If `display` is 'check'
         *          undefined and true will expand
         *          false will disable expansion
         *
         *      If `display` is 'button'
         *          undefined and false will not expand
         *          true will enable expansion
         */
        expand?: boolean
    },
    Field_bool_types
>

// SERIAL
export type Field_bool_serial = FieldSerial<{
    type: 'bool'
    active?: boolean
}>

// VALUE
export type Field_bool_value = boolean

// TYPES
export type Field_bool_types = {
    $Type: 'bool'
    $Config: Field_bool_config
    $Serial: Field_bool_serial
    $Value: Field_bool_value
    $Field: Field_bool
}

// STATE
export class Field_bool extends Field<Field_bool_types> {
    static readonly type: 'bool' = 'bool'

    constructor(
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_bool>,
        serial?: Field_bool_serial,
    ) {
        super(repo, root, parent, schema)
        this.setSerial(serial, false)
        this.init({
            value: computed,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    readonly DefaultHeaderUI: FC<{ field: Field_bool }> = WidgetBoolUI
    readonly DefaultBodyUI: undefined = undefined

    get baseErrors(): Problem_Ext {
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

    /**
     * set value to true if false, and to false if true
     * return new value
     */
    toggle(): boolean {
        return (this.value = !this.value)
    }

    protected setOwnSerial(serial: Maybe<Field_bool_serial>): void {
        this.serial.active = serial?.active ?? this.defaultValue
    }

    get defaultValue(): boolean {
        return this.config.default ?? false
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }

    get value(): Field_bool_value {
        return this.serial.active ?? this.defaultValue
    }

    set value(next: Field_bool_value) {
        if (this.serial.active === next) return
        runInAction(() => {
            this.serial.active = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('bool', Field_bool)
