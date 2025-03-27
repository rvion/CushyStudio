/*
 * 🔴 TODO: rewrite as field composite
 */

import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { bang } from '../../utils/bang'
import { registerFieldClass } from '../WidgetUI.DI'

export type Field_matrix_cell = {
   x: number
   y: number
   row: string
   col: string
   value: boolean
}

// CONFIG
export type Field_matrix_config = Field_matrix['ҨConfig']
type Field_matrix_ownConfig = {
   default?: { row: string; col: string }[]
   rows: string[]
   cols: string[]
}

// SERIAL
export type Field_matrix_serial = Field_matrix['ҨSerial']
type Field_matrix_ownSerial = {
   $: 'matrix'
   /** only contains cells that are ONs */
   selected?: Field_matrix_cell[]
}

// VALUE
export type Field_matrix_value = Field_matrix_cell[]
export type Field_matrix_unchecked = Field_matrix_value | undefined

// TYPES
export interface Field_matrix {
   ['ҨType']: 'matrix'
   ['ҨOwnConfig']: Field_matrix_ownConfig
   ['ҨOwnSerial']: Field_matrix_ownSerial
   ['ҨValue']: Field_matrix_value
   ['ҨSetvalue']: Field_matrix_value
   ['ҨUnchecked']: Field_matrix_unchecked
   ['ҨChild']: never
   ['ҨOpts']: unknown
   ['ҨOwnPatch']: Patch<'matrix'>
}

// STATE
export class Field_matrix extends Field {
   static readonly type: 'matrix' = 'matrix'
   private static readonly unsetSerial: Field_matrix_serial = { $: 'matrix' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_matrix_config): string => 'MatrixCell[]'

   static generateSerial(value: Maybe<Field_matrix_value>, config: Field_matrix_config): Field_matrix_serial {
      const selectedValue = value ?? config.default

      if (selectedValue == null) return Field_matrix.unsetSerial

      return {
         $: 'matrix',
         selected: selectedValue.map((v) => ({
            x: config.rows.indexOf(v.row),
            y: config.cols.indexOf(v.col),
            row: v.row,
            col: v.col,
            value: true,
         })),
      }
   }

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_matrix>,
      initialMountKey: string,
      serial?: Field_matrix_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   protected zSetOwnSerial(next: Field_matrix_serial): void {
      this.zAssignNewSerial(next)

      if (next.selected == null && this.zConfig.default == null) return

      const cells = this.zSerial.selected ?? this.zConfig.default ?? []
      const selectedCells = new Set(cells.map(({ row, col }) => this.getCellkey(row, col)))

      // make sure every cell has the right value
      for (const [x, row] of this.zConfig.rows.entries()) {
         for (const [y, col] of this.zConfig.cols.entries()) {
            const cellKey = this.getCellkey(row, col)
            const value = selectedCells.has(cellKey)
            const prev = this.store.get(cellKey)
            if (prev == null) this.store.set(cellKey, { x, y, col, row, value })
            else prev.value = value
         }
      }

      if (this.zSerial.selected?.every((v, index) => v === cells[index])) return
      this.zPatchSerial((draft) => void (draft.selected = this.activeCells))
   }

   // #region VALUE
   /** list of all active cells */
   get zValue(): Field_matrix_value {
      return this.zValue_or_fail
   }

   get zValue_or_fail(): Field_matrix_value {
      if (this.zSerial.selected == null) throw new Error('Field_matrix.zValue_or_fail: field not set')
      return this.zSerial.selected
   }

   get zValue_or_zero(): Field_matrix_value {
      return this.zSerial.selected ?? []
   }

   get zValue_unchecked(): Field_matrix_unchecked {
      return this.zSerial.selected
   }

   /** 🔶 this is inneficient */
   set zValue(val: Field_matrix_value) {
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

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_matrix)) return false
      if (this.zValue.length !== other.zValue.length) return false

      return JSON.stringify(this.zSerial.selected) === JSON.stringify(other.zSerial.selected)
   }

   /** list of all possible row keys */
   get rows(): string[] {
      return this.zConfig.rows
   }

   /** list of all possible colum keys */
   get cols(): string[] {
      return this.zConfig.cols
   }

   // #region validation
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get zIsOwnSet(): boolean {
      return this.zSerial.selected != null
   }

   get zHasChanges(): boolean {
      const def = this.zConfig.default
      if (def == null) return this.zValue.length != 0
      else {
         if (def.length != this.zValue.length) return true
         for (const v of this.zValue) {
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
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => void (draft.selected = this.activeCells))
      })
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

   // #region PATCHES
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['selected'])
}

// DI
registerFieldClass('matrix', Field_matrix)
Field_matrix satisfies FieldConstructor<Field_matrix>
