import type { FormBuilder } from 'src/controls/FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from 'src/controls/IWidget'
import type { Widget } from 'src/controls/Widget'
import type { ComfySchemaL } from 'src/models/Schema'
import type { BoardPosition } from './WidgetListExtTypes'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { runWithGlobalForm } from 'src/models/_ctx2'
import { WidgetDI } from '../WidgetUI.DI'
import { boardDefaultItemShape } from './WidgetListExtTypes'
import { hash } from 'ohash'
import { ResolutionState } from '../size/ResolutionState'

// CONFIG
export type Widget_listExt_config<T extends Widget> = WidgetConfigFields<{
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
export type Widget_listExt_serial<T extends Widget> = WidgetSerialFields<{
    type: 'listExt'
    entries: { serial: T['$Serial']; shape: BoardPosition }[]
    width: number
    height: number
}>

// OUT
export type Widget_listExt_output<T extends Widget> = {
    items: { value: T['$Output']; position: BoardPosition }[]
    // -----------------------
    width: number
    height: number
}

// TYPES
export type Widget_listExt_types<T extends Widget> = {
    $Type: 'listExt'
    $Input: Widget_listExt_config<T>
    $Serial: Widget_listExt_serial<T>
    $Output: Widget_listExt_output<T>
}

// STATE
export interface Widget_listExt<T extends Widget> extends WidgetTypeHelpers<Widget_listExt_types<T>> {}
export class Widget_listExt<T extends Widget> implements IWidget<Widget_listExt_types<T>> {
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

    entries: { widget: T; position: BoardPosition }[] = []
    serial: Widget_listExt_serial<T>

    // for compatibility with Widget_list
    get items(): T[] {
        return this.entries.map((i) => i.widget)
    }

    // INIT -----------------------------------------------------------------------------
    constructor(public form: FormBuilder, public config: Widget_listExt_config<T>, serial?: Widget_listExt_serial<T>) {
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
        const _reference = runWithGlobalForm(this.form, () =>
            config.element({
                ix: 0,
                width: w,
                height: h,
            }),
        )

        for (const entry of this.serial.entries) {
            const subSerial = entry.serial
            if (subSerial.type !== _reference.type) {
                console.log(`[❌] SKIPPING form item because it has an incompatible entry from a previous app definition`)
                continue
            }
            const subWidget = form._HYDRATE(subSerial.type, _reference.config, subSerial)
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
    addItem() {
        const partialShape = this.config.initialPosition({
            ix: this.entries.length,
            width: this.serial.width,
            height: this.serial.height,
        })
        const shape: BoardPosition = { ...boardDefaultItemShape, ...partialShape }
        const item = runWithGlobalForm(this.form, () =>
            this.config.element({
                width: this.serial.width,
                height: this.serial.height,
                ix: this.entries.length,
            }),
        )
        this.entries.push({ widget: item, position: shape })
        this.serial.entries.push({ serial: item.serial, shape: shape })
    }

    // REMOVING ITEMS -------------------------------------------------
    removemAllItems = () => {
        this.serial.entries = this.serial.entries.slice(0, this.config.min ?? 0)
        this.entries = this.entries.slice(0, this.config.min ?? 0)
    }

    removeItem = (item: T) => {
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
