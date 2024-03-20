// import type { StepL } from '../models/Step'
// import { observer } from 'mobx-react-lite'
// import { Message, Panel } from '../rsuite/shims'
// import { ButtonDownloadFilesUI } from '../widgets/workspace/ButtonDownloadFilesUI'
// import { ButtonOpenInComfyUI } from '../widgets/workspace/ButtonOpenInComfyUI'
// import { StepOutput_ExecutionError } from '../types/StepOutput'

// export const OutputExecutionErrorUI = observer(function OutputExecutionErrorUI_(p: {
//     step: StepL
//     output: StepOutput_ExecutionError
// }) {
//     const msg = p.output
//     const outputGraph = p.step.outputWorkflow.item
//     const data = msg.payloadFromComfy.data
//     return (
//         <div>
//             <ButtonDownloadFilesUI graph={outputGraph} />
//             <ButtonOpenInComfyUI graph={outputGraph} />
//             <Message type='error' header='Execution error' showIcon>
//                 <div>node: {data.node_type}</div>
//                 <div>{data.exception_message}</div>
//                 <div>{data.exception_type}</div>
//                 <Panel header='Details'>
//                     <pre>{JSON.stringify(data, null, 3)}</pre>
//                 </Panel>
//             </Message>
//         </div>
//     )
// })
