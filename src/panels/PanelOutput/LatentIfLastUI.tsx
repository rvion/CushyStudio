import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'

export const LatentIfLastUI = observer(function LatentIfLastUI_(p: {}) {
    const st = useSt()
    const lastImage = st.db.media_image.last()
    const latent = st.latentPreview
    if (latent == null) return null
    if (lastImage == null || latent.receivedAt > lastImage.createdAt) {
        return (
            <img //
                tw='absolute bottom-0 right-0 shadow-xl z-50'
                style={{
                    //
                    filter: st.project.filterNSFW ? 'blur(50px)' : undefined,
                    width: st.latentSizeStr,
                    height: st.latentSizeStr,
                    objectFit: 'contain',
                }}
                src={latent.url}
                alt='last generated image'
            />
        )
    }
})
