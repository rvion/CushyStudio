import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetString_HeaderUI, WidgetString_TextareaBodyUI, WidgetString_TextareaHeaderUI } from './WidgetStringUI'

type CssProprtyGlobals = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset'
type CssProprtyResize = CssProprtyGlobals | 'block' | 'both' | 'horizontal' | 'inline' | 'none' | 'vertical'

// CONFIG
export type Widget_string_config = WidgetConfigFields<
    {
        default?: string
        textarea?: boolean
        placeHolder?: string
        pattern?: string
        inputType?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'time' | 'date' | 'datetime-local' | 'color'
        resize?: CssProprtyResize
        /**
         * if set to true, widget will commit values on enter; not before.
         * hitting esc will revert to the last committed value
         * */
        buffered?: boolean
    },
    Widget_string_types
>

// SERIAL
export type Widget_string_serial = WidgetSerialFields<{ type: 'str'; val?: string }>

// SERIAL FROM VALUE
export const Widget_string_fromValue = (val: string): Widget_string_serial => ({
    type: 'str',
    val,
})

// VALUE
export type Widget_string_value = string

// TYPES
export type Widget_string_types = {
    $Type: 'str'
    $Config: Widget_string_config
    $Serial: Widget_string_serial
    $Value: Widget_string_value
    $Widget: Widget_string
}

// STATE
export interface Widget_string extends Widget_string_types {}
export class Widget_string extends BaseWidget implements IWidget<Widget_string_types> {
    get DefaultHeaderUI() {
        if (this.config.textarea) return WidgetString_TextareaHeaderUI
        else return WidgetString_HeaderUI
    }
    get DefaultBodyUI() {
        if (this.config.textarea) return WidgetString_TextareaBodyUI
        return undefined
    }
    get baseErrors(): Problem_Ext {
        return null
    }
    readonly border = false
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'str' = 'str'

    // --------------
    temporaryValue: string | null = null
    setTemporaryValue = (next: string | null) => (this.temporaryValue = next)
    // --------------

    serial: Widget_string_serial
    readonly defaultValue: string = this.config.default ?? ''
    get isChanged() { return this.serial.val !== this.defaultValue } // prettier-ignore
    reset = () => { this.value = this.defaultValue } // prettier-ignore

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_string>,
        serial?: Widget_string_serial,
    ) {
        super()
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'str',
            val: this.config.default,
            collapsed: config.startCollapsed,
            id: this.id,
        }
        makeAutoObservableInheritance(this)
    }
    setValue(val: Widget_string_value) {
        this.value = val
    }
    set value(next: Widget_string_value) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.bumpValue()
        })
    }
    get value(): Widget_string_value {
        return this.serial.val ?? this.config.default ?? ''
    }
}

// DI
registerWidgetClass('str', Widget_string)
