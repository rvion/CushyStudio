import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'
import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_bool_config = WidgetConfigFields<{ default?: boolean }>

// SERIAL
export type Widget_bool_serial = WidgetSerialFields<{ type: 'bool'; active: boolean }>

// OUT
export type Widget_bool_output = boolean

// TYPES
export type Widget_string_types = {
    $Type: 'bool'
    $Input: Widget_bool_config
    $Serial: Widget_bool_serial
    $Output: Widget_bool_output
}

// STATE
export interface Widget_bool extends WidgetTypeHelpers<Widget_string_types> {}
export class Widget_bool implements IWidget<Widget_string_types> {
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'bool' = 'bool'

    serial: Widget_bool_serial
    get serialHash () { return hash(this.value) } // prettier-ignore
    setOn = () => (this.serial.active = true)
    setOff = () => (this.serial.active = false)
    toggle = () => (this.serial.active = !this.serial.active)

    constructor(public form: FormBuilder, public config: Widget_bool_config, serial?: Widget_bool_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            id: this.id,
            type: 'bool',
            active: config.default ?? false,
            collapsed: config.startCollapsed,
        }

        makeObservable(this, {
            serial: observable,
            value: computed,
        })
    }

    get value(): Widget_bool_output {
        return this.serial.active ?? false
    }
    set value(next: Widget_bool_output) {
        this.serial.active = next
    }
}

// DI
WidgetDI.Widget_bool = Widget_bool
