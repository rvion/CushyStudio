import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { bang } from 'src/utils/misc/bang'

export type Widget_matrix_cell = {
    x: number
    y: number
    row: string
    col: string
    value: boolean
}

// CONFIG
export type Widget_matrix_config = WidgetConfigFields<{
    default?: { row: string; col: string }[]
    rows: string[]
    cols: string[]
}>

// SERIAL
export type Widget_matrix_serial = WidgetSerialFields<{ type: 'matrix'; active: true; selected: Widget_matrix_cell[] }>

// OUT
export type Widget_matrix_output = Widget_matrix_cell[]

// TYPES
export type Widget_matrix_types = {
    $Type: 'matrix'
    $Input: Widget_matrix_config
    $Serial: Widget_matrix_serial
    $Output: Widget_matrix_output
}

// STATE
export interface Widget_matrix extends Widget_matrix_types {}
export class Widget_matrix implements IWidget<Widget_matrix_types> {
    get serialHash(): string {
        return hash(this.value)
    }
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'matrix' = 'matrix'
    readonly serial: Widget_matrix_serial

    rows: string[]
    cols: string[]

    constructor(public form: Form<any>, public config: Widget_matrix_config, serial?: Widget_matrix_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type: 'matrix', collapsed: config.startCollapsed, id: this.id, active: true, selected: [] }

        const rows = config.rows
        const cols = config.cols

        // init all cells to false
        for (const [rowIx, row] of rows.entries()) {
            for (const [colIx, col] of cols.entries()) {
                this.store.set(this.key(row, col), { x: rowIx, y: colIx, col, row, value: false })
            }
        }
        // apply default value
        const values = this.serial.selected
        if (values)
            for (const v of values) {
                this.store.set(this.key(rows[v.x], cols[v.y]), v)
            }
        this.rows = config.rows
        this.cols = config.cols
        // make observable
        makeAutoObservable(this)
    }
    get value(): Widget_matrix_output {
        // if (!this.state.active) return undefined
        return this.serial.selected
    }

    private sep = ' &&& '
    private store = new Map<string, Widget_matrix_cell>()
    private key = (row: string, col: string) => `${row}${this.sep}${col}`
    get allCells() { return Array.from(this.store.values()); } // prettier-ignore
    UPDATE = () => (this.serial.selected = this.RESULT)
    get RESULT() {
        return this.allCells.filter((v) => v.value)
    }

    get firstValue() {
        return this.allCells[0]?.value ?? false
    }

    setAll = (value: boolean) => {
        for (const v of this.allCells) v.value = value
        this.UPDATE()
        // this.p.set(this.values)
    }

    setRow = (row: string, val: boolean) => {
        for (const v of this.cols) {
            const cell = this.get(row, v)
            cell.value = val
        }
        this.UPDATE()
    }

    setCol = (col: string, val: boolean) => {
        for (const r of this.rows) {
            const cell = this.get(r, col)
            cell.value = val
        }
        this.UPDATE()
    }

    get = (row: string, col: string): Widget_matrix_cell => {
        return bang(this.store.get(this.key(row, col)))
    }

    set = (row: string, col: string, value: boolean) => {
        const cell = this.get(row, col)
        cell.value = value
        this.UPDATE()
    }
}

// DI
WidgetDI.Widget_matrix = Widget_matrix
