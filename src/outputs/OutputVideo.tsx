import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'
import { StepOutput_Video } from 'src/types/StepOutput'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputVideoUI = observer(function OutputVideoUI_(p: { step?: Maybe<StepL>; output: StepOutput_Video }) {
    return (
        <div>video</div>
        // <OutputWrapperUI label='image'>
        // <ImageUI img={p.output.imgID} />
        // </OutputWrapperUI>
    )
})

export const OutputVideoPreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: StepOutput_Video
}) {
    const size = useSt().outputPreviewSizeStr
    return (
        <OutputPreviewWrapperUI output={p.output}>
            video
            <OutputVideoUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
