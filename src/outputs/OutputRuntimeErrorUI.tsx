import { observer } from 'mobx-react-lite'
import { Panel } from 'src/rsuite/shims'
import { JsonViewUI } from '../widgets/workspace/JsonViewUI'
import { StepOutput_RuntimeError } from 'src/types/MessageFromExtensionToWebview'
import { StepL } from 'src/models/Step'
import { OutputPreviewWrapperUI } from './OutputWrapperUI'

export const OutputRuntimeErrorUI = observer(function OutputRuntimeErrorUI_(p: { step: StepL; output: StepOutput_RuntimeError }) {
    const msg = p.output
    return (
        <Panel>
            <div className='bg-error text-error-content'>
                <div tw='text-xl font-bold'>Runtime Error</div>
                <div tw='italic'>{msg.message}</div>
            </div>
            <div>
                <div tw='font-bold'>error infos:</div>
                <JsonViewUI value={JSON.parse(JSON.stringify(msg.infos))} />
            </div>
        </Panel>
    )
})

export const OutputRuntimeErrorPreviewUI = observer(function OutputRuntimeErrorPreviewUI_(p: {
    step: StepL
    output: StepOutput_RuntimeError
}) {
    const msg = p.output
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div>Runtime Error</div>
            <OutputRuntimeErrorUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
