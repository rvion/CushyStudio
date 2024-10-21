import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'
import { PanelOutputConf } from './PanelOutput_conf'

export const LatentIfLastUI = observer(function LatentIfLastUI_(p: {}) {
    const st = useSt()
    const lastImage = st.db.media_image.last()
    const latent = st.latentPreview
    const sizeStr = PanelOutputConf.value.latentSize + '%'
    if (latent == null) return null
    if (lastImage == null || latent.receivedAt > lastImage.createdAt) {
        return (
            <img //
                tw='absolute bottom-0 right-0 z-50 shadow-xl'
                style={{
                    //
                    filter: st.project.filterNSFW ? 'blur(50px)' : undefined,
                    width: sizeStr,
                    height: sizeStr,
                    objectFit: 'contain',
                    opacity: PanelOutputConf.value.latentTransparency / 100,
                }}
                src={latent.url}
                alt='last generated image'
            />
        )
    }
    return null
    // return (
    //     <div tw='absolute bottom-0 right-0 shadow-xl z-50 !bg-red-700'>
    //         <div>{sizeStr}</div>
    //         <div>{sizeStr}</div>
    //     </div>
    // )
})
