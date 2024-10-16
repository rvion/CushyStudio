import { observer } from 'mobx-react-lite'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { useSt } from '../state/stateContext'

export const Panel_ViewLatent = observer(function Panel_ViewLatent_(p: {}) {
    const st = useSt()
    const url = st.latentPreview?.url
    // 🛝 const background = st.galleryConf.value.galleryBgColor ?? undefined
    return (
        <div tw='w-full h-full flex flex-col' /* 🛝 style={{ background }} */>
            <TransformWrapper centerZoomedOut centerOnInit>
                <TransformComponent
                    wrapperStyle={{ height: '100%', width: '100%' }}
                    contentStyle={{ height: '100%', width: '100%' }}
                >
                    {url ? (
                        <img //
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            src={url}
                            alt='last generated image'
                        />
                    ) : (
                        <div tw='w-96 h-96 flex items-center justify-center'>
                            <div>no image yet</div>
                        </div>
                    )}
                    {/* </div> */}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
})
