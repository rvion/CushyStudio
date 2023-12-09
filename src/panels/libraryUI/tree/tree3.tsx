import { statSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { FormEvent, useCallback, useMemo, useRef, useState } from 'react'
import { Tree, TreeDataProvider, TreeItem, TreeItemIndex, TreeRef, UncontrolledTreeEnvironment } from 'react-complex-tree'
import { asAppPath } from 'src/cards/asAppPath'
import { DraftL } from 'src/models/Draft'
import { STATE } from 'src/state/state'
import { useSt } from 'src/state/stateContext'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { RenderItemTitleUI } from './RenderItemTitleUI'
import { TreeDraft } from './TreeDraft'
import { ITreeEntry, TreeEntry } from './TreeEntry'
import { TreeError } from './TreeError'
import { TreeFavorite } from './TreeFavorites'
import { TreeFile } from './TreeFile'
import { TreeFolder } from './TreeFolder'
import { TreeRoot } from './TreeRoot'
import { nanoid } from 'nanoid'

export const Tree3 = observer(() => {
    const st = useSt()
    const tdp = useMemo(() => new MyTreeDataProvider(st, {}), [st])
    const [search, setSearch] = useState('')
    const tree = useRef<TreeRef>(null)
    const findItemPath = useCallback(
        async (search: string, searchRoot: TreeItemIndex = '#root'): Promise<Maybe<TreeItemIndex[]>> => {
            const item = await tdp.getTreeItem(searchRoot)
            if (item.data.name.toLowerCase().includes(search.toLowerCase())) return [item.index]
            const searchedItems = await Promise.all(item.children?.map((child) => findItemPath(search, child)) ?? [])
            const result = searchedItems.find((item) => item !== null)
            if (!result) return null
            return [item.index, ...result]
        },
        [tdp],
    )
    const find = useCallback(
        (e: FormEvent) => {
            e.preventDefault()
            if (search) {
                findItemPath(search).then((path) => {
                    console.log(`[👙] path`, path)
                    if (path) {
                        tree.current?.expandSubsequently(path.slice(0, path.length - 1)).then(() => {
                            tree.current?.selectItems([path[path.length - 1]])
                            tree.current?.focusItem(path[path.length - 1])
                        })
                    }
                })
            }
        },
        [findItemPath, search],
    )

    return (
        <div tw='bg-base-100 flex-grow flex-col text-base-content overflow-hidden'>
            <form onSubmit={find} tw='flex'>
                {/* <button type='submit'>Find item</button> */}
                <input
                    tw='input input-sm input-bordered flex-grow min-w-0'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search...'
                />
                {/* Expand All */}
                {/* <div tw='btn btn-sm btn-square' onClick={() => tree.current?.expandAll()}>
                    <span className='material-symbols-outlined'>expand_more</span>
                </div> */}
                {/* Collapse All */}
                <div tw='btn btn-sm btn-square' onClick={() => tree.current?.collapseAll()}>
                    <span className='material-symbols-outlined'>expand_less</span>
                </div>
            </form>

            <UncontrolledTreeEnvironment<ITreeEntry>
                dataProvider={tdp}
                autoFocus
                getItemTitle={(item) => item.data.name}
                viewState={{
                    'tree-1': {
                        expandedItems: ['#favorites'],
                    },
                }}
                canDragAndDrop
                disableMultiselect
                onPrimaryAction={(item) => item.data.onSelect?.()}
                onStartRenamingItem={(item) => console.log(`[👙] renaming`)}
                canDrag={(item) => true}
                renderItemTitle={(x) => <RenderItemTitleUI item={x.item} context={x.context} info={x.info} title={x.title} />}
                canRename
                // onExpandItem={() => {
                //     console.log(`[👙] `)
                // }}
            >
                <Tree
                    //
                    ref={tree}
                    treeId='tree-1'
                    rootItem='#root'
                    treeLabel='Tree Example'
                />
            </UncontrolledTreeEnvironment>
        </div>
    )
})

class MyTreeDataProvider implements TreeDataProvider<any> {
    constructor(private st: STATE, private items: Record<string, TreeItem<TreeEntry>>) {
        //
    }

    getTreeItem = (itemId: TreeItemIndex): Promise<TreeItem<TreeEntry>> => {
        if (typeof itemId !== 'string') {
            throw new Error(`[🔴] itemId must be string`)
        }
        if (itemId === '#root') {
            return Promise.resolve(new TreeRoot())
        }
        if (itemId === '#favorites') {
            return Promise.resolve(new TreeFavorite(this.st))
        }
        if (itemId.startsWith('favorite#')) {
            return Promise.resolve(new TreeFile(this.st, itemId, asAppPath(itemId.slice('favorite#'.length))))
        }
        if (itemId.startsWith('draft#')) {
            const draftId = itemId.slice('draft#'.length)
            const draft: Maybe<DraftL> = this.st.db.drafts.get(draftId)
            if (!draft) return Promise.resolve(new TreeError(`Draft ${draftId} not found`))
            return Promise.resolve(new TreeDraft(this.st, draft))
        }

        if (itemId.startsWith('path#')) {
            const path = asRelativePath(itemId.slice('path#'.length))
            console.log(`[🌲] << item`, path)

            // 1. folder----------

            const stats = statSync(path)
            const isFSFolder = stats.isDirectory()
            if (isFSFolder) return Promise.resolve(new TreeFolder(path))

            // 2. file -----------
            return Promise.resolve(new TreeFile(this.st, itemId, path))
        }
        console.log(`[👙] `, `file ${itemId} not found`)
        return Promise.resolve(new TreeError(`file ${itemId} not found`))
    }
}
