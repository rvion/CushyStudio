import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'
import type { BoardPosition } from './WidgetListExtTypes'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
import { runWithGlobalForm } from '../../shared/runWithGlobalForm'
import { clampOpt } from '../list/clamp'
import { ResolutionState } from '../size/ResolutionState'
import { registerWidgetClass } from '../WidgetUI.DI'
import { boardDefaultItemShape } from './WidgetListExtTypes'
import { WidgetListExt_LineUI, WidgetListExtUI } from './WidgetListExtUI'

// CONFIG
export type Widget_listExt_config<T extends ISpec> = WidgetConfigFields<
    {
        element: T | ((p: { ix: number; width: number; height: number }) => T)
        min?: number
        max?: number
        defaultLength?: number
        initialPosition: (size: { ix: number; width: number; height: number }) => Partial<BoardPosition>
        mode?: 'regional' | 'timeline'
        width: number /** default: 100 */
        height: number /** default: 100 */
    },
    Widget_listExt_types<T>
>

// SERIAL
export type Widget_listExt_serial<T extends ISpec> = WidgetSerialFields<{
    type: 'listExt'
    entries: { serial: T['$Serial']; shape: BoardPosition }[]
    width: number
    height: number
}>

// VALUE
export type Widget_listExt_value<T extends ISpec> = {
    items: { value: T['$Value']; position: BoardPosition }[]
    // -----------------------
    width: number
    height: number
}

// TYPES
export type Widget_listExt_types<T extends ISpec> = {
    $Type: 'listExt'
    $Config: Widget_listExt_config<T>
    $Serial: Widget_listExt_serial<T>
    $Value: Widget_listExt_value<T>
    $Widget: Widget_listExt<T>
}

// STATE
export interface Widget_listExt<T extends ISpec> extends Widget_listExt_types<T> {}
export class Widget_listExt<T extends ISpec> extends BaseWidget implements IWidget<Widget_listExt_types<T>> {
    DefaultHeaderUI = WidgetListExt_LineUI
    DefaultBodyUI = WidgetListExtUI

    readonly id: string

    readonly type: 'listExt' = 'listExt'
    get baseErrors(): Problem_Ext {
        return null
    }

    get hasChanges() {
        const defaultLength = clampOpt(this.config.defaultLength, this.config.min, this.config.max)
        if (this.items.length !== defaultLength) return true
        // check if any remaining item has changes
        return this.items.some((i) => i.hasChanges)
    }
    reset = () => {
        throw new Error('Method not implemented yet.')
    }

    get width(): number { return this.serial.width ?? this.config.width ?? 100 } // prettier-ignore
    get height(): number { return this.serial.height ?? this.config.height ?? 100 } // prettier-ignore
    // get width() { return this.serial.width } // prettier-ignore
    // get height() { return this.serial.height } // prettier-ignore
    set width(next: number) {
        if (next === this.serial.width) return
        runInAction(() => {
            this.serial.width = next
            this.bumpValue()
        })
    }
    set height(next: number) {
        if (next === this.serial.height) return
        runInAction(() => {
            this.serial.height = next
            this.bumpValue()
        })
    }
    get sizeHelper(): ResolutionState {
        const state = new ResolutionState(this) // should only be executed once
        Object.defineProperty(this, 'sizeHelper', { value: state })
        return state
    }

    entries: { widget: T['$Widget']; shape: BoardPosition }[] = []

    serial: Widget_listExt_serial<T>

    // for compatibility with Widget_list
    get items(): T['$Widget'][] {
        return this.entries.map((i) => i.widget)
    }

    get length(): number {
        return this.entries.length
    }

    // INIT -----------------------------------------------------------------------------

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_listExt<T>>,
        serial?: Widget_listExt_serial<T>,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config

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
            const subWidget = form.builder._HYDRATE(this, schema, subSerial)
            this.entries.push({ widget: subWidget, shape: entry.shape })
        }

        // add missing items if min specified
        const missingItems = (this.config.min ?? 0) - this.entries.length
        for (let i = 0; i < missingItems; i++) this.addItem({ skipBump: true })

        this.init({
            sizeHelper: false,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get subWidgets() {
        return this.items
    }

    get subWidgetsWithKeys() {
        return this.items.map((widget, ix) => ({ key: ix.toString(), widget }))
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
    collapseAllItems = (): void => {
        for (const i of this.entries) i.widget.setCollapsed(true)
    }

    expandAllItems = (): void => {
        for (const i of this.entries) i.widget.setCollapsed(false)
    }

    // ADDING ITEMS -------------------------------------------------
    addItem(p?: { skipBump?: true } /* 🔴 Annoying special case in the list's ctor */) {
        const partialShape = this.config.initialPosition({ ix: this.length, width: this.width, height: this.height })
        const shape: BoardPosition = { ...boardDefaultItemShape, ...partialShape }
        const spec = this.schemaAt(this.length)
        const element = this.form.builder._HYDRATE(this, spec, null)
        this.entries.push({ widget: element, shape: shape })
        this.serial.entries.push({ serial: element.serial, shape: shape })
        if (!p?.skipBump) this.bumpValue()
    }

    // REMOVING ITEMS -------------------------------------------------
    removeAllItems = () => {
        // ensure list is not empty
        if (this.length === 0) return console.log(`[🔶] listExt.removeAllItems: list is already empty`)

        // ensure list is not at min len already
        const minLen = this.config.min ?? 0
        if (this.length <= minLen) return console.log(`[🔶] listExt.removeAllItems: list is already at min lenght`)

        // remove all items
        this.serial.entries = this.serial.entries.slice(0, minLen)
        this.entries = this.entries.slice(0, minLen)
        this.bumpValue()
    }

    removeItem = (item: T['$Widget']) => {
        // ensure item is in the list
        const i = this.entries.findIndex((i) => i.widget === item)
        if (i < 0) return console.log(`[🔶] listExt.removeItem: item not found`)
        // remove item
        this.serial.entries.splice(i, 1)
        this.entries.splice(i, 1)
        this.bumpValue()
    }

    setValue(xx: Widget_listExt_value<T>) {
        const val = xx.items
        this.width = xx.width
        this.height = xx.height
        for (let i = 0; i < val.length; i++) {
            if (i < this.items.length) {
                this.entries[i]!.widget.setValue(val[i]!.value)
                this.entries[i]!.shape = val[i]!.position
            } else {
                this.addItem({ skipBump: true })
                this.entries[i]!.widget.setValue(val[i]!.value)
                this.entries[i]!.shape = val[i]!.position
            }
        }
    }
    get value(): Widget_listExt_value<T> {
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
registerWidgetClass('listExt', Widget_listExt)
