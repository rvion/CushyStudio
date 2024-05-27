import type { Form } from '../../Form'
import type { ISpec, SchemaDict } from '../../ISpec'
import type { GetWidgetResult, IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { bang } from '../../../utils/misc/bang'
import { BaseWidget } from '../../BaseWidget'
import { getActualWidgetToDisplay } from '../../shared/getActualWidgetToDisplay'
import { getIfWidgetIsCollapsible } from '../../shared/getIfWidgetIsCollapsible'
import { runWithGlobalForm } from '../../shared/runWithGlobalForm'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetGroup_BlockUI, WidgetGroup_LineUI } from './WidgetGroupUI'

// CONFIG
export type Widget_group_config<T extends SchemaDict> = WidgetConfigFields<
    {
        /**
         * lambda function is deprecated, prefer passing the items as an object
         * directly
         */
        items?: T | (() => T)

        /**
         * legacy property, will be removed soon
         * you can alreay check if you're a top-level property
         * by checking if this.parent is null
         * @deprecated
         */
        topLevel?: boolean

        /** if provided, will be used in the header when fields are folded */
        summary?: (items: { [k in keyof T]: GetWidgetResult<T[k]> }) => string
    },
    Widget_group_types<T>
>

// SERIAL
export type Widget_group_serial<T extends SchemaDict> = WidgetSerialFields<{
    type: 'group'
    values_: { [K in keyof T]?: T[K]['$Serial'] }
}>

// VALUE
export type Widget_group_value<T extends SchemaDict> = {
    [k in keyof T]: GetWidgetResult<T[k]>
}

// TYPES
export type Widget_group_types<T extends SchemaDict> = {
    $Type: 'group'
    $Config: Widget_group_config<T>
    $Serial: Widget_group_serial<T>
    $Value: Widget_group_value<T>
    $Widget: Widget_group<T>
}

// STATE
export interface Widget_group<T extends SchemaDict> extends Widget_group_types<T> {}
export class Widget_group<T extends SchemaDict> extends BaseWidget implements IWidget<Widget_group_types<T>> {
    DefaultHeaderUI = WidgetGroup_LineUI
    get DefaultBodyUI() {
        if (Object.keys(this.fields).length === 0) return
        return WidgetGroup_BlockUI
    }

    get baseErrors(): Problem_Ext {
        return null
    }

    get hasChanges() {
        return Object.values(this.fields).some((f) => f.hasChanges)
    }
    reset = () => {
        for (const key in this.fields) this.fields[key].reset()
    }

    get summary(): string {
        return this.config.summary?.(this.value) ?? ''
        // return this.config.summary?.(this.value) ?? Object.keys(this.fields).length + ' fields'
    }
    readonly id: string

    readonly type: 'group' = 'group'

    collapseAllEntries = () => {
        for (const [key, _item] of this.entries) {
            const item = getActualWidgetToDisplay(_item)
            if (item.serial.collapsed) continue
            const isCollapsible = getIfWidgetIsCollapsible(item)
            if (isCollapsible) item.setCollapsed(true)
        }
    }
    expandAllEntries = () => {
        for (const [key, _item] of this.entries) {
            const item = getActualWidgetToDisplay(_item)
            item.setCollapsed(undefined)
        }
    }

    /** all [key,value] pairs */
    get entries() {
        return Object.entries(this.fields) as [string, IWidget][]
    }

    at = <K extends keyof T>(key: K): T[K]['$Widget'] => this.fields[key]
    get = <K extends keyof T>(key: K): T[K]['$Value'] => this.fields[key].value

    /** the dict of all child widgets */
    fields: { [k in keyof T]: T[k]['$Widget'] } = {} as any // will be filled during constructor
    serial: Widget_group_serial<T> = {} as any
    /* override */ background = true

