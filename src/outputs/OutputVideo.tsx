import type { MediaVideoL } from 'src/models/MediaVideo'

import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputVideoPreviewUI = observer(function OutputImagePreviewUI_(p: { step?: Maybe<StepL>; output: MediaVideoL }) {
    const size = useSt().gallerySizeStr
    return (
        <OutputPreviewWrapperUI output={p.output}>
            video
            <OutputVideoUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})

export const OutputVideoUI = observer(function OutputVideoUI_(p: { step?: Maybe<StepL>; output: MediaVideoL }) {
    return (
        <div>video</div>
        // <OutputWrapperUI label='image'>
        // <ImageUI img={p.output.imgID} />
        // </OutputWrapperUI>
    )
})
