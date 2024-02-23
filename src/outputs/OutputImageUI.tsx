import { observer } from 'mobx-react-lite'

import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { StepL } from 'src/models/Step'
import { Panel_ViewImage } from 'src/panels/Panel_ViewImage'
import { StepOutput_Image } from 'src/types/StepOutput'
import { ImageUI } from 'src/widgets/galleries/ImageUI'

export const OutputImagePreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: StepOutput_Image
}) {
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

export const OutputImageUI = observer(function OutputImageUI_(p: { step?: Maybe<StepL>; output: StepOutput_Image }) {
    return <Panel_ViewImage imageID={p.output.id} />
})
