import { useMemo } from 'react'

import { observer } from 'mobx-react-lite'

import { useSt } from 'src/state/stateContext'
import { Tree } from './Tree'
import { TreeViewCtx } from './TreeCtx'
import { TreeEntryUI } from './TreeEntryUI'
import { TreeView } from './TreeView'
import { TreeUIKeyboardNavigableRootID } from './TreeUIKeyboardNavigableRootID'

export const TreeUI = observer(function TreeEditorUI_(p: { tree: Tree }) {
    const st = useSt()
    const es = useMemo(() => new TreeView(p.tree), [p.tree])

    return (
        <TreeViewCtx.Provider value={es}>
            <div className='boxed _TreeUI'>
                <div tw='flex'>
                    {/* <input
                    ⏸️    tw='input input-bordered input-sm flex-grow min-w-0'
                    ⏸️    onChange={(ev) => (es.filter = ev.target.value)}
                    ⏸️    ref={es.filterRef}
                    ⏸️    type='text'
                    ⏸️    placeholder='filter'
                    ⏸️    // style={{ width: '100%', borderRadius: '1rem', margin: '1rem 0', padding: '.2rem .4rem' }}
                    /> */}
                    <div className='flex-1'></div>
                    <div
                        tw='btn btn-square btn-ghost btn-sm shrink-0'
                        onClick={() => {
                            st.db.tree_entries.updateAll({ isExpanded: null })
                        }}
                    >
                        <span className='material-symbols-outlined'>unfold_less</span>
                    </div>
                </div>
                <div className='w-full'>
                    <div id={TreeUIKeyboardNavigableRootID} onKeyDown={es.onKeyDown} tabIndex={-1}>
                        <div>
                            {es.nodes.map((n) => (
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
