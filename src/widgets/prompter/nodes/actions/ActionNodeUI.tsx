// import type { ActionNode } from './ActionNode'

// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
// import { observer } from 'mobx-react-lite'
// import { Button, Popover, Whisper } from '../../../../rsuite/shims'

// export const ActionNodeUI = observer(function ActionNodeUI_(p: { node: ActionNode }) {
//     const node = p.node
//     const [editor] = useLexicalComposerContext()
//     const def = node.tag
//     console.log(node, def)
//     return (
//         <Whisper
//             enterable
//             placement='bottom'
//             speaker={
//                 <Popover>
//                     <div key={def.tag.key} className='flex items-start'>
//                         <div className='shrink-0'>{def.tag.key}(</div>
//                         <div className='flex-grow'></div>
//                         <input
//                             tw='input input-xs'
//                             // size='xs'
//                             type='text'
//                             value={def.param}
//                             step={0.1}
//                             onChange={(ev) => {
//                                 const next = ev.target.value
//                                 def.param = next
//                             }}
//                             style={{ width: '4.5rem' }}
//                         />
//                         <Button
//                             size='xs'
//                             icon={<span className='material-symbols-outlined'>delete_forever</span>}
//                             onClick={() => editor.update(() => node.remove())}
//                         />
//                         <div className='shrink-0'>)</div>
//                     </div>
//                 </Popover>
//             }
//         >
//             <span className='bg-green-800' style={{ padding: '1px' }}>
//                 /{def.tag.key}({def.param})
//             </span>
//         </Whisper>
//     )
// })
