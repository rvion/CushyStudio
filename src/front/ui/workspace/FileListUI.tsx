import { observer } from 'mobx-react-lite'
import { Tree } from 'rsuite'
import { assets } from 'src/front/ui/assets'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { useSt } from '../../FrontStateCtx'
import { useProject } from '../../ProjectCtx'
import { TooltipUI } from '../layout/TooltipUI'
import { getIconForFilePath } from '../utils/filePathIcon'

export const FileListUI = observer(function FileListUI_(p: {}) {
    const st = useSt()
    const pj = useProject()
    const tb = st.toolbox
    return (
        <>
            <Tree
                expandItemValues={tb.expandedPaths}
                tw='overflow-x-hidden overflow-y-auto flex-grow h-full'
                key={st.toolbox.updatedAt}
                data={st.toolbox.treeData}
                renderTreeIcon={(x) => {
                    return <>{x.expand ? '▿' : '▸'}</>
                }}
                onExpand={(values, node) => {
                    const value = node.value as string
                    if (tb.isExpanded(value)) tb.collapse(value)
                    else tb.expand(value)
                }}
                renderTreeNode={(node) => {
                    const isExpanded = tb.isExpanded(node.value as string)
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
                                {isExpanded && (
                                    <TooltipUI>
                                        <img tw='mr-1' style={{ width: '1rem' }} src={assets.tsLogo} alt='' />
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
                    const value = _value as string

                    const isFolder = st.toolbox.folderMap.has(_value)
                    console.log(_value, `isFolder: ${isFolder}`)
                    if (isFolder) {
                        if (tb.isExpanded(value)) tb.collapse(value)
                        else tb.expand(value)
                        return
                        // return console.log(`❌ "${_value}" a folder`)
                    }

                    // 1. focus paf
                    const paf = st.toolbox.filesMap.get(asRelativePath(value))
                    if (paf == null) throw new Error(`paf not found for ${value}`)
                    pj.focusActionFile(paf)

                    // 2. if paf has a tool, focus it
                    console.log(value, paf)
                    await paf.load({ logFailures: true })
                    const tool0 = paf.mainTool
                    if (tool0 == null) return null
                    pj.focusTool(tool0)
                }}
            />
        </>
    )
})
