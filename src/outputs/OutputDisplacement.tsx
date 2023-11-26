import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'
import { StepOutput_DisplacedImage, StepOutput_Image } from 'src/types/MessageFromExtensionToWebview'
import { ImageUI } from 'src/widgets/galleries/ImageUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputDisplacementUI = observer(function OutputDisplacementUI_(p: {
    step: StepL
    output: StepOutput_DisplacedImage
}) {
    return (
        <div>3d</div>
        // <OutputWrapperUI label='image'>
        // <ImageUI img={p.output.imgID} />
        // </OutputWrapperUI>
    )
})

export const OutputDisplacementPreviewUI = observer(function OutputImagePreviewUI_(p: {
    step: StepL
    output: StepOutput_DisplacedImage
}) {
    const size = useSt().outputPreviewSizeStr
    return (
        <OutputPreviewWrapperUI output={p.output}>
            3D
            <OutputDisplacementUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})
