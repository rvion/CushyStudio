import type { Form } from '../../Form'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
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
export interface Widget_seed extends Widget_seed_types, IWidgetMixins {}
export class Widget_seed implements IWidget<Widget_seed_types> {
    DefaultHeaderUI = WidgetSeedUI
    DefaultBodyUI = undefined
    readonly id: string
    readonly type: 'seed' = 'seed'
    readonly serial: Widget_seed_serial

    setToFixed = (val?: number) => {
        if (this.serial.mode === 'fixed') return
        this.serial.mode = 'fixed'
        if (val) this.serial.val = val
        this.bumpValue()
    }

    setToRandomize = () => {
        if (this.serial.mode === 'randomize') return
        this.serial.mode = 'randomize'
        this.bumpValue()
    }

    setValue = (val: number) => {
        this.serial.val = val
        this.bumpValue()
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public config: Widget_seed_config,
        serial?: Widget_seed_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'seed',
            id: this.id,
            val: config.default ?? 0,
            mode: config.defaultMode ?? 'randomize',
        }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    get value(): Widget_seed_value {
        const count = this.form.builder._cache.count
        return this.serial.mode === 'randomize' ? Math.floor(Math.random() * 9_999_999) : this.serial.val
    }
}

registerWidgetClass('seed', Widget_seed)
