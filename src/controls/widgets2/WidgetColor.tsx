import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { ComfySchemaL } from 'src/models/Schema'
import { FormBuilder } from '../FormBuilder'
import { IWidget_OLD, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers_OLD } from '../IWidget'

// 🅿️ color ==============================================================================
export type Widget_color_config = WidgetConfigFields<{ default?: string }>
export type Widget_color_serial = WidgetSerialFields<{ type: 'color'; active: true; val: string }>
export type Widget_color_output = string
export interface Widget_color
    extends WidgetTypeHelpers_OLD<'color', Widget_color_config, Widget_color_serial, any, Widget_color_output> {}
export class Widget_color implements IWidget_OLD<'color', Widget_color_config, Widget_color_serial, any, Widget_color_output> {
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly isOptional = false
    readonly id: string
    readonly type: 'color' = 'color'

    serial: Widget_color_serial

    constructor(
        public readonly builder: FormBuilder,
        public readonly schema: ComfySchemaL,
        public readonly config: Widget_color_config,
        serial?: Widget_color_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'color',
            collapsed: config.startCollapsed,
            id: this.id,
            active: true,
            val: config.default ?? '',
        }
        makeAutoObservable(this)
    }

    get result(): Widget_color_output {
        return this.serial.val
    }
}

export const WidgetColorUI = observer(function WidgetColorUI_(p: { widget: Widget_color }) {
    const widget = p.widget
    return (
        <div>
            <input //
                value={widget.serial.val}
                type='color'
                onChange={(ev) => (widget.serial.val = ev.target.value)}
            />
        </div>
    )
})
