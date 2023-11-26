import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { StepOutput_Text } from 'src/types/MessageFromExtensionToWebview'
import { OutputPreviewWrapperUI, OutputWrapperUI } from './OutputWrapperUI'

export const OutputTextUI = observer(function OutputTextUI_(p: { step: StepL; output: StepOutput_Text }) {
    return (
        <OutputWrapperUI label=''>
            <div className='text-base'>{p.output.message}</div>
        </OutputWrapperUI>
    )
})

export const OutputTextPreviewUI = observer(function OutputTextPreviewUI_(p: { step: StepL; output: StepOutput_Text }) {
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div>Text</div>
            <OutputTextUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
