import { computed, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { ComfySchemaL } from 'src/models/Schema'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { FormBuilder } from '../FormBuilder'
import { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../IWidget'
import { WidgetDI } from '../widgets/WidgetUI.DI'

// CONFIG
export type Widget_number_config = WidgetConfigFields<{
    mode: 'int' | 'float'
    default?: number
    min?: number
    max?: number
    step?: number
    hideSlider?: boolean
}>

// SERIAL
export type Widget_number_serial = WidgetSerialFields<{ type: 'number'; val: number }>

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
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'number' = 'number'

    serial: Widget_number_serial

    constructor(
        public readonly builder: FormBuilder,
        public readonly schema: ComfySchemaL,
        public readonly config: Widget_number_config,
        serial?: Widget_number_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'number',
            collapsed: config.startCollapsed,
            id: this.id,
            val: config.default ?? 0,
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

// UI
export const WidgetNumUI = observer(function WidgetNumUI_(p: { widget: Widget_number }) {
    const widget = p.widget
    const value = widget.serial.val
    const mode = widget.config.mode
    const step = widget.config.step ?? (mode === 'int' ? 1 : 0.1)

    return (
        <InputNumberUI
            //
            mode={mode}
            value={value}
            hideSlider={widget.config.hideSlider}
            max={widget.config.max}
            min={widget.config.min}
            step={step}
            onValueChange={(next) => (widget.serial.val = next)}
        />
    )
})
