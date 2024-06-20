import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { IBlueprint } from '../../model/IBlueprint'
import type { Model } from '../../model/Model'
import type { Problem_Ext } from '../../model/Validation'

import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSeedUI } from './WidgetSeedUI'

type SeedMode = 'randomize' | 'fixed' | 'last'
// CONFIG
export type Widget_seed_config = FieldConfig<
    {
        default?: number
        defaultMode?: SeedMode
        min?: number
        max?: number
    },
    Widget_seed_types
>

// SERIAL
export type Widget_seed_serial = FieldSerial<{
    type: 'seed'
    val: number
    mode: SeedMode
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
    $Field: Widget_seed
}

// STATE
export class Widget_seed extends BaseField<Widget_seed_types> {
    DefaultHeaderUI = WidgetSeedUI
    DefaultBodyUI = undefined

    readonly id: string

    get baseErrors(): Problem_Ext {
        return null
    }

    get hasChanges() {
        if (this.serial.mode !== this.defaultMode) return true
        if (this.serial.mode === 'fixed') return this.value !== this.defaultValue
        return false
    }
    reset = () => {
        this.setMode(this.defaultMode)
        if (this.serial.mode !== 'randomize') this.setValue(this.defaultValue)
    }

    get defaultMode(): SeedMode {
        return this.config.defaultMode ?? 'randomize'
    }

    get defaultValue(): number {
        return this.config.default ?? 0
    }

    readonly type: 'seed' = 'seed'
    readonly serial: Widget_seed_serial

    setMode = (mode: SeedMode) => {
        if (this.serial.mode === mode) return
        this.serial.mode = mode
        this.bumpValue()
    }

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
        public readonly form: Model,
        public readonly parent: BaseField | null,
        public readonly spec: IBlueprint<Widget_seed>,
        serial?: Widget_seed_serial,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? {
            type: 'seed',
            id: this.id,
            val: this.defaultValue,
            mode: this.defaultMode,
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
