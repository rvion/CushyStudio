import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { bang } from '../../../utils/misc/bang'
import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetMatrixUI } from './WidgetMatrixUI'

export type Widget_matrix_cell = {
    x: number
    y: number
    row: string
    col: string
    value: boolean
}

// CONFIG
export type Widget_matrix_config = WidgetConfigFields<
    {
        default?: { row: string; col: string }[]
        rows: string[]
        cols: string[]
    },
    Widget_matrix_types
>

// SERIAL
export type Widget_matrix_serial = WidgetSerialFields<{ type: 'matrix'; active: true; selected: Widget_matrix_cell[] }>

// VALUE
export type Widget_matrix_value = Widget_matrix_cell[]

// TYPES
export type Widget_matrix_types = {
    $Type: 'matrix'
    $Config: Widget_matrix_config
    $Serial: Widget_matrix_serial
    $Value: Widget_matrix_value
    $Widget: Widget_matrix
}

// STATE
export interface Widget_matrix extends Widget_matrix_types {}
export class Widget_matrix extends BaseWidget implements IWidget<Widget_matrix_types> {
    DefaultHeaderUI = WidgetMatrixUI
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'matrix' = 'matrix'
    readonly serial: Widget_matrix_serial
    get baseErrors(): Problem_Ext {
        return null
    }

    rows: string[]
    cols: string[]

    alignLabel = false

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_matrix>,
        serial?: Widget_matrix_serial,
    ) {
        super()
        const config = spec.config
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
                this.store.set(this.key(rows[v.x]!, cols[v.y]!), v)
            }
        this.rows = config.rows
        this.cols = config.cols
        // make observable
        makeAutoObservableInheritance(this)
    }

    setValue(val: Widget_matrix_value) {
        this.value = val
    }

    /** 🔶 this is inneficient */
    set value(val: Widget_matrix_value) {
        runInAction(() => {
            // 1. reset all cells to false
            for (const c of this.allCells) {
                c.value = false
            }
            // 2. apply all values from list
            for (const v of val) {
                this.store.set(this.key(v.row, v.col), v)
            }
            // 3. update
            this.UPDATE()
        })
    }

    get value(): Widget_matrix_value {
        // if (!this.state.active) return undefined
        return this.serial.selected
    }

    private sep = ' &&& '
    private store = new Map<string, Widget_matrix_cell>()
    private key = (row: string, col: string) => `${row}${this.sep}${col}`
    get allCells() { return Array.from(this.store.values()) } // prettier-ignore

    UPDATE = () => {
        this.serial.selected = this.RESULT
        this.bumpValue() // only place to call bumpValue
    }

    /** list of all cells that are ON */
    get RESULT(): Widget_matrix_cell[] {
        return this.allCells.filter((v) => v.value)
    }

    /** whether the first grid cell is ON */
    get firstValue(): boolean {
        return this.allCells[0]?.value ?? false
    }

    setAll = (value: boolean) => {
        for (const v of this.allCells) v.value = value
        this.UPDATE()
        // this.p.set(this.values)
    }

    setRow = (row: string, val: boolean) => {
        for (const v of this.cols) {
            const cell = this.getCell(row, v)
            cell.value = val
        }
        this.UPDATE()
    }

    setCol = (col: string, val: boolean) => {
        for (const r of this.rows) {
            const cell = this.getCell(r, col)
            cell.value = val
        }
        this.UPDATE()
    }

    /** get cell at {rol x col} */
    getCell = (row: string, col: string): Widget_matrix_cell => {
        return bang(this.store.get(this.key(row, col)))
    }

    /** set cell at {rol x col} to given value */
    setCell = (row: string, col: string, value: boolean) => {
        const cell = this.getCell(row, col)
        cell.value = value
        this.UPDATE()
    }
}

// DI
registerWidgetClass('matrix', Widget_matrix)
