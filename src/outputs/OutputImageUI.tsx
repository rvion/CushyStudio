import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'
import { StepOutput_Image } from 'src/types/MessageFromExtensionToWebview'
import { ImageUI } from 'src/widgets/galleries/ImageUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputImageUI = observer(function OutputImageUI_(p: { step: StepL; output: StepOutput_Image }) {
    return (
        // <OutputWrapperUI label='image'>
        <ImageUI img={p.output.imgID} />
        // </OutputWrapperUI>
    )
})

export const OutputImagePreviewUI = observer(function OutputImagePreviewUI_(p: { step: StepL; output: StepOutput_Image }) {
    const size = useSt().outputPreviewSizeStr
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <ImageUI img={p.output.imgID} size={size} />
            <OutputImageUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
