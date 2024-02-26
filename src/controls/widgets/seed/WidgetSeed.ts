import type { Form } from 'src/controls/Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetSeedUI } from './WidgetSeedUI'

// CONFIG
export type Widget_seed_config = WidgetConfigFields<{
    default?: number
    defaultMode?: 'randomize' | 'fixed' | 'last'
    min?: number
    max?: number
}>

// SERIAL
export type Widget_seed_serial = WidgetSerialFields<{
    type: 'seed'
    active: true
    val: number
    mode: 'randomize' | 'fixed' | 'last'
}>

// OUT
export type Widget_seed_output = number

// TYPES
export type Widget_seed_types = {
    $Type: 'seed'
    $Input: Widget_seed_config
    $Serial: Widget_seed_serial
    $Output: Widget_seed_output
    $Widget: Widget_seed
}

// STATE
export interface Widget_seed extends Widget_seed_types {}
export class Widget_seed implements IWidget<Widget_seed_types> {
    HeaderUI = WidgetSeedUI
    BodyUI = undefined
    readonly id: string
    readonly type: 'seed' = 'seed'
    readonly serial: Widget_seed_serial
    get serialHash() {
        if (this.serial.mode === 'randomize') return hash(this.serial.mode)
        return hash(this.value)
    }
    constructor(public form: Form<any>, public config: Widget_seed_config, serial?: Widget_seed_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'seed',
            id: this.id,
            active: true,
            val: config.default ?? 0,
            mode: config.defaultMode ?? 'randomize',
        }
        makeAutoObservable(this)
    }
    get value(): Widget_seed_output {
        const count = this.form.builder._cache.count
        return this.serial.mode === 'randomize' ? Math.floor(Math.random() * 9_999_999) : this.serial.val
    }
}

WidgetDI.Widget_seed = Widget_seed
