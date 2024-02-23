import type { Form } from '../../Form'
import type { GetWidgetResult, IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { SchemaDict } from 'src/cards/App'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'
import { Spec } from 'src/controls/Prop'
import { runWithGlobalForm } from 'src/models/_ctx2'

// CONFIG
export type Widget_group_config<T extends SchemaDict> = WidgetConfigFields<{
    items?: (() => T) | T
    topLevel?: boolean
    /** if provided, will be used to show a single line summary on the inline form slot */
    summary?: (items: { [k in keyof T]: GetWidgetResult<T[k]> }) => string
}>

// SERIAL
export type Widget_group_serial<T extends SchemaDict> = WidgetSerialFields<{
    type: 'group'
    active: boolean
    values_: { [K in keyof T]?: T[K]['$Serial'] }
}>

// OUT
export type Widget_group_output<T extends SchemaDict> = {
    [k in keyof T]: GetWidgetResult<T[k]>
}

// TYPES
export type Widget_group_types<T extends SchemaDict> = {
    $Type: 'group'
    $Input: Widget_group_config<T>
    $Serial: Widget_group_serial<T>
    $Output: Widget_group_output<T>
}

// STATE
export interface Widget_group<T extends SchemaDict> extends Widget_group_types<T> {}
export class Widget_group<T extends SchemaDict> implements IWidget<Widget_group_types<T>> {
    static Prop = <T extends SchemaDict>(config: Widget_group_config<T>) => new Spec('group', config)

    get summary(): string {
        return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' items'
    }
    get serialHash(): string {
        return Object.values(this.fields)
            .map((v) => v.serialHash)
            .join(',')
    }
    readonly isCollapsible = this.config.collapsible ?? true
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

    at = <K extends keyof T>(key: K): T[K]['$Widget'] => this.fields[key]
    get = <K extends keyof T>(key: K): T[K]['$Output'] => this.fields[key].value

    /** the dict of all child widgets */
    fields: { [k in keyof T]: T[k]['$Widget'] } = {} as any // will be filled during constructor
    serial: Widget_group_serial<T> = {} as any

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
        public form: Form<any>,
        public config: Widget_group_config<T>,
        serial?: Widget_group_serial<T>,
        /** used to register self as the root, before we start instanciating anything */
        preHydrate?: (self: Widget_group<any>) => void,
    ) {
        // persist id
        this.id = serial?.id ?? nanoid()

        // console.log(`[🤠] ASSSIGN SERIAL to ${this.id} 🔴`)
        // serial
        this.serial =
            serial && serial.type === 'group' //
                ? serial
                : this._defaultSerial()

        // safety nets
        /* 💊 */ if (this.serial.values_ == null) this.serial.values_ = {}
        /* 💊 */ if (this.config.collapsible === false) this.serial.collapsed = undefined

        // allow to store ref to the object right away
        preHydrate?.(this)

        this.serial.active = true
        const prevFieldSerials: { [K in keyof T]?: T[K]['$Serial'] } = this.serial.values_
        const itemsDef = this.config.items
        const _newValues: SchemaDict =
            typeof itemsDef === 'function' //
                ? runWithGlobalForm(this.form.builder, itemsDef) ?? {}
                : itemsDef ?? {}

        const childKeys = Object.keys(_newValues) as (keyof T & string)[]
        // this.childKeys = childKeys
        for (const key of childKeys) {
            const unmounted = _newValues[key]
            const prevFieldSerial = prevFieldSerials[key]
            if (prevFieldSerial && unmounted.type === prevFieldSerial.type) {
                // if (newType === 'shared') {
                //     // 🔴 BAD 🔴
                //     this.fields[key] = newItem as any
                // } else {
                // console.log(`[🟢] valid serial for "${key}": (${newType} === ${prevFieldSerial.type}) `)
                this.fields[key] = this.form.builder._HYDRATE(unmounted, prevFieldSerial)
                // }
            } else {
                // console.log(`[🟢] invalid serial for "${key}"`)
                if (prevFieldSerial != null)
                    console.log(
                        `[🔶] invalid serial for "${key}": (${unmounted.type} != ${prevFieldSerial?.type}) => using fresh one instead`,
                        prevFieldSerials,
                    )
                this.fields[key] = this.form.builder._HYDRATE(unmounted, null)
                this.serial.values_[key] = this.fields[key].serial
            }
        }
        // we only iterate on the new values => we DON'T WANT to remove the old ones.
        // we keep the old values in case those are just temporarilly removed, or in case
        // those will be lazily added later though global usage

        makeAutoObservable(this, { value: false })
    }

    value: { [k in keyof T]: GetWidgetResult<T[k]> } = new Proxy({} as any, {
        get: (target, prop) => {
            if (typeof prop !== 'string') return
            const subWidget: IWidget = this.fields[prop]
            if (subWidget == null) return
            return subWidget.value
        },
    })
}

// DI
WidgetDI.Widget_group = Widget_group
