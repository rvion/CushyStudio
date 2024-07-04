import type { IconName } from '../../icons/icons'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetString_HeaderUI, WidgetString_TextareaBodyUI, WidgetString_TextareaHeaderUI } from './WidgetStringUI'

type CssProprtyGlobals = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset'
type CssProprtyResize = CssProprtyGlobals | 'block' | 'both' | 'horizontal' | 'inline' | 'none' | 'vertical'

// CONFIG
export type Field_string_config = FieldConfig<
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
    Field_string_types
>

// SERIAL
export type Field_string_serial = FieldSerial<{
    type: 'str'
    val?: string
}>

// {type:"str",val:"coucou",id:"dsafasdfsdafas"}
// {T:"str",val:"coucou",id:"dsafasdfsdafas"}
// ["str","dsafasdfsdafas","coucou"],
// SERIAL FROM VALUE
export const Field_string_fromValue = (val: string): Field_string_serial => ({
    type: 'str',
    val,
})

// VALUE
export type Field_string_value = string

// TYPES
export type Field_string_types = {
    $Type: 'str'
    $Config: Field_string_config
    $Serial: Field_string_serial
    $Value: Field_string_value
    $Field: Field_string
}

// STATE
export class Field_string extends Field<Field_string_types> {
    static readonly type: 'str' = 'str'
    UITextarea = () => <WidgetString_TextareaBodyUI field={this} />
    UIInputText = () => <WidgetString_HeaderUI field={this} />

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

    // --------------
    temporaryValue: string | null = null

    setTemporaryValue = (next: string | null) => {
        this.temporaryValue = next
    }
    // --------------

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_string>,
        serial?: Field_string_serial,
    ) {
        super(repo, root, parent, schema)
        this.initSerial(serial)
        this.init()
    }

    get animateResize() {
        if (this.config.textarea) return false
        return true
    }

    protected setOwnSerial(serial: Maybe<Field_string_serial>) {
        if (serial == null) return void delete this.serial.val
        if (serial.val != null) this.serial.val = serial.val
    }

    reset(): void {
        this.value = this.defaultValue
    }

    get defaultValue(): string {
        return this.config.default ?? ''
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }

    get value(): Field_string_value {
        return this.serial.val ?? this.config.default ?? ''
    }

    set value(next: Field_string_value) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('str', Field_string)
