import type { Form } from 'src/controls/Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from 'src/controls/IWidget'
import type { BoardPosition } from './WidgetListExtTypes'
import type { Schema } from 'src/controls/Prop'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { runWithGlobalForm } from 'src/models/_ctx2'
import { WidgetDI } from '../WidgetUI.DI'
import { boardDefaultItemShape } from './WidgetListExtTypes'
import { hash } from 'ohash'
import { ResolutionState } from '../size/ResolutionState'

// CONFIG
export type Widget_listExt_config<T extends Schema> = WidgetConfigFields<{
    element: (p: { ix: number; width: number; height: number }) => T
    min?: number
    max?: number
    defaultLength?: number
    initialPosition: (size: { ix: number; width: number; height: number }) => Partial<BoardPosition>
    mode?: 'regional' | 'timeline'
    width: number /** default: 100 */
    height: number /** default: 100 */
}>

// SERIAL
export type Widget_listExt_serial<T extends Schema> = WidgetSerialFields<{
    type: 'listExt'
    entries: { serial: T['$Serial']; shape: BoardPosition }[]
    width: number
    height: number
}>

// OUT
export type Widget_listExt_output<T extends Schema> = {
    items: { value: T['$Output']; position: BoardPosition }[]
    // -----------------------
    width: number
    height: number
}

// TYPES
export type Widget_listExt_types<T extends Schema> = {
    $Type: 'listExt'
    $Input: Widget_listExt_config<T>
    $Serial: Widget_listExt_serial<T>
    $Output: Widget_listExt_output<T>
}

// STATE
export interface Widget_listExt<T extends Schema> extends WidgetTypeHelpers<Widget_listExt_types<T>> {}
export class Widget_listExt<T extends Schema> implements IWidget<Widget_listExt_types<T>> {
    get serialHash () { return hash(this.value) } // prettier-ignore
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'listExt' = 'listExt'

    get sizeHelper(): ResolutionState {
        const state = new ResolutionState(this.serial) // should only be executed once
        Object.defineProperty(this, 'sizeHelper', { value: state })
        return state
    }

    entries: {
        widget: T['$Widget']
        position: BoardPosition
    }[] = []
    serial: Widget_listExt_serial<T>

    // for compatibility with Widget_list
    get items(): T['$Widget'][] {
        return this.entries.map((i) => i.widget)
    }

    // INIT -----------------------------------------------------------------------------
    constructor(public form: Form<any>, public config: Widget_listExt_config<T>, serial?: Widget_listExt_serial<T>) {
        this.id = serial?.id ?? nanoid()

        const w = config.width ?? 100
        const h = config.height ?? 100

        // serial
        this.serial = serial ?? {
            type: 'listExt',
            id: this.id,
            entries: [],
            width: w,
            height: h,
        }

        // minor safety net since all those internal changes
        if (this.serial.entries == null) this.serial.entries = []

        // reference to check children types
        const unmounted = runWithGlobalForm(this.form.builder, () => config.element({ ix: 0, width: w, height: h }))
        for (const entry of this.serial.entries) {
            const subSerial = entry.serial
            if (subSerial.type !== unmounted.type) {
                console.log(`[❌] SKIPPING form item because it has an incompatible entry from a previous app definition`)
                continue
            }
            const subWidget = form.builder._HYDRATE(unmounted, subSerial)
            this.entries.push({ widget: subWidget, position: entry.shape })
        }

        // add missing items if min specified
        const missingItems = (this.config.min ?? 0) - this.entries.length
        for (let i = 0; i < missingItems; i++) this.addItem()

        makeAutoObservable(this, { sizeHelper: false })
    }

    // HELPERS =======================================================
    // FOLDING -------------------------------------------------------
    collapseAllItems = () => {
        this.entries.forEach((i) => (i.widget.serial.collapsed = true))
    }

    expandAllItems = () => {
        this.entries.forEach((i) => (i.widget.serial.collapsed = false))
    }

    // ADDING ITEMS -------------------------------------------------
    get width() { return this.serial.width } // prettier-ignore
    get height() { return this.serial.height } // prettier-ignore
    get length() { return this.entries.length } // prettier-ignore
    addItem() {
        const partialShape = this.config.initialPosition({ ix: this.length, width: this.width, height: this.height })
        const shape: BoardPosition = { ...boardDefaultItemShape, ...partialShape }
        const unmounted = runWithGlobalForm(this.form.builder, () =>
            this.config.element({ width: this.width, height: this.height, ix: this.length }),
        )
        const element = this.form.builder._HYDRATE(unmounted, null)
        this.entries.push({ widget: element, position: shape })
        this.serial.entries.push({ serial: element.serial, shape: shape })
    }

    // REMOVING ITEMS -------------------------------------------------
    removemAllItems = () => {
        this.serial.entries = this.serial.entries.slice(0, this.config.min ?? 0)
        this.entries = this.entries.slice(0, this.config.min ?? 0)
    }

    removeItem = (item: T['$Widget']) => {
        const i = this.entries.findIndex((i) => i.widget === item)
        if (i >= 0) {
            this.serial.entries.splice(i, 1)
            this.entries.splice(i, 1)
        }
    }

    get value(): Widget_listExt_output<T> {
        const items = this.entries.map((i) => ({ position: i.position, value: i.widget.value }))
        return {
            items: items,
            width: this.serial.width,
            height: this.serial.width,
        }
    }
}

// DI
WidgetDI.Widget_listExt = Widget_listExt
