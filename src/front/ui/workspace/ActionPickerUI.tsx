import { observer } from 'mobx-react-lite'
import { Fragment, useState } from 'react'
import { Button, InputGroup, Message, Popover, SelectPicker, Tree, Whisper } from 'rsuite'
import { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import { useSt } from '../../FrontStateCtx'
import { useProject } from '../../ProjectCtx'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { getIconForFilePath } from './filePathIcon'
import { asAbsolutePath } from '../../../utils/fs/pathUtils'

export const ActionPickerUI = observer(function ToolPickerUI_(p: {}) {
    const st = useSt()
    const pj = useProject()
    const db = st.db
    const tools = st.toolsSorted
    // let grup = ''
    // const [value, setValue] = useState([])
    // st.tsFilesMap.renderTree()
    return (
        <div className='flex flex-col flex-grow'>
            {/*  */}
            {/* <InputGroup> */}
            {/* <InputGroup.Addon className='bg-black'>
                    <span className='material-symbols-outlined'>search</span>
                </InputGroup.Addon> */}
            <SelectPicker
                // className='grow'
                data={tools}
                labelKey='name'
                valueKey='id'
                value={pj.data.activeToolID}
                onChange={(v) => {
                    if (v == null) return
                    const tool = db.tools.getOrThrow(v)
                    pj.focusTool(tool)
                }}
            />
            {/* </InputGroup> */}
            <FileListUI />
        </div>
    )
})

export const FileListUI = observer(function FileListUI_(p: {}) {
    const st = useSt()
    const pj = useProject()
    return (
        <>
            <Button size='sm' startIcon={<span className='material-symbols-outlined'>sync</span>}>
                Reload
            </Button>
            {/* {st.tsFilesMap.filesMap.size} */}
            {/* {JSON.stringify(st.tsFilesMap.treeData, null, 3)} */}
            <Tree
                // height={'900'}
                defaultExpandAll
                className='overflow-x-hidden overflow-y-auto flex-grow'
                key={st.toolbox.filesMap.size}
                data={st.toolbox.treeData}
                renderTreeNode={(node) => {
                    // console.log(node)
                    return (
                        <>
                            {node.children ? (
                                <span className='material-symbols-outlined'>folder</span>
                            ) : typeof node.value === 'string' ? (
                                getIconForFilePath(node.value)
                            ) : (
                                '❓'
                            )}{' '}
                            {/* <span className='text-ellipsis overflow-hidden whitespace-nowrap'> */}
                            {/*  */}
                            {node.label}
                            {/* </span> */}
                            {/* {node.children?.length} */}
                        </>
                    )
                }}
                // renderTreeIcon={() => <>{'>'}</>}
                // value={value}
                onChange={async (_value: any) => {
                    if (typeof _value !== 'string') throw new Error('tree selection value is not a string')
                    const value = _value as string

                    // 1. focus paf
                    const paf = st.toolbox.filesMap.get(asAbsolutePath(value))
                    if (paf == null) throw new Error(`paf not found for ${value}`)
                    pj.focusActionFile(paf)

                    // 2. if paf has a tool, focus it
                    console.log(value, paf)
                    const res = await paf.load({ logFailures: true })
                    const tool0 = res.paf?.tools?.[0]
                    if (tool0 == null) return null
                    pj.focusTool(tool0)
                    // console.log(res?.tools.length)

                    // setValue(value)
                }}
                // renderTreeNode={(nodeData) => {
                //     return <div>{nodeData.label}</div>
                // }}
                // draggable
                // onDrop={({ createUpdateDataFunction }, event) => setTreeData(createUpdateDataFunction(treeData))}
            />

            {/* <div className='flex-grow'></div> */}
            <Message showIcon className='m-2' type='info'>
                {/* <span className='material-symbols-outlined'>folder-</span> */}
                Add yours now in the actions folder of your installation.
            </Message>
            {/* <FooBarUI /> */}
            {/* <PanelImport /> */}
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
                    const code = st.importer.convertFlowToCode(json, {
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
