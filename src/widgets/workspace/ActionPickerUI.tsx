// import { observer } from 'mobx-react-lite'
// import { useState } from 'react'
// import { ComfyPromptJSON } from '../../types/ComfyPrompt'
// import { TypescriptHighlightedCodeUI } from '../misc/TypescriptHighlightedCodeUI'
// import { SectionTitleUI } from './SectionTitle'
// import { FileListUI } from '../../cards/FileListUI'

// export const ActionPickerUI = observer(function ToolPickerUI_(p: {}) {
//     const st = cushy
//     return (
//         <div
//             //
//             className='flex flex-col flex-grow h-full'
//             style={{ borderRight: '1px solid #2d2d2d' }}
//         >
//             <SectionTitleUI label='Apps' className='bg-gray-800 mb-2'>
//                 <div onClick={() => st.library.discoverAllCards()} className='cursor-pointer'>
//                     <span className='text-xs material-symbols-outlined'>sync</span>
//                 </div>
//             </SectionTitleUI>
//             <FileListUI />
//         </div>
//     )
// })

// export const FooBarUI = observer(function FooBarUI_(p: {}) {
//     const [a, set] = useState<Maybe<string>>(() => null)
//     const st = cushy
//     return (
//         <div>
//             <input
//                 type='text'
//                 defaultValue={''}
//                 onChange={(e) => {
//                     const val = e.target.value
//                     const json = JSON.parse(val) as ComfyPromptJSON
//                     const code = st.importer.convertPromptToCode(json, {
//                         title: 'test',
//                         author: 'test',
//                         preserveId: true,
//                         autoUI: true,
//                     })
//                     set(code)
//                 }}
//             />
//             {a && <TypescriptHighlightedCodeUI code={a} />}
//         </div>
//     )
// })

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
