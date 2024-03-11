import type { Form } from '../../Form'
import type { FC } from 'react'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'
import type { Spec } from 'src/controls/Spec'

import { action, computed, makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetCustom_HeaderUI } from './WidgetCustomUI'
import { applyWidgetMixinV2 } from 'src/controls/Mixins'

export type CustomWidgetProps<T> = { widget: Widget_custom<T>; extra: import('./WidgetCustomUI').UIKit }

// CONFIG
export type Widget_custom_config<T> = WidgetConfigFields<
    {
        defaultValue: () => T
        subTree?: () => Spec
        Component: FC<CustomWidgetProps<T>>
    },
    Widget_custom_types<T>
>

// SERIAL
export type Widget_custom_serial<T> = WidgetSerialFields<{ type: 'custom'; active: true; value: T }>

// OUT
export type Widget_custom_output<T> = T

// TYPES
export type Widget_custom_types<T> = {
    $Type: 'custom'
    $Input: Widget_custom_config<T>
    $Serial: Widget_custom_serial<T>
    $Output: Widget_custom_output<T>
    $Widget: Widget_custom<T>
}

// STATE
export interface Widget_custom<T> extends Widget_custom_types<T>, IWidgetMixins {}
export class Widget_custom<T> implements IWidget<Widget_custom_types<T>> {
    DefaultHeaderUI = WidgetCustom_HeaderUI
    DefaultBodyUI = undefined
    readonly id: string
    readonly type: 'custom' = 'custom'

    get serialHash(): string {
        return hash(this.value)
    }
    serial: Widget_custom_serial<T>
    Component: Widget_custom_config<T>['Component']
    st = () => cushy
    reset = () => (this.serial.value = this.config.defaultValue())
    constructor(
        //
        public form: Form<any>,
        public config: Widget_custom_config<T>,
        serial?: Widget_custom_serial<T>,
    ) {
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
    get value(): Widget_custom_output<T> {
        return this.serial.value
    }
}

WidgetDI.Widget_custom = Widget_custom
