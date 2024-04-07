import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { computed, makeAutoObservable, observable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
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

        /** Set the icon of the button
         *  - Uses "material-symbols-outlined" as the icon set
         */
        icon?: string | undefined
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
export interface Widget_bool extends Widget_bool_types, IWidgetMixins {}
export class Widget_bool implements IWidget<Widget_bool_types> {
    DefaultHeaderUI = WidgetBoolUI
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'bool' = 'bool'

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
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            id: this.id,
            type: 'bool',
            active: this.spec.config.default ?? false,
            collapsed: this.spec.config.startCollapsed,
        }

        applyWidgetMixinV2(this)
        makeAutoObservable(this, {
            serial: observable,
            value: computed,
        })
    }

    get value(): Widget_bool_value {
        return this.serial.active ?? false
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
