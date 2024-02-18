import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'
import type { Widget } from '../../Widget'

import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { runWithGlobalForm } from 'src/models/_ctx2'
import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_list_config<T extends Widget> = WidgetConfigFields<{
    element: (ix: number) => T
    min?: number
    max?: number
    defaultLength?: number
}>

// SERIAL
export type Widget_list_serial<T extends Widget> = WidgetSerialFields<{
    type: 'list'
    items_: T['$Serial'][]
}>

// OUT
export type Widget_list_output<T extends Widget> = T['$Output'][]

// TYPES
export type Widget_list_types<T extends Widget> = {
    $Type: 'list'
    $Input: Widget_list_config<T>
    $Serial: Widget_list_serial<T>
    $Output: Widget_list_output<T>
}

// STATE
export interface Widget_list<T extends Widget> extends WidgetTypeHelpers<Widget_list_types<T>> {}
export class Widget_list<T extends Widget> implements IWidget<Widget_list_types<T>> {
    get serialHash(): string {
        return this.items.map((v: Widget) => v.serialHash).join(',')
    }
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'list' = 'list'

    items: T[]
    serial: Widget_list_serial<T>

    constructor(public form: FormBuilder, public config: Widget_list_config<T>, serial?: Widget_list_serial<T>) {
        this.id = serial?.id ?? nanoid()

        // serial
        this.serial = serial ?? observable({ type: 'list', id: this.id, active: true, items_: [] })

        // minor safety net since all those internal changes
        if (this.serial.items_ == null) this.serial.items_ = []

        // hydrate items
        this.items = []
        const _reference = runWithGlobalForm(this.form, () => config.element(0))
        for (const subSerial of this.serial.items_) {
            if (subSerial.type !== _reference.type) {
                console.log(`[❌] SKIPPING form item because it has an incompatible entry from a previous app definition`)
                continue
            }
            const subWidget = form._HYDRATE(subSerial.type, _reference.config, subSerial)
            this.items.push(subWidget)
        }

        // add missing items if min specified
        const missingItems = (this.config.min ?? 0) - this.items.length
        for (let i = 0; i < missingItems; i++) this.addItem()

        makeAutoObservable(this)
    }

    get value(): Widget_list_output<T> {
        return this.items.map((i) => i.value)
    }

    // HELPERS =======================================================
    // FOLDING -------------------------------------------------------
    collapseAllItems = () => {
        this.items.forEach((i) => (i.serial.collapsed = true))
    }

    expandAllItems = () => {
        this.items.forEach((i) => (i.serial.collapsed = false))
    }

    // ADDING ITEMS -------------------------------------------------
    addItem() {
        // const _ref = this._reference
        // const newItem = this.builder.HYDRATE(_ref.type, _ref.input)
        const element: T = runWithGlobalForm(this.form, () => this.config.element(this.serial.items_.length))
        this.items.push(element)
        this.serial.items_.push(element.serial)
    }

    // REMOVING ITEMS -------------------------------------------------
    removemAllItems = () => {
        this.serial.items_ = this.serial.items_.slice(0, this.config.min ?? 0)
        this.items = this.items.slice(0, this.config.min ?? 0)
    }

    removeItem = (item: T) => {
        const i = this.items.indexOf(item)
        if (i >= 0) {
            this.serial.items_.splice(i, 1)
            this.items.splice(i, 1)
        }
    }

    // MOVING ITEMS ---------------------------------------------------
    moveItem = (oldIndex: number, newIndex: number) => {
        // serials
        const serials = this.serial.items_
        serials.splice(newIndex, 0, serials.splice(oldIndex, 1)[0])
        // instances
        const instances = this.items
        instances.splice(newIndex, 0, instances.splice(oldIndex, 1)[0])
    }
}

// DI
WidgetDI.Widget_list = Widget_list

// UTILS
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
