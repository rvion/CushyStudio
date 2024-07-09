import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetString_HeaderUI, WidgetString_TextareaBodyUI, WidgetString_TextareaHeaderUI } from './WidgetStringUI'

type CssProprtyGlobals = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset'

type CssProprtyResize = CssProprtyGlobals | 'block' | 'both' | 'horizontal' | 'inline' | 'none' | 'vertical'

// prettier-ignore
export type FieldStringInputType =
    | 'text'
    | 'password'
    | 'email'
    | 'tel'
    | 'url'
    | 'time'
    | 'date'
    | 'datetime-local'
    | 'color'

// CONFIG
export type Field_string_config = FieldConfig<
    {
        default?: string
        textarea?: boolean
        placeHolder?: string
        pattern?: string
        inputType?: FieldStringInputType
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
    value?: string
}>

// {type:"str",val:"coucou",id:"dsafasdfsdafas"}
// {T:"str",val:"coucou",id:"dsafasdfsdafas"}
// ["str","dsafasdfsdafas","coucou"],
// SERIAL FROM VALUE
export const Field_string_fromValue = (val: string): Field_string_serial => ({
    type: 'str',
    value: val,
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

    get ownProblems(): Problem_Ext {
        return null
    }

    temporaryValue: string | null = null

    setTemporaryValue = (next: string | null) => {
        this.temporaryValue = next
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_string>,
        serial?: Field_string_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial)
    }

    get animateResize() {
        if (this.config.textarea) return false
        return true
    }

    protected setOwnSerial(serial: Maybe<Field_string_serial>) {
        this.serial.value = serial?.value ?? (serial as any)?.val ?? this.defaultValue
    }

    get defaultValue(): string {
        return this.config.default ?? ''
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }

    get value(): Field_string_value {
        return this.serial.value ?? this.config.default ?? ''
    }

    set value(next: Field_string_value) {
        const nextStrVal = typeof next === 'string' ? next : JSON.stringify(next)
        if (this.serial.value === nextStrVal) return
        this.MUTVALUE(() => (this.serial.value = nextStrVal))
    }
}

// DI
registerWidgetClass('str', Field_string)
