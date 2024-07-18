import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { FC } from 'react'

import { computed } from 'mobx'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetBoolUI } from './WidgetBoolUI'

// CONFIG
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
    $: 'bool'
    value?: boolean
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
    readonly DefaultHeaderUI: FC<{ field: Field_bool }> = WidgetBoolUI
    readonly DefaultBodyUI: undefined = undefined

    constructor(
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_bool>,
        serial?: Field_bool_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            value: computed,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_bool_serial>): void {
        this.serial.value =
            (serial as any)?.active ?? // ⏱️ backward compat
            serial?.value ??
            this.defaultValue
    }

    get value(): Field_bool_value {
        return this.serial.value ?? this.defaultValue
    }

    set value(next: Field_bool_value) {
        if (this.serial.value === next) return
        this.runInValueTransaction(() => (this.serial.value = next))
    }

    get ownProblems(): Problem_Ext {
        return null
    }

    /** set the value to true */
    setOn(): void {
        this.value = true
    }

    /** set the value to false */
    setOff(): void {
        this.value = false
    }

    /**
     * set value to true if false, and to false if true
     * return new value
     */
    toggle(): void {
        this.value = !this.value
    }

    get defaultValue(): boolean {
        return this.config.default ?? false
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }
}

// DI
registerFieldClass('bool', Field_bool)
