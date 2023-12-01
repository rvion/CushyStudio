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
            <span className='material-symbols-outlined'>play_circle</span>
        </OutputPreviewWrapperUI>
    )
})

export const OutputVideoUI = observer(function OutputVideoUI_(p: { step?: Maybe<StepL>; output: MediaVideoL }) {
    return (
        <video
            style={{
                objectFit: 'contain',
                // ...extraProps,
            }}
            src={p.output.url}
            controls
            autoPlay
            loop
        />
    )
})
