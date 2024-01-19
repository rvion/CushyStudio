import type { ComfySchemaL } from 'src/models/Schema'
import type { FormBuilder } from '../FormBuilder'
import type { IWidget2, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers2 } from '../IWidget'

import { computed, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'

// CONFIG
export type Widget_bool_config = WidgetConfigFields<{ default?: boolean }>

// SERIAL
export type Widget_bool_serial = WidgetSerialFields<{ type: 'bool' }>

// OUT
export type Widget_bool_output = boolean

// TYPES
export type Widget_str_types = {
    $Type: 'bool'
    $Input: Widget_bool_config
    $Serial: Widget_bool_serial
    $Output: Widget_bool_output
}

export interface Widget_bool extends WidgetTypeHelpers2<Widget_str_types> {}
export class Widget_bool implements IWidget2<Widget_str_types> {
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly isOptional = true
    readonly id: string
    readonly type: 'bool' = 'bool'

    serial: Widget_bool_serial

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
            active: config.default ?? config.startActive,
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

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { widget: Widget_bool }) {
    return null // fieldWithUI toogle should handle that alreadly
})
