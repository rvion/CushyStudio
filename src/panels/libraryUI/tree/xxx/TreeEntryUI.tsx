import './Tree.css'
import { observer } from 'mobx-react-lite'
import { Node } from './Node'
import { useTreeView } from './TreeCtx'
import { Fragment } from 'react'
import { RenderItemTitleUI } from '../RenderItemTitleUI'

export const TreeEntryUI = observer(function TreeEntryUI_(p: { depth?: number; node: Node }) {
    const n = p.node
    const children = n.children
    const hasChildren = children.length > 0
    const tv = useTreeView()
    const selected = tv.at === n

    return (
        <Fragment key={n.id}>
            <div
                style={{ paddingLeft: `${p.depth ?? 0}rem` }}
                onClick={() => tv.focus(n)}
                tw={[
                    // 'py-1',
                    // selected ? 'virtualBorder' : null,
                    {
                        _line: true,
                        _hasChildren: hasChildren,
                        _selected: selected,
                        _opened: n.opened,
                        _closed: !n.opened,
                    },
                ]}
            >
                {/* {tv.id}
                {tv.at?.id} */}
                <label className='swap swap-rotate opacity-50'>
                    {n.opened ? (
                        <span className='material-symbols-outlined swap-rotate'>keyboard_arrow_down</span>
                    ) : (
                        <>
                            <span className='material-symbols-outlined swap-rotate'>keyboard_arrow_right</span>
                        </>
                    )}
                </label>
                <RenderItemTitleUI item={n.data} />

                {/* <TreeKeyUI node={n} /> */}
                {/* <TreeValueUI node={n} /> */}
                {/* <TreeTypeUI node={n} /> */}
                {/* <span>{n.id}</span> */}
            </div>
            {children.length && n.opened ? ( //
                <div
                    tw='borderLeft'
                    //
                    style={{
                        //
                        // borderLeft: '1px solid red',
                        marginLeft: '.5rem',
                    }}
                >
                    {children.map((c) => (
                        <TreeEntryUI /*depth={(p.depth ?? 0) + 1}*/ key={c.id} node={c} />
                    ))}
                </div>
            ) : null}
        </Fragment>
    )
})
