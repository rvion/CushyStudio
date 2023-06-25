// import type { StepL } from 'src/models/Step'

// import * as I from '@rsuite/icons'
// import { observer, useLocalObservable } from 'mobx-react-lite'
// import { ButtonGroup, IconButton, Panel, Tooltip, Whisper } from 'rsuite'
// import { formContext } from '../FormCtx'
// import { ToolPickerUI, ActionSuggestionUI } from '../workspace/ToolPickerUI'
// import { DebugUI } from './DebugUI'
// import { WidgetUI } from './WidgetUI'
// import type { ToolID } from 'src/models/Tool'
// import type { Maybe } from 'src/utils/types'
// import { useSt } from 'src/front/FrontStateCtx'
// import { GraphL } from 'src/models/Graph'

// export const ActionPlaceholderUI = observer(function ActionPlaceholderUI_(p: {}) {
//     return (
//         <Panel>
//             <div className='flex gap-2' style={{ width: '30rem' }}>
//                 Executing...
//             </div>
//         </Panel>
//     )
// })
// /** this is the root interraction widget
//  * if a workflow need user-supplied infos, it will send an 'ask' request with a list
//  * of things it needs to know.
//  */
// export const ActionUI2 = observer(function ActionUI2_(p: { graph: GraphL }) {
//     const st = useSt()
//     const x = useLocalObservable(() => ({
//         toolID: null as Maybe<ToolID>,
//         tooParams: {} as Maybe<Record<string, unknown>>,
//     }))
//     // ensure action have a tool
//     // const step = p.step
//     const tool = x.toolID ? st.db.tools.get(x.toolID) : null

//     // if (tool == null) return <ActionPickerUI action={action} />

//     // prepare basic infos
//     const formDefinition = tool?.data.form ?? {}
//     // const locked = step.data.params != null

//     return (
//         <formContext.Provider value={step} key={p.graph.id}>
//             <Panel className='relative mb-3' shaded>
//                 <div className='flex justify-between'>
//                     <ToolPickerUI step={step} />
//                     <ButtonGroup>
//                         <IconButton
//                             size='sm'
//                             className='self-start'
//                             color='green'
//                             appearance='primary'
//                             icon={<I.PlayOutline />}
//                             onClick={() => step.start()}
//                         />
//                         <IconButton
//                             size='sm'
//                             className='self-start'
//                             color='blue'
//                             appearance='primary'
//                             icon={<I.PageNext />}
//                             onClick={() => step.start()}
//                         />
//                     </ButtonGroup>
//                 </div>
//                 {/* {step.id} */}
//                 <div className='flex gap-2' style={{ width: '30rem' }}>
//                     <ActionSuggestionUI step={step} />
//                     {/* widgets ------------------------------- */}
//                     <form
//                         onSubmit={(ev) => {
//                             console.log('SUBMIT')
//                             ev.preventDefault()
//                             ev.stopPropagation()
//                             step.start()
//                         }}
//                     >
//                         {Object.entries(formDefinition).map(([rootKey, req], ix) => {
//                             const pathInfo = step.getPathInfo([rootKey])
//                             return (
//                                 <div
//                                     // style={{ background: ix % 2 === 0 ? '#313131' : undefined }}
//                                     className='row gap-2 items-baseline'
//                                     key={rootKey}
//                                 >
//                                     <div className='w-20 shrink-0 text-right'>
//                                         <Whisper speaker={<Tooltip>{pathInfo}</Tooltip>}>
//                                             <div>{rootKey}</div>
//                                         </Whisper>
//                                     </div>
//                                     <WidgetUI key={pathInfo} path={[rootKey]} req={req} focus={ix === 0} />
//                                 </div>
//                             )
//                         })}
//                     </form>

//                     {locked ? null : (
//                         <pre className='border-2 border-dashed border-orange-200 p-2'>
//                             action output = {JSON.stringify(step.data.params, null, 4)}
//                         </pre>
//                     )}

//                     {/* debug -------------------------------*/}
//                     <div className='flex absolute bottom-0 right-0'>
//                         <DebugUI title='⬇'>
//                             the form definition is
//                             <pre>{JSON.stringify(formDefinition, null, 4)}</pre>
//                         </DebugUI>
//                         <DebugUI title={'⬆'}>
//                             the value about to be sent back to the workflow is
//                             <pre>{JSON.stringify(step.data.params, null, 4)}</pre>
//                         </DebugUI>
//                     </div>
//                 </div>
//             </Panel>
//         </formContext.Provider>
//     )
// })
