import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { RenderItemTitleUI } from '../RenderItemTitleUI'
import { useTreeView } from './TreeCtx'
import { TreeNode } from './TreeNode'

export const TreeEntryUI = observer(function TreeEntryUI_(p: { depth?: number; node: TreeNode }) {
    const n = p.node
    const children = n.childKeys
    const hasChildren = children.length > 0
    const tv = useTreeView()
    const selected = tv.at === n
    return (
        <Fragment key={n.id}>
            <div
                id={n.id}
                style={{ paddingLeft: `${p.depth ?? 0}rem` }}
                onClick={() => tv.setAt(n)}
                tw={[
                    // 'py-1',
                    // selected ? 'virtualBorder' : null,
                    {
                        _line: true,
                        _hasChildren: hasChildren,
                        _selected: selected,
                        _opened: n.isOpen,
                        _closed: !n.isOpen,
                    },
                ]}
            >
                {/* {tv.id}
                {tv.at?.id} */}
                {hasChildren ? (
                    <label onClick={() => n.toggle()} className='swap swap-rotate opacity-50'>
                        {n.isOpen ? (
                            <span className='material-symbols-outlined swap-rotate'>keyboard_arrow_down</span>
                        ) : (
                            <>
                                <span className='material-symbols-outlined swap-rotate'>keyboard_arrow_right</span>
                            </>
                        )}
                    </label>
                ) : (
                    <div tw='[width:1.3rem]'>&nbsp;</div>
                )}
                <RenderItemTitleUI node={n} />
            </div>

            {hasChildren && n.isOpen ? ( //
                <div
                    tw='borderLeft'
                    style={{
                        // marginLeft: '.5rem',
                        marginLeft: '.5rem',
                        paddingLeft: '.5rem',
                    }}
                >
                    {n.children.map((c) => (
                        <TreeEntryUI /*depth={(p.depth ?? 0) + 1}*/ key={c.id} node={c} />
                    ))}
                </div>
            ) : null}
        </Fragment>
    )
})
