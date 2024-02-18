import type { TreeView } from './TreeView'
import { observer } from 'mobx-react-lite'

import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { useSt } from 'src/state/stateContext'
import { TreeViewCtx } from './TreeCtx'
import { TreeEntryUI } from './TreeEntryUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { KEYS } from 'src/app/shortcuts/shorcutKeys'

export const TreeUI = observer(function TreeEditorUI_(p: {
    //
    title?: string
    shortcut?: string
    className?: string
    treeView: TreeView
    autofocus?: boolean
}) {
    const st = useSt()
    const tv = p.treeView

    const FoldBtn = (
        <div className='btn btn-square btn-ghost btn-xs'>
            <span className='material-symbols-outlined'>
                {tv.isFolded ? (
                    <span className='material-symbols-outlined'>keyboard_arrow_right</span>
                ) : (
                    <span className='material-symbols-outlined'>keyboard_arrow_down</span>
                )}
            </span>
        </div>
    )

    return (
        <TreeViewCtx.Provider value={tv}>
            <div tw='_TreeUI flex flex-col' className={p.className}>
                <div tw='flex items-center gap-1 bg-base-300'>
                    <div className='flex flex-1 gap-1 items-center' onClick={() => (tv.isFolded = true)}>
                        {FoldBtn}
                        {p.title && <div tw='text-sm'>{p.title}</div>}
                    </div>
                    {p.shortcut && <ComboUI primary size='xs' combo={p.shortcut} />}
                    <RevealUI trigger={'hover'}>
                        <div
                            tw='btn btn-square btn-ghost btn-xs shrink-0'
                            onClick={() => st.db.tree_entries.updateAll({ isExpanded: null })}
                        >
                            <span className='material-symbols-outlined'>unfold_less</span>
                        </div>
                        <div tw='flex gap-1 whitespace-nowrap p-2'>
                            collapse tree: <ComboUI combo={KEYS.collapseAllTree} />
                        </div>
                    </RevealUI>
                    {/* {FoldBtn} */}
                </div>

                <div
                    //
                    tw='flex-1 overflow-auto'
                    id={tv.tree.KeyboardNavigableDomNodeID}
                    onKeyDown={tv.onKeyDown}
                    tabIndex={-1}
                    autoFocus={p.autofocus}
                >
                    {tv.nodes.map((n) => (
                        <TreeEntryUI key={n.id} node={n} />
                    ))}
                </div>
                {/* <CursorInfoUI es={es} /> */}
            </div>
            {/* <TreeDebugUI /> */}
        </TreeViewCtx.Provider>
    )
})

// {/* <input
//     ⏸️    tw='input input-bordered input-sm flex-grow min-w-0'
//     ⏸️    onChange={(ev) => (es.filter = ev.target.value)}
//     ⏸️    ref={es.filterRef}
//     ⏸️    type='text'
//     ⏸️    placeholder='filter'
//     ⏸️    // style={{ width: '100%', borderRadius: '1rem', margin: '1rem 0', padding: '.2rem .4rem' }}
// /> */}
