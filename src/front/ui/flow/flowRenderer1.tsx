// import type { STATE } from 'src/front/state'

// import { MessageFromExtensionToWebview } from '../../../types/MessageFromExtensionToWebview'
// // import { ShowActionStartUI } from './ShowActionStartUI'

// export const renderMsgUI = (
//     st: STATE,
//     msg: MessageFromExtensionToWebview,
// ): {
//     //
//     ui: JSX.Element
//     group?: string
//     wrap?: boolean
// } | null => {
//     return { ui: <>fixme</> }
//     // if (msg.type === 'show-html') return { ui: <MsgShowHTMLUI key={msg.uid} msg={msg} /> }
//     // if (msg.type === 'action-code') return { ui: <TypescriptHighlightedCodeUI key={msg.uid} code={msg.code} /> }
//     // if (msg.type === 'executing') return { ui: <ShowUpdatingNodeUI key={msg.uid} msg={msg} />, wrap: true }
//     // if (msg.type === 'ask')
//     //     return {
//     //         ui: (
//     //             <FormUI
//     //                 //
//     //                 submit={(value) => {
//     //                     // 🔴
//     //                     msg.result = value
//     //                 }}
//     //                 key={msg.uid}
//     //                 formDef={msg.form}
//     //             />
//     //         ),
//     //     }
//     // if (msg.type === 'print')
//     //     return {
//     //         ui: (
//     //             <Panel collapsible defaultExpanded key={msg.uid} shaded>
//     //                 <div>
//     //                     💬
//     //                     {msg.message}
//     //                 </div>
//     //             </Panel>
//     //         ),
//     //     }
//     // if (msg.type === 'images') return { ui: <FlowGeneratedImagesUI key={msg.uid} msg={msg} />, wrap: true }
//     // if (msg.type === 'action-start')
//     //     return {
//     //         ui: (
//     //             <ShowActionStartUI msg={msg} />
//     //             // <>action start 🔴</>
//     //             // <FormUI
//     //             //     //
//     //             //     submit={() => {}}
//     //             //     formState={flow}
//     //             //     // step={{
//     //             //     //     flowID: msg.flowID,
//     //             //     //     form: st.knownActions.get(msg.actionID)!.form, // 🔴
//     //             //     // }}
//     //             // />
//     //         ),
//     //     }
//     // if (msg.type === 'action-end') return { ui: <ShowActionEndUI key={msg.uid} msg={msg} /> }
//     // return null
// }
