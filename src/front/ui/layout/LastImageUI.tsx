import type { ImageID } from 'src/models/Image'

import { observer } from 'mobx-react-lite'
import { useSt } from 'src/front/FrontStateCtx'

export const LastImageUI = observer(function LastImageUI_(p: { imageID?: ImageID }) {
    const st = useSt()
    const imgs = p.imageID //
        ? st.db.images.get(p.imageID)
        : st.db.images.last()
    if (imgs == null) return null
    return (
        <div tw='w-full h-full'>
            <img
                style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                }}
                src={imgs.url}
                alt='last generated image'
            />
        </div>
    )
})
