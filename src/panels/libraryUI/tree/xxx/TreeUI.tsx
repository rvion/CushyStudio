import { useMemo } from 'react'

import { observer } from 'mobx-react-lite'

import { TreeViewCtx } from './TreeCtx'
import { TreeView } from './TreeView'
import { Tree } from './Tree'
import { TreeEntryUI } from './TreeEntryUI'
import { TreeDebugUI } from './TreeDebugUI'
// import { treeCSS } from './treeCSS'
// import { LineUI } from './LineUI'
// import { CursorInfoUI } from './CursorInfo'

export const TreeUI = observer(function TreeEditorUI_(p: { tree: Tree }) {
    const es = useMemo(() => new TreeView(p.tree), [p.tree])

    return (
        <TreeViewCtx.Provider value={es}>
            <div className='boxed'>
                {/* <h3>Editor</h3> */}
                {/* <input
                    onChange={(ev) => (es.filter = ev.target.value)}
                    ref={es.filterRef}
                    type='text'
                    placeholder='filter'
                    style={{ width: '100%', borderRadius: '1rem', margin: '1rem 0', padding: '.2rem .4rem' }}
                /> */}
                <div className='w-full'>
                    {/* {es.at?.id} */}
                    <div onKeyDown={es.onKeyDown} tabIndex={-1}>
                        <div /*css={treeCSS}*/>
                            {es.nodes.map((n) => (
                                // <div key={n.id}>{n.id}</div>
                                <TreeEntryUI key={n.id} node={n} />
                            ))}
                        </div>
                    </div>
                    {/* <CursorInfoUI es={es} /> */}
                </div>
            </div>
            {/* {es.tree.nodes.length} */}
            {/* <TreeDebugUI /> */}
        </TreeViewCtx.Provider>
    )
})

// ▲ △
// ▼ ▽
// ◀ ◁
// ▶ ▷
