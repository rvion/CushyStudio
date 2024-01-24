import { useMemo } from 'react'

import { observer } from 'mobx-react-lite'

import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { useSt } from 'src/state/stateContext'
import { Tree } from './Tree'
import { TreeViewCtx } from './TreeCtx'
import { TreeEntryUI } from './TreeEntryUI'
import { TreeView } from './TreeView'

export const TreeUI = observer(function TreeEditorUI_(p: { title?: string; shortcut?: string; className?: string; tree: Tree }) {
    const st = useSt()
    const es = useMemo(() => new TreeView(p.tree), [p.tree])

    return (
        <TreeViewCtx.Provider value={es}>
            <div tw='virtualBorder _TreeUI' className={p.className}>
                <div tw='flex items-center pl-1 gap-2 bg-primary-1'>
                    {/* <div tw='italic opacity-50'>{es.tree.nodes.length} nodes</div> */}
                    {p.title && <div tw='font-bold'>{p.title}</div>}
                    {/* <input
                    ⏸️    tw='input input-bordered input-sm flex-grow min-w-0'
                    ⏸️    onChange={(ev) => (es.filter = ev.target.value)}
                    ⏸️    ref={es.filterRef}
                    ⏸️    type='text'
                    ⏸️    placeholder='filter'
                    ⏸️    // style={{ width: '100%', borderRadius: '1rem', margin: '1rem 0', padding: '.2rem .4rem' }}
                /> */}
                    <div className='flex-1'></div>
                    {p.shortcut && <ComboUI combo={p.shortcut} />}
                    <div
                        tw='btn btn-square btn-ghost btn-sm shrink-0'
                        onClick={() => st.db.tree_entries.updateAll({ isExpanded: null })}
                    >
                        <span className='material-symbols-outlined'>unfold_less</span>
                    </div>
                </div>
                <div id={p.tree.KeyboardNavigableDomNodeID} onKeyDown={es.onKeyDown} tabIndex={-1}>
                    {es.nodes.map((n) => (
                        <TreeEntryUI key={n.id} node={n} />
                    ))}
                </div>
                {/* <CursorInfoUI es={es} /> */}
            </div>
            {/* <TreeDebugUI /> */}
        </TreeViewCtx.Provider>
    )
})
