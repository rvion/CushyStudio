import type { StepL } from 'src/models/Step'
import { observer } from 'mobx-react-lite'
import { StepOutput_ComfyWorkflow } from 'src/types/MessageFromExtensionToWebview'
import { OutputWrapperUI } from './OutputWrapperUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { useSt } from 'src/state/stateContext'

export const OutputWorkflowUI = observer(function OutputWorkflowUI_(p: { step: StepL; output: StepOutput_ComfyWorkflow }) {
    return (
        <OutputWrapperUI label='Ask'>
            <div>Workflow</div>
        </OutputWrapperUI>
    )
})

export const OutputWorkflowPreviewUI = observer(function OutputWorkflowUI_(p: { step: StepL; output: StepOutput_ComfyWorkflow }) {
    const st = useSt()
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div tw='bg-blue-800'>
                <span
                    //
                    style={{ fontSize: '2.5rem' }}
                    className='material-symbols-outlined text-blue-400'
                >
                    account_tree
                </span>
            </div>
            <OutputWorkflowUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
