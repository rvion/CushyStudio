import { computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { ComfySchemaL } from 'src/models/Schema'
import { FormBuilder } from '../../FormBuilder'
import { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'
import { WidgetDI } from '../WidgetUI.DI'
import { hash } from 'ohash'

// CONFIG
export type Widget_number_config = WidgetConfigFields<{
    mode: 'int' | 'float'
    default?: number
    min?: number
    max?: number
    step?: number
    hideSlider?: boolean
    forceSnap?: boolean
}>

// SERIAL
export type Widget_number_serial = WidgetSerialFields<{ type: 'number'; val: number; forceSnap: boolean }>

// OUT
export type Widget_number_output = number

// TYPES
export type Widget_number_types = {
    $Type: 'number'
    $Input: Widget_number_config
    $Serial: Widget_number_serial
    $Output: Widget_number_output
}

// STATE
export interface Widget_number extends WidgetTypeHelpers<Widget_number_types> {}
export class Widget_number implements IWidget<Widget_number_types> {
    get serialHash () { return hash(this.result) } // prettier-ignore
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'number' = 'number'
    readonly forceSnap: boolean = false

    serial: Widget_number_serial

    constructor(public readonly form: FormBuilder, public readonly config: Widget_number_config, serial?: Widget_number_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'number',
            collapsed: config.startCollapsed,
            id: this.id,
            val: config.default ?? 0,
            forceSnap: config.forceSnap ?? false,
        }

        makeObservable(this, {
            serial: observable,
            result: computed,
        })
    }

    get result(): Widget_number_output {
        return this.serial.val
    }
}

// DI
WidgetDI.Widget_number = Widget_number
