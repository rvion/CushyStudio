import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { bang } from '../../utils/bang'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetMatrixUI } from './WidgetMatrixUI'

export type Field_matrix_cell = {
    x: number
    y: number
    row: string
    col: string
    value: boolean
}

// CONFIG
export type Field_matrix_config = FieldConfig<
    {
        default?: { row: string; col: string }[]
        rows: string[]
        cols: string[]
    },
    Field_matrix_types
>

// SERIAL
export type Field_matrix_serial = FieldSerial<{
    $: 'matrix'
    /** only contains cells that are ONs */
    selected: Field_matrix_cell[]
}>

// VALUE
export type Field_matrix_value = Field_matrix_cell[]

// TYPES
export type Field_matrix_types = {
    $Type: 'matrix'
    $Config: Field_matrix_config
    $Serial: Field_matrix_serial
    $Value: Field_matrix_value
    $Field: Field_matrix
}

// STATE
export class Field_matrix extends Field<Field_matrix_types> {
    static readonly type: 'matrix' = 'matrix'

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_matrix>,
        serial?: Field_matrix_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    DefaultHeaderUI = WidgetMatrixUI
    DefaultBodyUI = undefined

    /** this method must be idem-potent */
    protected setOwnSerial(serial: Maybe<Field_matrix_serial>): void {
        const { rows, cols, default: defs } = this.config

        // 1. create a set with all cellKeys that should be ON
        let selectedCells: Set<string>
        if (serial != null) selectedCells = new Set(serial.selected.map(({ row, col, value }) => this.getCellkey(row, col)))
        else if (defs != null) selectedCells = new Set(defs.map(({ row, col }) => this.getCellkey(row, col)))
        else selectedCells = new Set()

        // 2. make sure every cell has the right value
        for (const [x, row] of rows.entries()) {
            for (const [y, col] of cols.entries()) {
                const cellKey = this.getCellkey(row, col)
                const value = selectedCells.has(cellKey)
                const prev = this.store.get(cellKey)
                if (prev == null) this.store.set(cellKey, { x, y, col, row, value })
                else prev.value = value
            }
        }

        this.serial.selected = this.activeCells
    }

    /** list of all active cells */
    get value(): Field_matrix_value {
        return this.serial.selected
    }

    /** 🔶 this is inneficient */
    set value(val: Field_matrix_value) {
        runInAction(() => {
            // 1. reset all cells to false
            for (const c of this.allCells) {
                c.value = false
            }
            // 2. apply all values from list
            for (const v of val) {
                this.store.set(this.getCellkey(v.row, v.col), v)
            }
            // 3. update
            this.UPDATE()
        })
    }

    /** list of all possible row keys */
    get rows(): string[] {
        return this.config.rows
    }

    /** list of all possible colum keys */
    get cols(): string[] {
        return this.config.cols
    }

    get ownProblems(): Problem_Ext {
        return null
    }

    get hasChanges(): boolean {
        const def = this.config.default
        if (def == null) return this.value.length != 0
        else {
            if (def.length != this.value.length) return true
            for (const v of this.value) {
                if (!def.find((d) => d.row == v.row && d.col == v.col)) return true
            }
            return false
        }
    }

    /** store of all active cells */
    private store = new Map<string, Field_matrix_cell>()

    /** return some unique string from a tupple [row: string, col: string] */
    private getCellkey(row: string, col: string): string {
        return `${row} &&& ${col}`
    }

    /** return all cells, regardless of if they're on or off */
    get allCells(): Field_matrix_cell[] {
        return Array.from(this.store.values())
    }

    /**
     * Internal method to update serial from the live list of active cells
     * every setter should update this
     */
    private UPDATE(): void {
        this.runInValueTransaction(() => (this.serial.selected = this.activeCells))
    }

    /** list of all cells that are active/on */
    get activeCells(): Field_matrix_cell[] {
        return this.allCells.filter((v) => v.value)
    }

    /** whether the first grid cell is ON */
    get firstValue(): boolean {
        return this.allCells[0]?.value ?? false
    }

    /** set every cell in the matrix field to the given value `<value>`  */
    setAll(value: boolean): void {
        for (const v of this.allCells) v.value = value
        this.UPDATE()
        // this.p.set(this.values)
    }

    /** set all cells in given row `<row>` to value `<val>`  */
    setRow(row: string, val: boolean): void {
        for (const v of this.cols) {
            const cell = this.getCell(row, v)
            cell.value = val
        }
        this.UPDATE()
    }

    /** set all cells in given column `<col>` to value `<val>`  */
    setCol(col: string, val: boolean): void {
        for (const r of this.rows) {
            const cell = this.getCell(r, col)
            cell.value = val
        }
        this.UPDATE()
    }

    /** get cell at {rol x col} */
    getCell(row: string, col: string): Field_matrix_cell {
        return bang(this.store.get(this.getCellkey(row, col)))
    }

    /** set cell at {rol x col} to given value */
    setCell(row: string, col: string, value: boolean): void {
        const cell = this.getCell(row, col)
        cell.value = value
        this.UPDATE()
    }
}

// DI
registerFieldClass('matrix', Field_matrix)
