import type { Form } from '../../Form'
import type { BoardPosition } from './WidgetListExtTypes'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'
import type { Spec } from 'src/controls/Spec'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetList_LineUI } from '../list/WidgetListUI'
import { ResolutionState } from '../size/ResolutionState'
import { WidgetDI } from '../WidgetUI.DI'
import { boardDefaultItemShape } from './WidgetListExtTypes'
import { WidgetListExtUI } from './WidgetListExtUI'
import { runWithGlobalForm } from 'src/models/_ctx2'

// CONFIG
export type Widget_listExt_config<T extends Spec> = WidgetConfigFields<{
    element: T | ((p: { ix: number; width: number; height: number }) => T)
    min?: number
    max?: number
    defaultLength?: number
    initialPosition: (size: { ix: number; width: number; height: number }) => Partial<BoardPosition>
    mode?: 'regional' | 'timeline'
    width: number /** default: 100 */
    height: number /** default: 100 */
}>

// SERIAL
export type Widget_listExt_serial<T extends Spec> = WidgetSerialFields<{
    type: 'listExt'
    entries: { serial: T['$Serial']; shape: BoardPosition }[]
    width: number
    height: number
}>

// OUT
export type Widget_listExt_output<T extends Spec> = {
    items: { value: T['$Output']; position: BoardPosition }[]
    // -----------------------
    width: number
    height: number
}

// TYPES
export type Widget_listExt_types<T extends Spec> = {
    $Type: 'listExt'
    $Input: Widget_listExt_config<T>
    $Serial: Widget_listExt_serial<T>
    $Output: Widget_listExt_output<T>
    $Widget: Widget_listExt<T>
}

// STATE
export interface Widget_listExt<T extends Spec> extends Widget_listExt_types<T> {}
export class Widget_listExt<T extends Spec> implements IWidget<Widget_listExt_types<T>> {
    HeaderUI = WidgetList_LineUI
    BodyUI = WidgetListExtUI
    readonly id: string
    readonly type: 'listExt' = 'listExt'

    get sizeHelper(): ResolutionState {
        const state = new ResolutionState(this.serial) // should only be executed once
        Object.defineProperty(this, 'sizeHelper', { value: state })
        return state
    }

    entries: { widget: T['$Widget']; shape: BoardPosition }[] = []

    serial: Widget_listExt_serial<T>

    // for compatibility with Widget_list
    get items(): T['$Widget'][] {
        return this.entries.map((i) => i.widget)
    }

    // INIT -----------------------------------------------------------------------------

    get width(): number { return this.serial.width ?? this.config.width ?? 100 } // prettier-ignore
    get height(): number { return this.serial.height ?? this.config.height ?? 100 } // prettier-ignore
    // get width() { return this.serial.width } // prettier-ignore
    // get height() { return this.serial.height } // prettier-ignore

    constructor(
        //
        public form: Form<any>,
        public config: Widget_listExt_config<T>,
        serial?: Widget_listExt_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()

        // serial
        this.serial = serial ?? {
            type: 'listExt',
            id: this.id,
            entries: [],
            width: config.width ?? 100,
            height: config.height ?? 100,
        }

        // minor safety net since all those internal changes
        if (this.serial.entries == null) this.serial.entries = []

        // reference to check children types
        const schema = this.schemaAt(0)
        for (const entry of this.serial.entries) {
            const subSerial = entry.serial
            if (subSerial.type !== schema.type) {
                console.log(`[❌] SKIPPING form item because it has an incompatible entry from a previous app definition`)
                continue
            }
            const subWidget = form.builder._HYDRATE(schema, subSerial)
            this.entries.push({ widget: subWidget, shape: entry.shape })
        }

        // add missing items if min specified
        const missingItems = (this.config.min ?? 0) - this.entries.length
        for (let i = 0; i < missingItems; i++) this.addItem()

        makeAutoObservable(this, { sizeHelper: false })
    }

    schemaAt = (ix: number): T => {
        const _schema = this.config.element
        const schema: T =
            typeof _schema === 'function' //
                ? runWithGlobalForm(this.form.builder, () => _schema({ ix, width: this.width, height: this.width }))
                : _schema
        return schema
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
    get length() { return this.entries.length } // prettier-ignore
    addItem() {
        const partialShape = this.config.initialPosition({ ix: this.length, width: this.width, height: this.height })
        const shape: BoardPosition = { ...boardDefaultItemShape, ...partialShape }
        const spec = this.schemaAt(this.length)
        const element = this.form.builder._HYDRATE(spec, null)
        this.entries.push({ widget: element, shape: shape })
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

    get serialHash(): string {
        return hash({
            items: this.entries.map((i) => ({
                position: i.shape,
                value: i.widget.serialHash,
            })),
            width: this.serial.width,
            height: this.serial.width,
        })
    }

    get value(): Widget_listExt_output<T> {
        const items = this.entries.map((i) => ({
            position: i.shape,
            value: i.widget.value,
        }))
        console.log(`[🤠] `, items)
        return {
            items: items,
            width: this.serial.width,
            height: this.serial.width,
        }
    }
}

// DI
WidgetDI.Widget_listExt = Widget_listExt
