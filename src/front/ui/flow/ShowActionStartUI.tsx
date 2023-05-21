import { MessageFromExtensionToWebview } from '../../../types/MessageFromExtensionToWebview'
import { FormUI } from '../widgets/FormUI'
import { observer } from 'mobx-react-lite'
import { useProject } from '../../ProjectCtx'
import { Loader } from 'rsuite'

// export const ShowActionStartUI = observer(function ShowActionStartUI_(p: {
//     msg: MessageFromExtensionToWebview & { type: 'action-start' }
// }) {
//     const project = useProject()
//     const executionID = p.msg.executionID
//     const x = project.actions.get(executionID)
//     if (x == null) return <div>actionFront==null</div>
//     return (
//         <div>
//             {/* <div>({x.done})</div> */}
//             {/* <div>({x.done === 'success' ? 'a🟢' : 'a🔴'})</div> */}
//             {/* {x.executionID} */}
//             {/* {JSON.stringify(actionFront.currentActionRef)} */}
//             {x.currentActionRef && (
//                 <FormUI
//                     title={
//                         <>
//                             {x.done === false ? <Loader /> : null} {x.currentActionRef.name}
//                         </>
//                     }
//                     className={
//                         x.done === false //
//                             ? 'border-2 border-yellow-500'
//                             : x.done === 'success'
//                             ? 'border-2 border-green-500'
//                             : 'border-2 border-red-500'
//                     }
//                     //
//                     submit={() => {}}
//                     formDef={x.currentActionRef.form ?? {}}
//                     formState={x.formState}
//                 />
//             )}
//         </div>
//     )
// })
