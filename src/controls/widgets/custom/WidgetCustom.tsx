import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'
import type { FC } from 'react'

import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetCustom_HeaderUI } from './WidgetCustomUI'

export type CustomWidgetProps<T> = { widget: Widget_custom<T>; extra: import('./WidgetCustomUI').UIKit }

// CONFIG
export type Widget_custom_config<T> = WidgetConfigFields<
    {
        defaultValue: () => T
        subTree?: () => ISpec
        Component: FC<CustomWidgetProps<T>>
    },
    Widget_custom_types<T>
>

// SERIAL
export type Widget_custom_serial<T> = WidgetSerialFields<{ type: 'custom'; active: true; value: T }>

// VALUE
export type Widget_custom_value<T> = T

// TYPES
export type Widget_custom_types<T> = {
    $Type: 'custom'
    $Config: Widget_custom_config<T>
    $Serial: Widget_custom_serial<T>
    $Value: Widget_custom_value<T>
    $Widget: Widget_custom<T>
}

// STATE
export interface Widget_custom<T> extends Widget_custom_types<T>, IWidgetMixins {}
export class Widget_custom<T> implements IWidget<Widget_custom_types<T>> {
    DefaultHeaderUI = WidgetCustom_HeaderUI
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'custom' = 'custom'

    get baseErrors(): Problem_Ext {
        return null
    }

    serial: Widget_custom_serial<T>
    Component: Widget_custom_config<T>['Component']
    st = () => cushy
    reset = () => (this.value = this.config.defaultValue())
    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_custom<T>>,
        serial?: Widget_custom_serial<T>,
    ) {
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.Component = config.Component
        this.serial = serial ?? {
            type: 'custom',
            active: true,
            id: this.id,
            value: this.config.defaultValue(),
        }

        applyWidgetMixinV2(this)
        makeAutoObservable(this, { Component: false })
    }

    /** never mutate this field manually, only access to .state */
    get value(): Widget_custom_value<T> {
        return this.serial.value
    }
    setValue(val: Widget_custom_value<T>) {
        this.value = val
    }
    set value(next: Widget_custom_value<T>) {
        if (this.serial.value === next) return
        runInAction(() => {
            this.serial.value = next
            this.bumpValue()
        })
    }
}

registerWidgetClass('custom', Widget_custom)
