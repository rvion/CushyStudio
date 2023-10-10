import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { bang } from '../../../utils/bang'

export type CELL = {
    x: number
    y: number
    row: string
    col: string
    value: boolean
}

type WidgetMatrixProps = {
    rows: string[]
    cols: string[]
    get: () => CELL[]
    def?: () => Maybe<CELL>
    set: (v: CELL[]) => void
}

export const WidgetMatrixUI = observer(function WidgetStrUI_(p: WidgetMatrixProps) {
    const uiSt = useMemo(() => new WidgetMatrixState(p), [p])
    return (
        <table cellSpacing={0} cellPadding={0}>
            <thead>
                <tr>
                    <th className='cursor-pointer hover:text-red-600' onClick={() => uiSt.setAll(!uiSt.firstValue)}>
                        all
                    </th>
                    {p.cols.map((col, ix) => (
                        <th
                            //
                            className='bg-blue-700'
                            key={ix}
                            onClick={() => uiSt.setCol(col, !uiSt.get(p.rows[0], col).value)}
                        >
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {p.rows.map((row, rowIx: number) => (
                    <tr key={rowIx} className='p-0 m-0'>
                        <td
                            //
                            onClick={() => uiSt.setRow(row, !uiSt.get(row, p.cols[0]).value)}
                            className='bg-yellow-700'
                        >
                            {row}
                        </td>
                        {p.cols.map((col, colIx: number) => {
                            const checked = uiSt.get(row, col).value
                            return (
                                <td
                                    key={colIx}
                                    className='hover:bg-gray-400 cursor-pointer'
                                    onClick={() => uiSt.set(row, col, !checked)}
                                    style={{
                                        border: '1px solid #726767',
                                        height: '2rem',
                                        width: '2rem',
                                        background: checked ? 'green' : '#1e1e1e',
                                    }}
                                ></td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
})

class WidgetMatrixState {
    private sep = ' &&& '
    private store = new Map<string, CELL>()
    private key = (row: string, col: string) => `${row}${this.sep}${col}`

    get allCells() {
        return Array.from(this.store.values())
    }

    UPDATE = () => this.p.set(this.RESULT)

    get RESULT() {
        return this.allCells.filter((v) => v.value)
    }

    get firstValue() {
        return this.allCells[0]?.value ?? false
    }
    setAll = (value: boolean) => {
        for (const v of this.allCells) v.value = value
        // this.p.set(this.values)
    }
    setRow = (row: string, val: boolean) => {
        for (const v of this.p.cols) {
            const cell = this.get(row, v)
            cell.value = val
        }
        this.UPDATE()
    }
    setCol = (col: string, val: boolean) => {
        for (const r of this.p.rows) {
            const cell = this.get(r, col)
            cell.value = val
        }
        this.UPDATE()
    }
    get = (row: string, col: string): CELL => {
        return bang(this.store.get(this.key(row, col)))
    }
    set = (row: string, col: string, value: boolean) => {
        const cell = this.get(row, col)
        cell.value = value
        this.UPDATE()
    }

    constructor(private p: WidgetMatrixProps) {
        const rows = p.rows
        const cols = p.cols
        const values = p.get() ?? p.def?.()
        // init all cells to false
        for (const [rowIx, row] of rows.entries()) {
            for (const [colIx, col] of cols.entries()) {
                this.store.set(this.key(row, col), { x: rowIx, y: colIx, col, row, value: false })
            }
        }
        // apply default value
        if (values)
            for (const v of values) {
                this.store.set(this.key(rows[v.x], cols[v.y]), v)
            }
        // make observable
        makeAutoObservable(this)
    }
}
