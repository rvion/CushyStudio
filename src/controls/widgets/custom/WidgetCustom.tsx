import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { Problem_Ext } from '../../Validation'
import type { WidgetConfigFields } from '../../WidgetConfig'
import type { WidgetSerial } from '../../WidgetSerialFields'
import type { FC } from 'react'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
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
export type Widget_custom_serial<T> = WidgetSerial<{ type: 'custom'; active: true; value: T }>

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
export class Widget_custom<T> extends BaseWidget<Widget_custom_types<T>> {
    DefaultHeaderUI = WidgetCustom_HeaderUI
    DefaultBodyUI = undefined
    readonly id: string

    readonly type: 'custom' = 'custom'

    get baseErrors(): Problem_Ext {
        return null
    }

    serial: Widget_custom_serial<T>
    Component: Widget_custom_config<T>['Component']
    st = () => cushy

    get defaultValue(): T { return this.config.defaultValue() } // prettier-ignore
    get hasChanges() { return this.value !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.config.defaultValue())

    constructor(
        //
        public readonly form: Form,
        public readonly parent: BaseWidget | null,
        public readonly spec: ISpec<Widget_custom<T>>,
        serial?: Widget_custom_serial<T>,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.Component = config.Component
        this.serial = serial ?? {
            type: 'custom',
            active: true,
            id: this.id,
            value: this.config.defaultValue(),
        }

        this.init({
            Component: false,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
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
