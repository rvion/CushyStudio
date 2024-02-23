import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Spec } from 'src/controls/Prop'

import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'
import { runWithGlobalForm } from 'src/models/_ctx2'

// CONFIG
export type Widget_list_config<T extends Spec> = WidgetConfigFields<{
    element: ((ix: number) => T) | T
    min?: number
    max?: number
    defaultLength?: number
}>

// SERIAL
export type Widget_list_serial<T extends Spec> = WidgetSerialFields<{
    type: 'list'
    items_: T['$Serial'][]
}>

// OUT
export type Widget_list_output<T extends Spec> = T['$Output'][]

// TYPES
export type Widget_list_types<T extends Spec> = {
    $Type: 'list'
    $Input: Widget_list_config<T>
    $Serial: Widget_list_serial<T>
    $Output: Widget_list_output<T>
}

// STATE
export interface Widget_list<T extends Spec> extends Widget_list_types<T> {}
export class Widget_list<T extends Spec> implements IWidget<Widget_list_types<T>> {
    get serialHash(): string {
        return this.items.map((v) => v.serialHash).join(',')
    }
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'list' = 'list'

    items: T['$Widget'][]
    serial: Widget_list_serial<T>

    schemaAt = (ix: number): T => {
        const _schema = this.config.element
        const schema: T =
            typeof _schema === 'function' //
                ? runWithGlobalForm(this.form.builder, () => _schema(ix))
                : _schema
        return schema
    }
    constructor(
        //
        public form: Form<any>,
        public config: Widget_list_config<T>,
        serial?: Widget_list_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()

        // serial
        this.serial = serial ?? observable({ type: 'list', id: this.id, active: true, items_: [] })

        // minor safety net since all those internal changes
        if (this.serial.items_ == null) this.serial.items_ = []

        // hydrate items
        this.items = []
        const unmounted = this.schemaAt(0) // TODO: evaluate schema in the form loop
        for (const subSerial of this.serial.items_) {
            if (
                subSerial == null || // ⁉️ when can this happen ?
                subSerial.type !== unmounted.type
            ) {
                console.log(`[❌] SKIPPING form item because it has an incompatible entry from a previous app definition`)
                continue
            }
            const subWidget = form.builder._HYDRATE(unmounted, subSerial)
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
        const schema = this.schemaAt(this.serial.items_.length) // TODO: evaluate schema in the form loop
        const element = this.form.builder._HYDRATE(schema, null)
        this.items.push(element)
        this.serial.items_.push(element.serial)
    }

    // REMOVING ITEMS -------------------------------------------------
    removemAllItems = () => {
        this.serial.items_ = this.serial.items_.slice(0, this.config.min ?? 0)
        this.items = this.items.slice(0, this.config.min ?? 0)
    }

    removeItem = (item: T['$Widget']) => {
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
