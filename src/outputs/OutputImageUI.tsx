import type { MediaImageL } from '../models/MediaImage'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { PanelViewImageUI } from '../panels/PanelViewImage/Panel_ViewImage'
import { ImageUI } from '../widgets/galleries/ImageUI'

export const OutputImagePreviewUI = observer(function OutputImagePreviewUI_(p: {
    //
    step?: Maybe<StepL>
    output: MediaImageL
}) {
    return (
        <ImageUI //
            img={p.output}
            size={32}
        />
    )
})

export const OutputImageUI = observer(function OutputImageUI_(p: { step?: Maybe<StepL>; output: MediaImageL }) {
    return <PanelViewImageUI imageID={p.output.id} />
})
