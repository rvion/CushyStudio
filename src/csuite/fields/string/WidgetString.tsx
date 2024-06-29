import type { IconName } from '../../icons/icons'
import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetString_HeaderUI, WidgetString_TextareaBodyUI, WidgetString_TextareaHeaderUI } from './WidgetStringUI'

type CssProprtyGlobals = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset'
type CssProprtyResize = CssProprtyGlobals | 'block' | 'both' | 'horizontal' | 'inline' | 'none' | 'vertical'

// CONFIG
export type Widget_string_config = FieldConfig<
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
        innerIcon?: IconName
    },
    Widget_string_types
>

// SERIAL
export type Widget_string_serial = FieldSerial<{ type: 'str'; val?: string }>

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
    $Field: Widget_string
}

// STATE
export class Widget_string extends BaseField<Widget_string_types> {
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

    UITextarea = () => <WidgetString_TextareaBodyUI widget={this} />
    UIInputText = () => <WidgetString_HeaderUI widget={this} />
    // readonly border = false
    readonly id: string

    readonly type: 'str' = 'str'

    // --------------
    temporaryValue: string | null = null
    setTemporaryValue = (next: string | null) => (this.temporaryValue = next)
    // --------------

    serial: Widget_string_serial
    get defaultValue(): string {
        return this.config.default ?? ''
    }
    get hasChanges(): boolean { return this.serial.val !== this.defaultValue } // prettier-ignore

    reset(): void {
        this.value = this.defaultValue
    }

    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_string>,
        serial?: Widget_string_serial,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? {
            type: 'str',
            val: config.default,
            collapsed: config.startCollapsed,
            id: this.id,
        }
        this.init()
    }
    get animateResize() {
        if (this.config.textarea) return false
        return true
    }

    get value(): Widget_string_value {
        return this.serial.val ?? this.config.default ?? ''
    }

    set value(next: Widget_string_value) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('str', Widget_string)
