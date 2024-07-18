import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { CovariantFC } from '../../variance/CovariantFC'
import type { FC } from 'react'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
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
        /**
         * used:
         *  - when checking if field has changes
         *  - when resetting (.reset())
         *  - when value is undefined
         *
         * note:
         *  | if you enable field diff / change tracking,
         *  | default will ALWAYS be evaluated, so you need to be
         *  | careful with functions that have side effects
         */
        default?: string | (() => string)
        textarea?: boolean
        placeHolder?: string
        inputType?: FieldStringInputType
        resize?: CssProprtyResize
        /**
         * if set to true, widget will commit values on enter; not before.
         * hitting esc will revert to the last committed value
         * */
        buffered?: boolean
        innerIcon?: IconName

        // validation
        pattern?: string
        minLength?: number
        maxLength?: number
    },
    Field_string_types
>

// SERIAL
export type Field_string_serial = FieldSerial<{
    $: 'str'
    value?: string
}>

// {type:"str",val:"coucou",id:"dsafasdfsdafas"}
// {T:"str",val:"coucou",id:"dsafasdfsdafas"}
// ["str","dsafasdfsdafas","coucou"],
// SERIAL FROM VALUE
export const Field_string_fromValue = (val: string): Field_string_serial => ({
    $: 'str',
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
    UITextarea: FC = () => <WidgetString_TextareaBodyUI field={this} />
    UIInputText: FC = () => <WidgetString_HeaderUI field={this} />

    get DefaultHeaderUI(): FC<{ field: Field_string }> {
        if (this.config.textarea) {
            if (this.isCollapsed) return WidgetString_TextareaHeaderUI
            return WidgetString_TextareaBodyUI
        } else {
            return WidgetString_HeaderUI
        }
    }

    get isCollapsible(): boolean {
        if (this.config.textarea) return true
        return false
    }

    DefaultBodyUI = undefined

    get ownProblems(): Problem_Ext {
        const min = this.config.minLength
        if (min != null && this.value.length < min) return `Value is too short (must be at least ${min} chars)`
        const max = this.config.maxLength
        if (max != null && this.value.length > max) return `Value is too long (must be at most ${max} chars)`
        //
        const pattern = this.config.pattern
        if (pattern != null) {
            const reg = new RegExp(pattern).test(this.value)
            if (!reg) return `Value does not match pattern`
        }
        return null
    }

    temporaryValue: string | null = null

    setTemporaryValue(next: string | null): void {
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

    get animateResize(): boolean {
        if (this.config.textarea) return false
        return true
    }

    protected setOwnSerial(serial: Maybe<Field_string_serial>): void {
        this.serial.value = serial?.value ?? (serial as any)?.val ?? this.defaultValue
    }

    private evalDefaultValue(): string {
        const d = this.config.default
        if (d == null) return ''
        if (typeof d === 'function') return d()
        if (typeof d === 'string') return d
        return JSON.stringify(d) // failsafe
    }

    get defaultValue(): string {
        return this.evalDefaultValue() ?? ''
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }

    get value(): Field_string_value {
        return this.serial.value ?? this.defaultValue
    }

    set value(next: Field_string_value) {
        const nextStrVal = typeof next === 'string' ? next : JSON.stringify(next)
        if (this.serial.value === nextStrVal) return
        this.runInValueTransaction(() => (this.serial.value = nextStrVal))
    }
}

// DI
registerFieldClass('str', Field_string)
