import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'
import type { IWidgetListLike } from './ListControlsUI'

import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { createElement } from 'react'

import { bang } from '../../../utils/misc/bang'
import { applyWidgetMixinV2 } from '../../Mixins'
import { runWithGlobalForm } from '../../shared/runWithGlobalForm'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetList_BodyUI, WidgetList_LineUI } from './WidgetListUI'

// CONFIG
export type Widget_list_config<T extends ISpec> = WidgetConfigFields<
    {
        element: ((ix: number) => T) | T
        min?: number
        max?: number
        defaultLength?: number
    },
    Widget_list_types<T>
>

// SERIAL
export type Widget_list_serial<T extends ISpec> = WidgetSerialFields<{
    type: 'list'
    items_: T['$Serial'][]
}>

// VALUE
export type Widget_list_value<T extends ISpec> = T['$Value'][]

// TYPES
export type Widget_list_types<T extends ISpec> = {
    $Type: 'list'
    $Config: Widget_list_config<T>
    $Serial: Widget_list_serial<T>
    $Value: Widget_list_value<T>
    $Widget: Widget_list<T>
}

// STATE
export interface Widget_list<T extends ISpec> extends Widget_list_types<T>, IWidgetMixins {}
export class Widget_list<T extends ISpec> implements IWidget<Widget_list_types<T>> {
    DefaultHeaderUI = WidgetList_LineUI
    get DefaultBodyUI() {
        // if (this.items.length === 0) return
        return WidgetList_BodyUI
    }
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'list' = 'list'

    get length() { return this.items.length } // prettier-ignore
    items: T['$Widget'][]
    serial: Widget_list_serial<T>
    /* override */ background = true

    findItemIndexContaining = (widget: IWidget): number | null => {
        let at = widget as IWidget | null
        let child = at
        while (at != null) {
            at = at.parent
            if (at === this) {
                return this.items.indexOf(child as T['$Widget'])
            }
            child = at
        }
        return null
    }

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
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_list<T>>,
        serial?: Widget_list_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()

        // serial
        this.serial = serial ?? observable({ type: 'list', id: this.id, active: true, items_: [] })

        // minor safety net since all those internal changes
        if (this.serial.items_ == null) this.serial.items_ = []

        // hydrate items
        this.items = []

        // 1. add default item (only when serial was null)
        if (serial == null && this.config.defaultLength != null) {
            for (let i = 0; i < this.config.defaultLength; i++) this.addItem({ skipBump: true })
        }
        // 2. pre-existing serial => rehydrate items
        else {
            const unmounted = this.schemaAt(0) // TODO: evaluate schema in the form loop
            for (const subSerial of this.serial.items_) {
                if (
                    subSerial == null || // ⁉️ when can this happen ?
                    subSerial.type !== unmounted.type
                ) {
                    console.log(`[❌] SKIPPING form item because it has an incompatible entry from a previous app definition`)
                    continue
                }
                const subWidget = form.builder._HYDRATE(this, unmounted, subSerial)
                this.items.push(subWidget)
            }
        }

        // 3. add missing items if min specified
        const missingItems = (this.config.min ?? 0) - this.items.length
        for (let i = 0; i < missingItems; i++) this.addItem({ skipBump: true })

        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    get value(): Widget_list_value<T> {
        return this.items.map((i) => i.value)
    }

    // HELPERS =======================================================
    // FOLDING -------------------------------------------------------
    collapseAllItems = () => {
        for (const i of this.items) i.setCollapsed(true)
    }

    expandAllItems = () => {
        for (const i of this.items) i.setCollapsed(false)
    }

    // ERRORS --------------------------------------------------------
    get baseErrors(): string[] {
        let out: string[] = []
        if (this.config.min != null && this.length < this.config.min) {
            out.push(`List is too short`)
        }
        if (this.config.max != null && this.length > this.config.max) {
            out.push(`List is too long`)
        }
        return out
    }

    // ADDING ITEMS -------------------------------------------------
    addItem(p?: { skipBump?: true } /* 🔴 Annoying special case in the list's ctor */) {
        // ensure list is not at max len already
        if (this.config.max != null && this.items.length >= this.config.max)
            return console.log(`[🔶] list.addItem: list is already at max length`)
        // create new item
        const schema = this.schemaAt(this.serial.items_.length) // TODO: evaluate schema in the form loop
        const element = this.form.builder._HYDRATE(this, schema, null)
        // insert item
        this.items.push(element)
        this.serial.items_.push(element.serial)
        if (!p?.skipBump) this.bumpValue()
    }

    // REMOVING ITEMS ------------------------------------------------
    removeAllItems = () => {
        // ensure list is not empty
        if (this.length === 0) return console.log(`[🔶] list.removeAllItems: list is already empty`)
        // ensure list is not at min len already
        const minLen = this.config.min ?? 0
        if (this.length <= minLen) return console.log(`[🔶] list.removeAllItems: list is already at min lenght`)
        // remove all items
        this.serial.items_ = this.serial.items_.slice(0, minLen)
        this.items = this.items.slice(0, minLen)
        this.bumpValue()
    }

    removeItem = (item: T['$Widget']) => {
        // ensure item is in the list
        const i = this.items.indexOf(item)
        if (i === -1) return console.log(`[🔶] list.removeItem: item not found`)
        // remove item
        this.serial.items_.splice(i, 1)
        this.items.splice(i, 1)
        this.bumpValue()
    }

    // MOVING ITEMS ---------------------------------------------------
    moveItem = (
        //
        oldIndex: number,
        newIndex: number,
    ) => {
        if (oldIndex === newIndex) return console.log(`[🔶] list.moveItem: oldIndex === newIndex`)
        if (oldIndex < 0 || oldIndex >= this.length) return console.log(`[🔶] list.moveItem: oldIndex out of bounds`)
        if (newIndex < 0 || newIndex >= this.length) return console.log(`[🔶] list.moveItem: newIndex out of bounds`)

        // serials
        const serials = this.serial.items_
        serials.splice(newIndex, 0, bang(serials.splice(oldIndex, 1)[0]))

        // instances
        const instances = this.items
        instances.splice(newIndex, 0, bang(instances.splice(oldIndex, 1)[0]))
        this.bumpValue()
    }
}

// DI
registerWidgetClass('list', Widget_list)

// UTILS
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
