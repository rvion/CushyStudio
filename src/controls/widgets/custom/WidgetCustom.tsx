import type { FC } from 'react'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'
import { WidgetDI } from '../WidgetUI.DI'

export type CustomWidgetProps<T> = { widget: Widget_custom<T>; extra: import('./WidgetCustomUI').UIKit }

// CONFIG
export type Widget_custom_config<T> = WidgetConfigFields<{ defaultValue: () => T; Component: FC<CustomWidgetProps<T>> }>

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
}

// STATE
export interface Widget_custom<T> extends WidgetTypeHelpers<Widget_custom_types<T>> {}
export class Widget_custom<T> implements IWidget<Widget_custom_types<T>> {
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'custom' = 'custom'

    get serialHash() {
        return hash(this.value)
    }
    serial: Widget_custom_serial<T>
    Component: Widget_custom_config<T>['Component']
    st = () => cushy
    reset = () => (this.serial.value = this.config.defaultValue())
    constructor(
        //
        public form: FormBuilder,
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

        makeAutoObservable(this, { Component: false })
    }

    /** never mutate this field manually, only access to .state */
    get value(): Widget_custom_output<T> {
        return this.serial.value
    }
}

WidgetDI.Widget_custom = Widget_custom
