import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'

export const OutputDisplacementPreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    const size = useSt().gallerySizeStr
    return (
        <OutputPreviewWrapperUI output={p.output}>
            {/*  */}
            3D
        </OutputPreviewWrapperUI>
    )
})

export const OutputDisplacementUI = observer(function OutputDisplacementUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    return (
        <div>3d</div>
        // <OutputWrapperUI label='image'>
        // <ImageUI img={p.output.imgID} />
        // </OutputWrapperUI>
    )
})
