import type { TreeNode } from './TreeNode'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { Ikon } from '../icons/iconHelpers'
import { RenderItemTitleUI } from './RenderItemTitleUI'
import { useTreeView } from './TreeCtx'

export const TreeEntryUI = observer(function TreeEntryUI_(p: {
    //
    depth?: number
    node: TreeNode
}) {
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
                onClick={() => tv.setFocusAt(n)}
                tw={[
                    // 'py-1',
                    {
                        _line: true,
                        _hasChildren: hasChildren,
                        _selected: selected,
                        _opened: n.isOpen,
                        _closed: !n.isOpen,
                    },
                ]}
            >
                {/* Item Caret */}
                {hasChildren ? (
                    <label
                        onClick={(ev) => {
                            console.log(`[🤠] ok`, n.isOpen)
                            n.toggle()
                            ev.stopPropagation()
                        }}
                        className='swap swap-rotate opacity-50'
                    >
                        {n.isOpen ? <Ikon.mdiChevronDown /> : <Ikon.mdiChevronRight />}
                    </label>
                ) : (
                    <div tw='[width:1.3rem]'>&nbsp;</div>
                )}

                {/* Item Selection Checkbox */}
                {tv.conf.selectable && <input checked type='checkbox' tw='checkbox' />}

                {/* Tree title */}
                <RenderItemTitleUI node={n} />
            </div>

            {hasChildren && n.isOpen ? ( //
                <div
                    tw='cushy-borderLeft'
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
