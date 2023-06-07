// import type { MessageFromExtensionToWebview } from '../../../types/MessageFromExtensionToWebview'
// import { observer } from 'mobx-react-lite'
// import { Message, Panel } from 'rsuite'

// export const ShowActionEndUI = observer(function ShowActionEndUI_(p: {
//     msg: MessageFromExtensionToWebview & { type: 'action-end' }
// }) {
//     const msg = p.msg
//     // const flow = useFlow()
//     // const st = useSt()
//     return (
//         <Panel shaded>
//             <Message
//                 showIcon
//                 type={msg.status === 'failure' ? 'error' : 'success'}
//                 header={
//                     <div>
//                         {msg.status}
//                         {/* <Button
//                             startIcon={<I.PlayOutline />}
//                             // appearance='primary'
//                             size='sm'
//                             onClick={() => {
//                                 st.sendMessageToExtension({
//                                     type: 'run-action',
//                                     flowID: flow.id,
//                                     actionID: msg.actionID,
//                                 })
//                             }}
//                         >
//                             Run Again
//                             ({msg.flowRunID})
//                         </Button> */}
//                     </div>
//                 }
//             ></Message>
//         </Panel>
//     )
// })
