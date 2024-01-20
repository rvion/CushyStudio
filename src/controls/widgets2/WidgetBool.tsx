import type { ComfySchemaL } from 'src/models/Schema'
import type { FormBuilder } from '../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../IWidget'

import { computed, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../widgets/WidgetUI.DI'

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

    setOn = () => (this.serial.active = true)
    setOff = () => (this.serial.active = false)
    toggle = () => (this.serial.active = !this.serial.active)

    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_bool_config,
        serial?: Widget_bool_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            id: this.id,
            type: 'bool',
            active: config.default ?? false,
            collapsed: config.startCollapsed,
        }

        makeObservable(this, {
            serial: observable,
            result: computed,
        })
    }

    get result(): Widget_bool_output {
        return this.serial.active ?? false
    }
}

// DI
WidgetDI.Widget_bool = Widget_bool

// UI
export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { widget: Widget_bool }) {
    return null // fieldWithUI toogle should handle that alreadly
})