    private _defaultSerial = (): Widget_group_serial<T> => {
        return {
            type: 'group',
            id: this.id,
            collapsed: this.config.startCollapsed,
            values_: {} as any,
        }
    }
    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_group<T>>,
        serial?: Widget_group_serial<T>,
        /** used to register self as the root, before we start instanciating anything */
        preHydrate?: (self: Widget_group<any>) => void,
    ) {
        super()
        this.id = serial?.id ?? nanoid()

        this.serial =
            serial && serial.type === 'group' //
                ? serial
                : this._defaultSerial()

        // safety nets
        /* 💊 */ if (this.serial.values_ == null) this.serial.values_ = {}
        // /* 💊 */ if (this.config.collapsed) this.serial.collapsed = undefined

        // allow to store ref to the object right away
        preHydrate?.(this)

        const prevFieldSerials: { [K in keyof T]?: T[K]['$Serial'] } = this.serial.values_
        const itemsDef = this.config.items
        const _newValues: SchemaDict =
            typeof itemsDef === 'function' //
                ? runWithGlobalForm(this.form.builder, itemsDef) ?? {}
                : itemsDef ?? {}

        const childKeys = Object.keys(_newValues) as (keyof T & string)[]
        // this.childKeys = childKeys
        for (const key of childKeys) {
            const unmounted = bang(_newValues[key])
            const prevFieldSerial = prevFieldSerials[key]
            if (prevFieldSerial && unmounted.type === prevFieldSerial.type) {
                // if (newType === 'shared') {
                //     // 🔴 BAD 🔴
                //     this.fields[key] = newItem as any
                // } else {
                // console.log(`[🟢] valid serial for "${key}": (${newType} === ${prevFieldSerial.type}) `)
                this.fields[key] = this.form.builder._HYDRATE(this, unmounted, prevFieldSerial)
                // }
            } else {
                // console.log(`[🟢] invalid serial for "${key}"`)
                if (prevFieldSerial != null)
                    console.log(
                        `[🔶] invalid serial for "${key}": (${unmounted.type} != ${prevFieldSerial?.type}) => using fresh one instead`,
                        prevFieldSerials,
                    )
                this.fields[key] = this.form.builder._HYDRATE(this, unmounted, null)
                this.serial.values_[key] = this.fields[key].serial
            }
        }
        // we only iterate on the new values => we DON'T WANT to remove the old ones.
        // we keep the old values in case those are just temporarilly removed, or in case
        // those will be lazily added later though global usage

        this.init({
            value: false,
            __value: false,
            DefaultHeaderUI: false,
        })
    }

    setValue(val: Widget_group_value<T>) {
        this.value = val
    }

    setPartialValue(val: Partial<Widget_group_value<T>>) {
        runInAction(() => {
            for (const key in val) this.fields[key].setValue(val[key])
            this.bumpValue()
        })
    }

    get subWidgets() {
        return Object.values(this.fields)
    }

    get subWidgetsWithKeys() {
        return Object.entries(this.fields).map(([key, widget]) => ({ key, widget }))
    }

    set value(val: Widget_group_value<T>) {
        runInAction(() => {
            for (const key in val) this.fields[key].setValue(val[key])
            this.bumpValue()
        })
    }
    get value() {
        return this.__value
    }

    // @internal
    __value: { [k in keyof T]: GetWidgetResult<T[k]> } = new Proxy({} as any, {
        ownKeys: (target) => {
            return Object.keys(this.fields)
        },
        get: (target, prop) => {
            if (typeof prop !== 'string') return
            const subWidget: IWidget = this.fields[prop]!
            if (subWidget == null) return
            return subWidget.value
        },
        getOwnPropertyDescriptor: (target, prop) => {
            if (typeof prop !== 'string') return
            const subWidget: IWidget = this.fields[prop]!
            if (subWidget == null) return
            return {
                enumerable: true,
                configurable: true,
                get() {
                    return subWidget.value
                },
            }
        },
    })

    // 💬 2024-03-13 rvion: no setter for groups; groups can not be set; only their child can
}

// DI
registerWidgetClass('group', Widget_group)

/* --------------------------------------------------------------------------------
// to make a proxy look the way you want:
// 1. Define ownKeys handler: This will define which keys the proxy pretends to own, similar to what you have already.
// 2. Define get handler: This will return the value for each property, which you are currently setting to return the property name.
// 3. Define getOwnPropertyDescriptor handler: This is necessary because when you stringify an object or otherwise try to serialize or iterate over its properties, JavaScript checks if the properties actually exist and are enumerable. By providing a descriptor with enumerable: true, you enable this behavior.

// tip: practical way to dive into js & proxies inner workings: `bun -w <path.ts>`


const x = new Proxy(
    {},
    {
        ownKeys: (target) => {
            return ['a', 'b']
        },
        get: (target, prop) => {
            if (typeof prop !== 'string') return
            return prop
        },
        getOwnPropertyDescriptor: (target, prop) => {
            return {
                enumerable: true,
                configurable: true,
                value: prop,
            }
        },

    },
)

console.log(`[🤠] `, JSON.stringify(x))

-------------------------------------------------------------------------------- */
