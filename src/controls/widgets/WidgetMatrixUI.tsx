import { observer } from 'mobx-react-lite'
import { Widget_matrix } from 'src/controls/Widget'

export const WidgetMatrixUI = observer(function WidgetStrUI_(p: { widget: Widget_matrix }) {
    const req = p.widget
    const cols = req.cols
    const rows = req.rows
    const collapsed = req.state.collapsed
    // if (collapsed)
    //     return (
    //         <Button appearance='subtle' tw='' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
    //             {collapsed ? '▸' : '▿'}
    //         </Button>
    //     )
    return (
        <>
            {/* <Button appearance='subtle' tw='' size='xs' onClick={() => (req.state.collapsed = !Boolean(req.state.collapsed))}>
                {collapsed ? '▸' : '▿'}
            </Button> */}
            <table cellSpacing={0} cellPadding={0}>
                <thead>
                    <tr>
                        <th
                            //
                            className='cursor-pointer hover:text-red-600'
                            onClick={() => req.setAll(!req.firstValue)}
                        >
                            all
                        </th>
                        {cols.map((col, ix) => (
                            <th
                                //
                                className='bg-accent text-accent-content'
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
                                className='bg-base-300 text-secondary-content bg-secondary cursor-pointer'
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
                                        tw={[checked ? 'bg-success' : 'bg-base-200']}
                                        style={{
                                            border: '1px solid #726767',
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
