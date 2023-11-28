import type { ImageID, ImageL } from 'src/models/Image'
import type { STATE } from 'src/state/state'

import { observer } from 'mobx-react-lite'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { Rate, Toggle } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { assets } from 'src/utils/assets/assets'
import { openExternal, showItemInFolder } from '../app/layout/openExternal'

export const Panel_ViewImage = observer(function Panel_ViewImage_(p: { className?: string; imageID?: ImageID | 'latent' }) {
    const st = useSt()
    // const img: Maybe<ImageL> = p.imageID //
    //     ? st.db.images.get(p.imageID)
    //     : st.db.images.last()
    const { img, url, latentUrl } = getPreviewType(st, p.imageID)
    const imgPathWithFileProtocol = img ? `file://${img.absPath}` : null
    // if (img == null) return null
    const background = st.configFile.value.galleryBgColor

    return (
        <div
            //
            className={p.className}
            tw='flex flex-col flex-grow bg-base-100'
            style={{ background }}
        >
            <div tw='flex items-center gap-2 bg-base-200'>
                {/* <FieldAndLabelUI label='Rating'> */}
                <Rate
                    name={img?.id ?? 'latent'}
                    value={img?.data.star ?? 0}
                    disabled={img == null}
                    onChange={(next) => {
                        if (img == null) return
                        // const next = ev.target.value
                        img.update({ star: next })
                    }}
                />
                {/* </FieldAndLabelUI> */}

                {/* 2. LATENT PREVIEW TOOGLE */}
                {/* (only on "last-image" mode; when p.imageID is null )  */}
                {p.imageID == null ? (
                    <div tw='flex items-center'>
                        Sampler
                        <Toggle
                            checked={st.showLatentPreviewInLastImagePanel}
                            onChange={(ev) => (st.showLatentPreviewInLastImagePanel = ev.target.checked)}
                        />
                    </div>
                ) : null}

                {/* <FieldAndLabelUI label='Size'> */}
                {/* </FieldAndLabelUI> */}
                {/* 3. OPEN OUTPUT FOLDER */}
                <Dropdown title='Actions' startIcon={<span className='material-symbols-outlined'>menu</span>}>
                    <MenuItem
                        icon={<span className='material-symbols-outlined'>folder</span>}
                        size='sm'
                        // appearance='subtle'
                        disabled={!img?.absPath}
                        onClick={() => {
                            if (!img?.absPath) return
                            showItemInFolder(img.absPath)
                        }}
                    >
                        open folder
                    </MenuItem>
                    {/* 3. OPEN FILE ITSELF */}
                    <MenuItem
                        icon={<span className='material-symbols-outlined'>folder</span>}
                        size='xs'
                        // appearance='subtle'
                        disabled={!img?.absPath}
                        onClick={() => {
                            if (imgPathWithFileProtocol == null) return
                            openExternal(imgPathWithFileProtocol)
                        }}
                    >
                        open
                    </MenuItem>
                </Dropdown>
                <div tw='virtualBorder p-1'>{`${img?.data.width ?? '?'} x ${img?.data.height ?? '?'}`}</div>
            </div>

            <TransformWrapper centerZoomedOut centerOnInit>
                <TransformComponent
                    wrapperStyle={{ /* border: '5px solid #b53737', */ height: '100%', width: '100%', display: 'flex' }}
                    contentStyle={{ /* border: '5px solid #38731f', */ height: '100%', width: '100%' }}
                >
                    {latentUrl && (
                        <img //
                            tw='absolute bottom-0 right-0 shadow-xl'
                            style={{ width: st.latentSizeStr, height: st.latentSizeStr, objectFit: 'contain' }}
                            src={latentUrl}
                            alt='last generated image'
                        />
                    )}
                    {url ? (
                        <img //
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            src={url}
                            alt='last generated image'
                        />
                    ) : (
                        <div tw='w-full h-full relative flex'>
                            <div
                                style={{ fontSize: '3rem', textShadow: '0 0 5px #ffffff' }}
                                tw='animate-pulse absolute self-center w-full text-center text-xl text-black font-bold'
                            >
                                no image yet
                            </div>
                            <img //
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                src={assets.public_illustrations_image_home_transp_webp}
                                alt='last generated image'
                            />
                        </div>
                    )}
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
    latentUrl?: string
    img?: Maybe<ImageL>
} => {
    const errorURL = assets.public_illustrations_image_home_jpg
    if (imageID === 'latent') return { url: st.preview?.url ?? errorURL }
    if (imageID != null) {
        const img = st.db.images.get(imageID)
        return { url: img?.url ?? errorURL, img }
    }
    if (imageID == null) {
        if (st.showPreviewInPanel) {
            if (st.hovered) return { url: st.hovered.url }
        }
        if (st.showLatentPreviewInLastImagePanel) {
            const lastImage = st.db.images.last()
            const latent = st.preview
            if (latent == null) return { url: lastImage?.url ?? errorURL, img: lastImage }
            if (lastImage == null) return { url: latent.url }
            return {
                url: lastImage.url,
                img: lastImage,
                latentUrl:
                    latent.receivedAt > lastImage.createdAt //
                        ? latent.url
                        : undefined,
            }
        } else {
            const lastImage = st.db.images.last()
            return { url: lastImage?.url ?? errorURL, img: lastImage }
        }
    }
    return { url: errorURL }
}
