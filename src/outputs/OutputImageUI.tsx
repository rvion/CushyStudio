import type { MediaImageL } from '../models/MediaImage'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { Panel_ViewImage } from '../panels/Panel_ViewImage'
import { ImageUI } from '../widgets/galleries/ImageUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputImagePreviewUI = observer(function OutputImagePreviewUI_(p: { step?: Maybe<StepL>; output: MediaImageL }) {
    const image = p.output
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <ImageUI img={p.output} size='100%' />
            {/* <img
                src={image.url}
                loading='lazy'
                style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    // padding: '0.2rem',
                    borderRadius: '.3rem',
                }}
            /> */}
        </OutputPreviewWrapperUI>
    )
})

export const OutputImageUI = observer(function OutputImageUI_(p: { step?: Maybe<StepL>; output: MediaImageL }) {
    return <Panel_ViewImage imageID={p.output.id} />
})
