import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { StepOutput_Image } from 'src/types/StepOutput'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { assets } from 'src/utils/assets/assets'
import { Panel_ViewImage } from 'src/panels/Panel_ViewImage'

export const OutputImagePreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: StepOutput_Image
}) {
    const image = p.output
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <img
                src={image.url}
                loading='lazy'
                style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    // padding: '0.2rem',
                    borderRadius: '.3rem',
                }}
            />
        </OutputPreviewWrapperUI>
    )
})

export const OutputImageUI = observer(function OutputImageUI_(p: { step?: Maybe<StepL>; output: StepOutput_Image }) {
    return <Panel_ViewImage imageID={p.output.id} />
})
