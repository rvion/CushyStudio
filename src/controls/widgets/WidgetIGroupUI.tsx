import type { Widget } from 'src/controls/Widget'
import type { ComfySchemaL } from 'src/models/Schema'
import type { FormBuilder } from '../FormBuilder'
import type { GetWidgetResult, IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../IWidget'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { runWithGlobalForm } from 'src/models/_ctx2'
import { WidgetWithLabelUI } from '../shared/WidgetWithLabelUI'
import { bang } from 'src/utils/misc/bang'

// CONFIG
export type Widget_group_config<T extends { [key: string]: Widget }> = WidgetConfigFields<{
    // default?: boolean
    items: () => T
    topLevel?: boolean
    verticalLabels?: boolean
}>

// SERIAL
export type Widget_group_serial<T extends { [key: string]: Widget }> = WidgetSerialFields<{
    type: 'group'
    active: boolean
    values_: { [K in keyof T]?: T[K]['$Serial'] }
}>

// OUT
export type Widget_group_output<T extends { [key: string]: Widget }> = {
    [k in keyof T]: GetWidgetResult<T[k]>
}

// TYPES
export type Widget_group_types<T extends { [key: string]: Widget }> = {
    $Type: 'group'
    $Input: Widget_group_config<T>
    $Serial: Widget_group_serial<T>
    $Output: Widget_group_output<T>
}

// STATE
export interface Widget_group<T extends { [key: string]: Widget }> extends WidgetTypeHelpers<Widget_group_types<T>> {}

export class Widget_group<T extends { [key: string]: Widget }> implements IWidget<Widget_group_types<T>> {
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'group' = 'group'

    collapseAllEntries = () => {
        for (const [key, item] of this.entries) {
            if (item.isCollapsible && item.serial.active) item.serial.collapsed = true
        }
    }
    expandAllEntries = () => {
        for (const [key, item] of this.entries) item.serial.collapsed = undefined
    }

    /** all [key,value] pairs */
    get entries() {
        return Object.entries(this.values) as [string, any][]
    }

    /** the dict of all child widgets */
    values: { [k in keyof T]: T[k] } = {} as any // will be filled during constructor
    serial: Widget_group_serial<T>

    enableGroup() {
        this.serial.active = true
        const prevValues_: { [K in keyof T]?: T[K]['$Serial'] } = this.serial.values_ ?? {}
        const _newValues: { [key: string]: Widget } = runWithGlobalForm(this.builder, () => this.config.items())

        const childKeys = Object.keys(_newValues) as (keyof T & string)[]
        for (const key of childKeys) {
            const newItem = _newValues[key]
            const prevValue_ = prevValues_[key]
            const newInput = newItem.config
            const newType = newItem.type
            if (prevValue_ && newType === prevValue_.type) {
                this.values[key] = this.builder._HYDRATE(newType, newInput, prevValue_)
            } else {
                this.values[key] = newItem as any
                this.serial.values_[key] = newItem.serial as any
            }
        }
    }

    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_group_config<T>,
        serial?: Widget_group_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'group',
            id: this.id,
            active: true,
            collapsed: config.startCollapsed ?? false,
            values_: {} as any,
        }
        this.enableGroup()
        makeAutoObservable(this)
    }

    get result(): { [k in keyof T]: GetWidgetResult<T[k]> } {
        const out: { [key: string]: any } = {}
        for (const key in this.values) {
            const subWidget: Widget = bang(this.values[key]) as Widget
            out[key] = subWidget.result
        }
        return out as any
    }
}

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: {
    //
    widget: Widget_group<{ [key: string]: Widget }>
}) {
    const widget = p.widget
    const isTopLevel = widget.config.topLevel
    const groupFields = Object.entries(widget.values)
    const isHorizontal = widget.config.layout === 'H'
    return (
        <div
            tw={['flex rounded-box bg-opacity-95 items-start w-full text-base-content']}
            style={{
                position: 'relative',
            }}
        >
            {/* 🟢
            {widget.serial.collapsed ? 'Coolapsed' : undefined}
            {groupFields.length}
            {groupFields.map(([rootKey, sub], ix) => (
                <div key={rootKey}>{rootKey}</div>
            ))} */}
            {widget.serial.collapsed ? null : (
                <div
                    // style={isTopLevel ? undefined : { border: '1px solid #262626' }}
                    tw={[
                        //
                        '_WidgetGroupUI w-full',
                        isHorizontal //
                            ? `flex flex-wrap gap-2`
                            : `flex flex-col gap-1`,
                    ]}
                    className={widget.config.className}
                >
                    {groupFields.map(([rootKey, sub], ix) => (
                        <WidgetWithLabelUI //
                            isTopLevel={isTopLevel}
                            vertical={widget.serial.vertical}
                            key={rootKey}
                            // labelPos={sub.input.labelPos}
                            rootKey={rootKey}
                            widget={bang(sub)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})

// tw:
// | 'ml-1',
// | showAsCard ? 'mb-2' : undefined,
// | showAsCard ? 'bg-base-300 bg-opacity-30 p-1' : undefined,
// | showAsCard ? 'virtualBorder' : undefined,

// style:
// | borderRadius: '0.5rem',
// | border: showAsCard ? 'solid' : undefined,
// | paddingLeft: showAsCard ? '.4rem' : undefined,
