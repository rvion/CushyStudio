import { observer } from 'mobx-react-lite'
import { Tree } from 'src/rsuite/shims'
import { asCardPath } from 'src/cards/CardPath'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { useSt } from '../state/stateContext'
import { TooltipUI } from '../app/layout/TooltipUI'
import { getIconForFilePath } from '../widgets/misc/filePathIcon'
import { assets } from 'src/utils/assets/assets'

export const Panel_FileTree = observer(function Panel_FileTree_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <Tree
            expandItemValues={library.expandedPaths}
            tw='overflow-x-hidden overflow-y-auto flex-grow h-full'
            key={st.library.updatedAt}
            data={st.library.fileTree}
            renderTreeIcon={(x) => {
                return <>{x.expand ? '▿' : '▸'}</>
            }}
            onExpand={(values, node) => {
                const value = node.value as string
                if (library.isExpanded(value)) library.collapse(value)
                else library.expand(value)
            }}
            renderTreeNode={(node) => {
                const isTypechecked = library.isTypeChecked(node.value as string)
                return (
                    <>
                        {node.children ? (
                            <span className='material-symbols-outlined'>folder</span>
                        ) : typeof node.value === 'string' ? (
                            getIconForFilePath(node.value)
                        ) : (
                            '❓'
                        )}{' '}
                        <div tw='text-ellipsis overflow-hidden whitespace-nowrap'>{node.label}</div>
                        <div tw='ml-auto'>
                            {isTypechecked && (
                                <TooltipUI>
                                    <img tw='mr-1' style={{ width: '1rem' }} src={assets.public_typescript_512_png} alt='' />
                                    <div>is being type-checked</div>
                                </TooltipUI>
                            )}
                        </div>
                    </>
                )
            }}
            // renderTreeIcon={() => <>{'>'}</>}
            // value={value}
            onChange={async (_value: any) => {
                if (typeof _value !== 'string') throw new Error('tree selection value is not a string')
                const value = asRelativePath(_value)

                const isFolder = st.library.folderMap.has(value)
                // console.log(_value, `isFolder: ${isFolder}`)
                if (isFolder) {
                    if (library.isExpanded(value)) library.collapse(value)
                    else library.expand(value)
                    return
                    // return console.log(`❌ "${_value}" a folder`)
                }

                const actionPath = asCardPath(value)
                // 1. focus paf
                const paf = st.library.cardsByPath.get(actionPath)
                if (paf == null) throw new Error(`paf not found for ${value}`)
                st.layout.addCard(actionPath)
                // pj.focusActionFile(paf)
                // // 2. if paf has a tool, focus it
                // console.log(value, paf)
                // await paf.load({ logFailures: true })
                // const tool0 = paf.mainTool
                // if (tool0 == null) return null
                // pj.focusTool(tool0)
            }}
        />
    )
})
