// import { observer } from 'mobx-react-lite'
// import { FormEvent, useCallback, useRef, useState } from 'react'
// import { ControlledTreeEnvironment, Tree, TreeItemIndex, TreeRef, TreeRenderProps } from 'react-complex-tree'
// import { useSt } from 'src/state/stateContext'
// import { RenderItemTitleUI } from './RenderItemTitleUI'
// import { ITreeEntry } from './TreeEntry'
// import { TreeRoot } from './nodes/TreeRoot'
// import { PropsOf } from 'src/panels/router/Layout'

// export const Tree3 = observer(() => {
//     const st = useSt()
//     const tdp = st.tree // useMemo(() => new TreeState(st), [st])
//     const [search, setSearch] = useState('')
//     const tree = useRef<TreeRef>(null)
//     const findItemPath = useCallback(
//         async (search: string, searchRoot: TreeItemIndex = '#root'): Promise<Maybe<TreeItemIndex[]>> => {
//             const item = await tdp.getTreeItem(searchRoot)
//             if (item.data.name.toLowerCase().includes(search.toLowerCase())) return [item.index]
//             const searchedItems = await Promise.all(item.children?.map((child) => findItemPath(search, child)) ?? [])
//             const result = searchedItems.find((item) => item !== null)
//             if (!result) return null
//             return [item.index, ...result]
//         },
//         [tdp],
//     )
//     const find = useCallback(
//         (e: FormEvent) => {
//             e.preventDefault()
//             if (search) {
//                 findItemPath(search).then((path) => {
//                     console.log(`[👙] path`, path)
//                     if (path) {
//                         tree.current?.expandSubsequently(path.slice(0, path.length - 1)).then(() => {
//                             tree.current?.selectItems([path[path.length - 1]])
//                             tree.current?.focusItem(path[path.length - 1])
//                         })
//                     }
//                 })
//             }
//         },
//         [findItemPath, search],
//     )

//     return (
//         <div tw='flex flex-col flex-grow text-base-content overflow-hidden'>
//             <form onSubmit={find} tw='flex'>
//                 {/* <button type='submit'>Find item</button> */}
//                 <input
//                     tw='input input-sm input-bordered flex-grow min-w-0'
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder='Search...'
//                 />
//                 {/* Expand All */}
//                 {/* <div tw='btn btn-sm btn-square' onClick={() => tree.current?.expandAll()}>
//                     <span className='material-symbols-outlined'>expand_more</span>
//                 </div> */}
//                 {/* Collapse All */}
//                 <div tw='btn btn-sm btn-square' onClick={() => tree.current?.collapseAll()}>
//                     <span className='material-symbols-outlined'>expand_less</span>
//                 </div>
//             </form>

//             {/* <pre tw='absolute text-xs whitespace-pre-wrap'>{JSON.stringify(st.tree.tree1State.expandedItems)}</pre> */}
//             <ControlledTreeEnvironment<ITreeEntry>
//                 // state
//                 items={st.tree.items}
//                 viewState={st.tree.viewState}
//                 // capabilities
//                 canDragAndDrop
//                 canDrag={(item) => true}
//                 canRename
//                 // UI
//                 autoFocus
//                 getItemTitle={(item) => item.data.name}
//                 renderItemTitle={(x) => <RenderItemTitleUI item={x.item} context={x.context} info={x.info} title={x.title} />}
//                 renderItem={(x) => <RenderItemUI {...x} />}
//                 renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}
//                 // impl
//                 onStartRenamingItem={(item) => console.log(`[👙] renaming`)}
//                 onPrimaryAction={(item) => item.data.onPrimaryAction?.()}
//                 onFocusItem={st.tree.onFocusItem}
//                 onSelectItems={st.tree.onSelectItems}
//                 onExpandItem={st.tree.onExpandItem}
//                 onCollapseItem={st.tree.onCollapseItem}
//                 onMissingItems={st.tree.onMissingIndex}
//                 // onFocusItem={st.setFocusedItem}
//                 // onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
//                 // onCollapseItem={(item) =>
//                 //     setExpandedItems(expandedItems.filter((expandedItemIndex) => expandedItemIndex !== item.index))
//                 // }
//                 // onSelectItems={(items) => setSelectedItems(items)}
//             >
//                 <Tree
//                     //
//                     ref={tree}
//                     treeId='tree-1'
//                     rootItem='#root'
//                     treeLabel='Tree Example'
//                 />
//             </ControlledTreeEnvironment>
//         </div>
//     )
// })

// type TT = PropsOf<NonNullable<TreeRenderProps['renderItem']>>

// export const RenderItemUI = observer(function RenderItemUI_(p: TT) {
//     const { title, arrow, depth, context, children, info, item } = p
//     console.log(`[🌲] >> context`, item.index, context.isExpanded)

//     return (
//         <li {...context.itemContainerWithChildrenProps}>
//             <div
//                 //
//                 {...context.itemContainerWithoutChildrenProps}
//                 {...context.interactiveElementProps}
//                 tw='flex flex-grow'
//             >
//                 {arrow}
//                 {title}
//             </div>
//             {children}
//         </li>
//     )
// })
