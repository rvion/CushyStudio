import type { STATE } from 'src/state/state'
import type { ImageID, ImageL } from 'src/models/Image'

import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { observer } from 'mobx-react-lite'
import { Button, Rate, Toggle } from 'rsuite'
import { useSt } from 'src/state/stateContext'
import { openExternal, showItemInFolder } from '../app/layout/openExternal'

export const Panel_ViewImage = observer(function Panel_ViewImage_(p: { imageID?: ImageID | 'latent' }) {
    const st = useSt()
    // const img: Maybe<ImageL> = p.imageID //
    //     ? st.db.images.get(p.imageID)
    //     : st.db.images.last()
    const { img, url } = getPreviewType(st, p.imageID)
    const imgPathWithFileProtocol = img ? `file://${img.localAbsolutePath}` : null
    // if (img == null) return null
    return (
        <div
            tw='w-full h-full flex flex-col'
            style={{
                background: st.configFile.value.galleryBgColor,
            }}
        >
            <div tw='flex gap-2 p-0.5'>
                {/* 1. RATER */}
                {img && <Rate size='xs' onChange={(next) => img.update({ star: next })} value={img.data.star} />}

                {/* 2. LATENT PREVIEW TOOGLE */}
                {/* (only on "last-image" mode; when p.imageID is null )  */}
                {p.imageID == null ? (
                    <div tw='flex gap-1 items-center'>
                        <Toggle
                            size='sm'
                            checked={st.showLatentPreviewInLastImagePanel}
                            onChange={(next) => (st.showLatentPreviewInLastImagePanel = next)}
                        />
                        <span tw='text-light'>include sampler preview</span>
                    </div>
                ) : null}

                {/* 3. OPEN OUTPUT FOLDER */}
                {img?.localAbsolutePath && (
                    <Button
                        startIcon={<span className='material-symbols-outlined'>folder</span>}
                        size='xs'
                        appearance='link'
                        onClick={() => showItemInFolder(img.localAbsolutePath)}
                    >
                        open folder
                    </Button>
                )}

                {/* 3. OPEN FILE ITSELF */}
                {imgPathWithFileProtocol && (
                    <Button
                        startIcon={<span className='material-symbols-outlined'>folder</span>}
                        size='xs'
                        appearance='link'
                        onClick={() => openExternal(imgPathWithFileProtocol)}
                    >
                        open
                    </Button>
                )}
            </div>
            <TransformWrapper centerZoomedOut centerOnInit>
                <TransformComponent
                    wrapperStyle={{ /* border: '5px solid #b53737', */ height: '100%', width: '100%' }}
                    contentStyle={{ /* border: '5px solid #38731f', */ height: '100%', width: '100%' }}
                >
                    <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={url} alt='last generated image' />
                    {/* </div> */}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
})

const getPreviewType = (
    st: STATE,
    imageID: Maybe<ImageID | 'latent'>,
): {
    url: string
    img?: Maybe<ImageL>
} => {
    const errorURL = ''
    if (imageID === 'latent') return { url: st.preview?.url ?? errorURL }
    if (imageID != null) {
        const img = st.db.images.get(imageID)
        return { url: img?.url ?? errorURL, img }
    }
    if (imageID == null) {
        if (st.showLatentPreviewInLastImagePanel) {
            const lastImage = st.db.images.last()
            const latent = st.preview
            if (latent == null) return { url: lastImage?.url ?? errorURL, img: lastImage }
            if (lastImage == null) return { url: latent.url }
            if (latent.receivedAt > lastImage.createdAt) {
                return { url: latent.url }
            } else {
                return { url: lastImage.url, img: lastImage }
            }
        } else {
            const lastImage = st.db.images.last()
            return { url: lastImage?.url ?? errorURL, img: lastImage }
        }
    }
    return { url: errorURL }
}
