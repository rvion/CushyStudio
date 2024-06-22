import type { Widget_matrix } from './WidgetMatrix'

import { observer } from 'mobx-react-lite'

export const WidgetMatrixUI = observer(function WidgetStrUI_(p: { widget: Widget_matrix }) {
    const widget = p.widget
    const cols = widget.cols
    const rows = widget.rows
    if (cols.length === 0) return <div>❌ no cols</div>
    if (rows.length === 0) return <div>❌ no rows</div>
    return (
        <>
            <table cellSpacing={0} cellPadding={0}>
                <thead>
                    <tr>
                        <th
                            //
                            className='cursor-pointer hover:text-red-600'
                            onClick={() => widget.setAll(!widget.firstValue)}
                        >
                            all
                        </th>
                        {cols.map((col, ix) => (
                            <th
                                //
                                className=''
                                key={ix}
                                onClick={() => widget.setCol(col, !widget.getCell(rows[0]!, col).value)}
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
                                onClick={() => widget.setRow(row, !widget.getCell(row, cols[0]!).value)}
                                className='cursor-pointer'
                            >
                                {row}
                            </td>
                            {cols.map((col, colIx: number) => {
                                const checked = widget.getCell(row, col).value
                                return (
                                    <td
                                        key={colIx}
                                        className='hover:bg-gray-400 cursor-pointer'
                                        onClick={() => widget.setCell(row, col, !checked)}
                                        tw={[checked ? undefined : '']}
                                        style={{
                                            background: checked ? 'oklch(var(--p)/.5)' : undefined,
                                            height: '2rem',
                                            width: '2rem',
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
