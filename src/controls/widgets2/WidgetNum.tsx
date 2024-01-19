import { computed, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { ComfySchemaL } from 'src/models/Schema'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { FormBuilder } from '../FormBuilder'
import { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../IWidget'

// CONFIG
export type Widget_int_config<T extends { optional: boolean }> = WidgetConfigFields<{
    mode: 'int' | 'float'
    optional: T['optional']
    default?: number
    min?: number
    max?: number
    step?: number
    hideSlider?: boolean
}>

// SERIAL
export type Widget_int_serial = WidgetSerialFields<{ type: 'int'; val: number }>

// OUT
export type Widget_int_output<T extends { optional: boolean }> = T['optional'] extends true //
    ? Maybe<number>
    : number

// TYPES
export type Widget_int_types<T extends { optional: boolean }> = {
    $Type: 'int'
    $Input: Widget_int_config<T>
    $Serial: Widget_int_serial
    $Output: Widget_int_output<T>
}

// STATE
export interface Widget_int<T extends { optional: boolean }> extends WidgetTypeHelpers<Widget_int_types<T>> {}
export class Widget_int<T extends { optional: boolean }> implements IWidget<Widget_int_types<T>> {
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    get isOptional() { return this.config.optional ?? false } // prettier-ignore
    readonly id: string
    readonly type: 'int' = 'int'

    serial: Widget_int_serial

    constructor(
        public readonly builder: FormBuilder,
        public readonly schema: ComfySchemaL,
        public readonly config: Widget_int_config<T>,
        serial?: Widget_int_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'int',
            collapsed: config.startCollapsed,
            id: this.id,
            active: config.optional //
                ? config.startActive ?? false
                : true,
            val: config.default ?? 0,
        }

        makeObservable(this, {
            serial: observable,
            result: computed,
        })
    }

    get result(): Widget_int_output<T> {
        if (this.serial.active === false) {
            if (this.isOptional) return undefined as any
            return this.serial.val
        }
        return this.serial.val
    }
}

export type NumbericTheme = 'input' | 'slider'

// UI
export const WidgetNumUI = observer(function WidgetNumUI_(p: { widget: Widget_int<any> }) {
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
