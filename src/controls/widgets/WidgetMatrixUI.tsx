import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { bang } from '../../utils/misc/bang'
import { Widget_matrix } from 'src/controls/Widget'
import { Button } from 'src/rsuite/shims'

export type CELL = {
    x: number
    y: number
    row: string
    col: string
    value: boolean
}

export const WidgetMatrixUI = observer(function WidgetStrUI_(p: { req: Widget_matrix }) {
    const req = p.req
    const cols = req.cols
    const rows = req.rows
    const collapsed = req.state.collapsed
    if (collapsed)
        return (
            <Button appearance='subtle' tw='' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                {collapsed ? '▸' : '▿'}
            </Button>
        )
    return (
        <>
            <Button appearance='subtle' tw='' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                {collapsed ? '▸' : '▿'}
            </Button>
            <table cellSpacing={0} cellPadding={0}>
                <thead>
                    <tr>
                        <th className='cursor-pointer hover:text-red-600' onClick={() => req.setAll(!req.firstValue)}>
                            all
                        </th>
                        {cols.map((col, ix) => (
                            <th
                                //
                                className='bg-blue-700'
                                key={ix}
                                onClick={() => req.setCol(col, !req.get(rows[0], col).value)}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIx: number) => (
                        <tr key={rowIx} className='p-0 m-0'>
                            <td
                                //
                                onClick={() => req.setRow(row, !req.get(row, cols[0]).value)}
                                className='bg-yellow-700'
                            >
                                {row}
                            </td>
                            {cols.map((col, colIx: number) => {
                                const checked = req.get(row, col).value
                                return (
                                    <td
                                        key={colIx}
                                        className='hover:bg-gray-400 cursor-pointer'
                                        onClick={() => req.set(row, col, !checked)}
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
        </>
    )
})
