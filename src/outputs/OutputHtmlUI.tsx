import { observer } from 'mobx-react-lite'
import { Panel } from 'src/rsuite/shims'
import { StepOutput_Html } from 'src/types/MessageFromExtensionToWebview'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { StepL } from 'src/models/Step'

export const OutputHtmlUI = observer(function OutputHtmlUI_(p: { step: StepL; output: StepOutput_Html }) {
    const msg = p.output
    return (
        <Panel>
            <div>{msg.title}</div>
            <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
        </Panel>
    )
})

export const OutputHtmlPreviewUI = observer(function OutputWorkflowUI_(p: { step: StepL; output: StepOutput_Html }) {
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div>Workflow</div>
            <OutputHtmlUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
