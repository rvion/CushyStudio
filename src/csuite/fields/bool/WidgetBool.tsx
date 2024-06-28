import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { computed, observable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetBoolUI } from './WidgetBoolUI'

/**
 * Bool Config
 * @property {string} label2 - test
 */
export type Widget_bool_config = FieldConfig<
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
    Widget_bool_types
>

// SERIAL
export type Widget_bool_serial = FieldSerial<{ type: 'bool'; active: boolean }>

// VALUE
export type Widget_bool_value = boolean

// TYPES
export type Widget_bool_types = {
    $Type: 'bool'
    $Config: Widget_bool_config
    $Serial: Widget_bool_serial
    $Value: Widget_bool_value
    $Field: Widget_bool
}

// STATE
export class Widget_bool extends BaseField<Widget_bool_types> {
    readonly DefaultHeaderUI = WidgetBoolUI
    readonly DefaultBodyUI = undefined
    readonly id: string
    readonly type: 'bool' = 'bool'

    get baseErrors(): Problem_Ext {
        return null
    }

    serial: Widget_bool_serial

    setOn = () => (this.value = true)
    setOff = () => (this.value = false)
    toggle = () => (this.value = !this.value)

    readonly defaultValue: boolean = this.config.default ?? false
    get hasChanges(): boolean { return this.value !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.defaultValue)

    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_bool>,
        serial?: Widget_bool_serial,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            id: this.id,
            type: 'bool',
            active: this.spec.config.default ?? false,
            collapsed: this.spec.config.startCollapsed,
        }

        this.init({
            serial: observable,
            value: computed,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get value(): Widget_bool_value {
        return this.serial.active ?? false
    }
    set value(next: Widget_bool_value) {
        if (this.serial.active === next) return
        runInAction(() => {
            this.serial.active = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('bool', Widget_bool)
