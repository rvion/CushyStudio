// import { observer, useLocalObservable } from 'mobx-react-lite'
// import { useCallback } from 'react'
// import { MessageFromExtensionToWebview_askString } from '../core-types/MessageFromExtensionToWebview'
// import { useSt } from '../core-front/stContext'
// import { Button, Input, Panel } from 'rsuite'

// export const Execution_askStringUI = observer(function Execution_askUI_(p: { step: MessageFromExtensionToWebview_askString }) {
//     const st = useSt()
//     const uiSt = useLocalObservable(() => ({
//         value: p.step.default ?? '',
//         locked: false,
//     }))
//     const submit = useCallback(
//         (ev: { preventDefault?: () => void; stopPropagation?: () => void }) => {
//             ev.preventDefault?.()
//             ev.stopPropagation?.()
//             st.answerString(uiSt.value)
//             uiSt.locked = true
//         },
//         [uiSt],
//     )

//     return (
//         <Panel shaded header={<>💬 {p.step.message}</>} collapsible defaultExpanded>
//             {/* <div className='text-xl font-bold'>{p.step.message}</div> */}
//             <Input
//                 autoFocus
//                 onKeyDown={(ev) => {
//                     if (ev.key === 'Enter') submit(ev)
//                 }}
//                 // disabled={uiSt.locked}
//                 value={uiSt.value}
//                 onChange={(next) => (uiSt.value = next)}
//             />
//             {uiSt.locked ? null : (
//                 <Button appearance='primary' onClick={submit}>
//                     OK
//                 </Button>
//             )}
//         </Panel>
//     )
// })
