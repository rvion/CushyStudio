import type { Widget } from 'src/controls/Widget'
import type { FormBuilder } from '../../FormBuilder'
import type { GetWidgetResult, IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { makeAutoObservable, action } from 'mobx'
import { nanoid } from 'nanoid'
import { runWithGlobalForm } from 'src/models/_ctx2'
import { bang } from 'src/utils/misc/bang'
import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_group_config<T extends { [key: string]: Widget }> = WidgetConfigFields<{
    // default?: boolean
    items?: () => T
    topLevel?: boolean
    /** if provided, will be used to show a single line summary on the inline form slot */
    summary?: (items: { [k in keyof T]: GetWidgetResult<T[k]> }) => string
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
    get summary(): string {
        return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' items'
    }
    get serialHash(): string {
        return Object.values(this.fields)
            .map((v: Widget) => v.serialHash)
            .join(',')
    }
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
        return Object.entries(this.fields) as [string, any][]
    }

    at = <K extends keyof T>(key: K): T[K] => this.fields[key]
    get = <K extends keyof T>(key: K): T[K]['$Output'] => this.fields[key].value

    /** the dict of all child widgets */
    fields: T /* { [k in keyof T]: T[k] } */ = {} as any // will be filled during constructor
    serial: Widget_group_serial<T>
    // childKeys: (keyof T & string)[] = []
    enableGroup() {
        this.serial.active = true
        const prevValues_: { [K in keyof T]?: T[K]['$Serial'] } = this.serial.values_
        const _newValues: { [key: string]: Widget } = runWithGlobalForm(this.form, () => this.config.items?.()) ?? {}

        const childKeys = Object.keys(_newValues) as (keyof T & string)[]
        // this.childKeys = childKeys
        for (const key of childKeys) {
            const newItem = _newValues[key]
            const prevValue_ = prevValues_[key]
            const newInput = newItem.config
            const newType = newItem.type
            if (prevValue_ && newType === prevValue_.type) {
                // console.log(`[🟢] valid serial for "${key}": (${newType} != ${prevValue_?.type}) `)
                this.fields[key] = this.form._HYDRATE(newType, newInput, prevValue_)
            } else {
                if (prevValue_ != null)
                    console.log(
                        `[🔶] invalid serial for "${key}": (${newType} != ${prevValue_?.type}) => using fresh one instead`,
                        prevValues_,
                    )
                this.fields[key] = newItem as any
                this.serial.values_[key] = newItem.serial as any
            }
        }
    }

    private _defaultSerial = (): Widget_group_serial<T> => {
        return {
            type: 'group',
            id: this.id,
            active: true,
            collapsed: this.config.startCollapsed ?? false,
            values_: {} as any,
        }
    }
    constructor(
        //
        public form: FormBuilder,
        public config: Widget_group_config<T>,
        serial?: Widget_group_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial =
            serial && serial.type === 'group' //
                ? serial
                : this._defaultSerial()
        if (this.serial.values_ == null) this.serial.values_ = {}
        this.enableGroup()
        makeAutoObservable(this, { value: false, enableGroup: action })
    }

    value: { [k in keyof T]: GetWidgetResult<T[k]> } = new Proxy({} as any, {
        get: (target, prop) => {
            if (typeof prop !== 'string') return
            const subWidget: Widget = this.fields[prop]
            if (subWidget == null) return
            return subWidget.value
        },
    })
}

// DI
WidgetDI.Widget_group = Widget_group
