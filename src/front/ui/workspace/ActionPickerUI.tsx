import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Tree } from 'rsuite'
import { assets } from 'src/front/ui/assets'
import { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { useSt } from '../../FrontStateCtx'
import { useProject } from '../../ProjectCtx'
import { TooltipUI } from '../layout/TooltipUI'
import { TypescriptHighlightedCodeUI } from '../utils/TypescriptHighlightedCodeUI'
import { getIconForFilePath } from '../utils/filePathIcon'
import { SectionTitleUI } from './SectionTitle'

export const ActionPickerUI = observer(function ToolPickerUI_(p: {}) {
    const st = useSt()
    return (
        <div
            //
            className='flex flex-col flex-grow'
            style={{ borderRight: '1px solid #2d2d2d' }}
        >
            <SectionTitleUI label='ACTIONS' className='bg-gray-800 mb-2'>
                <div onClick={() => st.toolbox.findActions()} className='cursor-pointer'>
                    <span className='text-xs material-symbols-outlined'>sync</span>
                </div>
            </SectionTitleUI>
            <FileListUI />
        </div>
    )
})

export const FileListUI = observer(function FileListUI_(p: {}) {
    const st = useSt()
    const pj = useProject()
    const tb = st.toolbox
    return (
        <>
            <Tree
                expandItemValues={tb.expandedPaths}
                tw='overflow-x-hidden overflow-y-auto flex-grow'
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

                    const isFolder = st.toolbox.treeData.find((x) => x.value === value)?.children != null
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

export const FooBarUI = observer(function FooBarUI_(p: {}) {
    const [a, set] = useState<Maybe<string>>(() => null)
    const st = useSt()
    return (
        <div>
            <input
                type='text'
                defaultValue={''}
                onChange={(e) => {
                    const val = e.target.value
                    const json = JSON.parse(val) as ComfyPromptJSON
                    const code = st.importer.convertPromptToCode(json, {
                        title: 'test',
                        author: 'test',
                        preserveId: true,
                        autoUI: true,
                    })
                    set(code)
                }}
            />
            {a && <TypescriptHighlightedCodeUI code={a} />}
        </div>
    )
})

// <div>
// {db.tools.map((tool) => {
//     const action = (
//         <div
//             className='p-1 hover:bg-gray-700 cursor-pointer text-ellipsis overflow-hidden'
//             key={tool.id}
//             onClick={() => pj.focusTool(tool)}
//             style={{
//                 overflow: 'hidden',
//                 whiteSpace: 'nowrap',
//                 background: pj.activeTool.id === tool.id ? '#343e8d' : 'transparent',
//             }}
//         >
//             {tool.data.owner} / {tool.name}
//         </div>
//     )
//     if (tool.data.owner != grup) {
//         grup = tool.data.owner
//         return (
//             <Fragment key={tool.id}>
//                 {/* <div
//                     //
//                     className='flex gap-1 mt-2'
//                     // style={{ borderTop: '1px solid #444444' }}
//                 >
//                     <span className='material-symbols-outlined'>person_outline</span>
//                     {grup}
//                 </div> */}
//                 {action}
//             </Fragment>
//         )
//     }
//     return action
// })}
// {st.tsFilesMap.failures.map((f) => (
//     <Whisper
//         key={f.filePath}
//         enterable
//         speaker={
//             <Popover>
//                 <Message type='error'>{f.error}</Message>
//             </Popover>
//         }
//     >
//         <div
//             style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
//             className='cursor-pointer text-ellipsis overflow-hidden text-red-400 p-1'
//         >
//             {/* <span className='material-symbols-outlined'>error_outline</span> */}
//             {f.filePath}
//         </div>
//     </Whisper>
// ))}
// </div>
