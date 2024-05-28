import type { TreeView } from './TreeView'

import { observer } from 'mobx-react-lite'

import { ComboUI } from '../../../../app/shortcuts/ComboUI'
import { KEYS } from '../../../../app/shortcuts/shorcutKeys'
import { Ikon } from '../../../../icons/iconHelpers'
import { RevealUI } from '../../../../rsuite/reveal/RevealUI'
import { TreeViewCtx } from './TreeCtx'
import { TreeEntryUI } from './TreeEntryUI'

export const TreeUI = observer(function TreeEditorUI_(p: {
    //
    title?: string
    shortcut?: string
    className?: string
    treeView: TreeView
    autofocus?: boolean
}) {
    const tv = p.treeView

    return (
        <TreeViewCtx.Provider value={tv}>
            <div tw='_TreeUI flex flex-col' className={p.className}>
                <div tw='flex items-center gap-1'>
                    <div className='flex flex-1 gap-1 items-center'>{p.title && <div tw='text-sm'>{p.title}</div>}</div>
                    {p.shortcut && <ComboUI primary size='xs' combo={p.shortcut} />}
                    <RevealUI
                        trigger={'hover'}
                        content={() => (
                            <div tw='flex gap-1 whitespace-nowrap p-2'>
                                collapse tree: <ComboUI combo={KEYS.collapseAllTree} />
                            </div>
                        )}
                    >
                        {tv.tree.config.updateAll && (
                            <div
                                tw='btn btn-square btn-ghost btn-xs shrink-0'
                                onClick={() => tv.tree.config.updateAll?.({ isExpanded: null })}
                            >
                                <Ikon.mdiUnfoldLessHorizontal />
                            </div>
                        )}
                    </RevealUI>
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
