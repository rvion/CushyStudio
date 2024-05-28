import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSeedUI } from './WidgetSeedUI'

// CONFIG
export type Widget_seed_config = WidgetConfigFields<
    {
        default?: number
        defaultMode?: 'randomize' | 'fixed' | 'last'
        min?: number
        max?: number
    },
    Widget_seed_types
>

// SERIAL
export type Widget_seed_serial = WidgetSerialFields<{
    type: 'seed'
    val: number
    mode: 'randomize' | 'fixed' | 'last'
}>

// SERIAL FROM VALUE
export const Widget_seed_fromValue = (value: Widget_seed_value): Widget_seed_serial => ({
    type: 'seed',
    mode: 'fixed',
    val: value,
})

// VALUE
export type Widget_seed_value = number

// TYPES
export type Widget_seed_types = {
    $Type: 'seed'
    $Config: Widget_seed_config
    $Serial: Widget_seed_serial
    $Value: Widget_seed_value
    $Widget: Widget_seed
}

// STATE
export interface Widget_seed extends Widget_seed_types {}
export class Widget_seed extends BaseWidget implements IWidget<Widget_seed_types> {
    DefaultHeaderUI = WidgetSeedUI
    DefaultBodyUI = undefined
    readonly id: string
    get baseErrors(): Problem_Ext {
        return null
    }

    readonly defaultValue: number = this.config.default ?? 0
    get hasChanges() { return this.value !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.defaultValue)

    readonly type: 'seed' = 'seed'
    readonly serial: Widget_seed_serial

    setToFixed = (val?: number) => {
        this.serial.mode = 'fixed'
        if (val) this.serial.val = val
        this.bumpValue()
    }

    setToRandomize = () => {
        if (this.serial.mode === 'randomize') return
        this.serial.mode = 'randomize'
        this.bumpValue()
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_seed>,
        serial?: Widget_seed_serial,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? {
            type: 'seed',
            id: this.id,
            val: config.default ?? 0,
            mode: config.defaultMode ?? 'randomize',
        }
        makeAutoObservableInheritance(this, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    setValue = (val: number) => {
        this.serial.val = val
        this.bumpValue()
    }

    set value(val: number) {
        this.serial.val = val
        this.bumpValue()
    }

    get value(): Widget_seed_value {
        const count = this.form.builder._cache.count
        return this.serial.mode === 'randomize' ? Math.floor(Math.random() * 9_999_999) : this.serial.val
    }
}

registerWidgetClass('seed', Widget_seed)
