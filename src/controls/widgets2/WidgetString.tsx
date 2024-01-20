// 🟢 2024-01-19: convert to V2

import type { ComfySchemaL } from 'src/models/Schema'
import type { FormBuilder } from '../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../IWidget'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../widgets/WidgetUI.DI'

// CONFIG
export type Widget_str_config<T extends { optional: boolean }> = WidgetConfigFields<{
    default?: string
    optional: boolean // T['optional'] (🔶 COMMENTED TO SPEED UP TYPESCRIPT)
    textarea?: boolean
    placeHolder?: string
}>

// SERIAL
export type Widget_str_serial = WidgetSerialFields<{
    type: 'str'
    active: true
    val: string
}>

// OUT
export type Widget_str_output<T extends { optional: boolean }> = T['optional'] extends true //
    ? Maybe<string>
    : string

// TYPES
export type Widget_str_types<T extends { optional: boolean }> = {
    $Type: 'str'
    $Input: Widget_str_config<T>
    $Serial: Widget_str_serial
    $Output: Widget_str_output<T>
}

// STATE
export interface Widget_str<T extends { optional: boolean }> extends WidgetTypeHelpers<Widget_str_types<T>> {}
export class Widget_str<T extends { optional: boolean }> implements IWidget<Widget_str_types<T>> {
    get isVerticalByDefault(): boolean {
        if (this.config.textarea) return true
        return false
    }

    get isCollapsible() { return this.config.textarea ?? false } // prettier-ignore
    get isOptional() { return this.config.optional ?? false } // prettier-ignore

    readonly id: string
    readonly type: 'str' = 'str'

    serial: Widget_str_serial

    constructor(
        public readonly builder: FormBuilder,
        public readonly schema: ComfySchemaL,
        public readonly config: Widget_str_config<T>,
        serial?: Widget_str_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'str',
            collapsed: config.startCollapsed,
            active: true,
            val: config.default ?? '',
            id: this.id,
        }
        makeAutoObservable(this)
    }

    get result(): Widget_str_output<T> {
        if (!this.serial.active) return undefined as any
        return this.serial.val
    }
}

// DI
WidgetDI.Widget_str = Widget_str

// UI
export const WidgetStrUI = observer(function WidgetStrUI_(p: { widget: Widget_str<any> }) {
    const widget = p.widget
    const val = widget.serial.val
    if (widget.config.textarea) {
        return (
            <textarea
                tw='textarea textarea-bordered textarea-sm w-full'
                placeholder={widget.config.placeHolder}
                rows={2}
                value={val}
                onChange={(ev) => {
                    const next = ev.target.value
                    widget.serial.val = next
                }}
            />
        )
    }
    return (
        <input
            tw='input input-bordered input-sm w-full'
            placeholder={widget.config.placeHolder}
            value={val}
            onChange={(ev) => {
                const next = ev.target.value
                widget.serial.val = next
            }}
        />
    )
})
