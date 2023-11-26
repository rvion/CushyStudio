import type { StepL } from 'src/models/Step'
import { observer } from 'mobx-react-lite'
import { StepOutput_GUI } from 'src/types/MessageFromExtensionToWebview'
import { OutputPreviewWrapperUI, OutputWrapperUI } from './OutputWrapperUI'

// -----------------

export const OutputAskUI = observer(function OutputAskUI_(p: { step: StepL; output: StepOutput_GUI }) {
    return (
        <OutputWrapperUI label='Ask'>
            <div>GUI ❓</div>
        </OutputWrapperUI>
    )
})

export const OutputAskPreviewUI = observer(function OutputAskUI_(p: { step: StepL; output: StepOutput_GUI }) {
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div>GUI ❓</div>
            <OutputAskUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
