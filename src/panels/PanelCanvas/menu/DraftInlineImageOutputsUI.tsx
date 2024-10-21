import type { MediaImageL } from '../../../models/MediaImage'

import { observer } from 'mobx-react-lite'

import { ImageUI } from '../../../widgets/galleries/ImageUI'

export const DraftInlineImageOutputsUI = observer(function DraftInlineImageOutputsUI_(p: {
    onCLick?: (img: MediaImageL) => void
    draftID: DraftID
}) {
    const draft = cushy.db.draft.get(p.draftID)
    if (!draft) return `❌ draft not found: ${p.draftID}`
    const images = draft.images
    return (
        <div tw='flex gap-1 overflow-auto'>
            {images.map((image) => {
                return (
                    <ImageUI //
                        onClick={() => p.onCLick?.(image)}
                        style={{ flexShrink: '0' }}
                        key={image.id}
                        img={image}
                        size={64}
                    />
                )
            })}
        </div>
    )
})
