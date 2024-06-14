import type { MediaImageL } from '../models/MediaImage'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { Panel_ViewImage } from '../panels/Panel_ViewImage'
import { ImageUI } from '../widgets/galleries/ImageUI'

export const OutputImagePreviewUI = observer(function OutputImagePreviewUI_(p: {
    //
    step?: Maybe<StepL>
    output: MediaImageL
}) {
    return <ImageUI tw='!rounded-none cursor-default' img={p.output} size='100%' />
})

export const OutputImageUI = observer(function OutputImageUI_(p: { step?: Maybe<StepL>; output: MediaImageL }) {
    return <Panel_ViewImage imageID={p.output.id} />
})
