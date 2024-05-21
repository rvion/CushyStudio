import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { computed, observable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetBoolUI } from './WidgetBoolUI'

/**
 * Bool Config
 * @property {string} label2 - test
 */
export type Widget_bool_config = WidgetConfigFields<
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
export type Widget_bool_serial = WidgetSerialFields<{ type: 'bool'; active: boolean }>

// VALUE
export type Widget_bool_value = boolean

// TYPES
export type Widget_bool_types = {
    $Type: 'bool'
    $Config: Widget_bool_config
    $Serial: Widget_bool_serial
    $Value: Widget_bool_value
    $Widget: Widget_bool
}

// STATE
export interface Widget_bool extends Widget_bool_types {}
export class Widget_bool extends BaseWidget implements IWidget<Widget_bool_types> {
    DefaultHeaderUI = WidgetBoolUI
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'bool' = 'bool'

    get baseErrors(): Problem_Ext {
        return null
    }

    serial: Widget_bool_serial

    setOn = () => (this.value = true)
    setOff = () => (this.value = false)
    toggle = () => (this.value = !this.value)

    readonly defaultValue: boolean = this.config.default ?? false
    get isChanged() { return this.value !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.defaultValue)

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_bool>,
        serial?: Widget_bool_serial,
    ) {
        super()
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
    setValue(val: Widget_bool_value) {
        this.value = val
    }
    set value(next: Widget_bool_value) {
        if (this.serial.active === next) return
        runInAction(() => {
            this.serial.active = next
            this.bumpValue()
        })
    }
}

// DI
registerWidgetClass('bool', Widget_bool)
