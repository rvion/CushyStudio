import { readdirSync, statSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { FormEvent, useCallback, useMemo, useRef, useState } from 'react'
import { Tree, TreeDataProvider, TreeItem, TreeItemIndex, TreeRef, UncontrolledTreeEnvironment } from 'react-complex-tree'
import { Library } from 'src/cards/Library'
import { LibraryFile } from 'src/cards/LibraryFile'
import { asAppPath } from 'src/cards/asAppPath'
import { useSt } from 'src/state/stateContext'
import { asRelativePath } from 'src/utils/fs/pathUtils'

export const Tree1 = observer(() => {
    const st = useSt()
    const tdp = useMemo(() => new MyTreeDataProvider(st.library), [st.library])

    // --------------------------------------------------------------

    const [search, setSearch] = useState('')
    const tree = useRef<TreeRef>(null)
    // const dataProvider = useMemo(
    //     () =>
    //         new StaticTreeDataProvider(longTree.items, (item, data) => ({
    //             ...item,
    //             data,
    //         })),
    //     [],
    // )

    const findItemPath = useCallback(
        async (search: string, searchRoot: TreeItemIndex = 'root'): Promise<Maybe<TreeItemIndex[]>> => {
            const item = await tdp.getTreeItem(searchRoot)
            if (item.data.toLowerCase().includes(search.toLowerCase())) return [item.index]
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

    // --------------------------------------------------------------
    return (
        <div tw='h-96'>
            <UncontrolledTreeEnvironment
                //
                viewState={{}}
                dataProvider={tdp}
                getItemTitle={(item) => {
                    console.log(`[🌲] >> item`, item)
                    return item.data
                }}
            >
                <Tree treeId='tree-2' rootItem='library/CushyStudio' />
            </UncontrolledTreeEnvironment>
        </div>
    )
})

class LibraryFolder {
    constructor(public path: string) {}
    getChildren = (): RelativePath[] => {
        const files = readdirSync(this.path)
        return files.map((file) => asRelativePath(`${this.path}/${file}`))
    }
}
type MyTreeItem = LibraryFile | LibraryFolder

class MyTreeDataProvider implements TreeDataProvider<string> {
    constructor(private library: Library) {
        console.log(`[🌲] OK`)
    }
    // onDidChangeTreeData?: ((listener: (changedItemIds: TreeItemIndex[]) => void) => Disposable) | undefined
    getTreeItem = (itemId: TreeItemIndex): Promise<TreeItem<string>> => {
        if (typeof itemId !== 'string') throw new Error(`[👙] itemId must be string`)
        const path = asRelativePath(itemId)
        console.log(`[🌲] << item`, path)
        // ----------
        // if (!statSync(authorPath).isDirectory()) continue
        const stats = statSync(path)
        const isFolder = stats.isDirectory()
        if (isFolder) {
            const lf = new LibraryFolder(path)
            // const appPath = asAppPath(path)
            // const app = this.library.getFile(appPath)!
            const children = lf.getChildren()
            const item: TreeItem<string> = {
                index: path,
                isFolder: true,
                data: path,
                children: children,
            }
            console.log(`[🌲] folder`, item, item.data)
            return Promise.resolve(item)

            // return Promise.reject()
        } else {
            // -----------
            // const appPath = asAppPath(path)
            // const app = this.library.getFile(appPath)!
            console.log(`[🌲] app`, app)
            const item: TreeItem<string> = {
                index: path,
                data: path,
                children: [],
            }
            return Promise.resolve(item)
        }
    }
    // getTreeItems = (itemIds: TreeItemIndex[]): Promise<TreeItem<any>[]> => {
    //     console.log(`[🌲] items`, itemIds)
    //     return Promise.resolve([])
    // }
    // onRenameItem?: ((item: TreeItem<LibraryFile>, name: string) => Promise<void>) | undefined
    // onChangeItemChildren?: ((itemId: TreeItemIndex, newChildren: TreeItemIndex[]) => Promise<void>) | undefined
}
