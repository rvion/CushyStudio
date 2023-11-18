import type { STATE } from 'src/state/state'
import type { ImageID, ImageL } from 'src/models/Image'

import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { observer } from 'mobx-react-lite'
import { Button, Dropdown, DropdownItem, Rate, Toggle } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { openExternal, showItemInFolder } from '../app/layout/openExternal'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'

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
            <div tw='flex items-start gap-2 p-0.5 bg-base-200'>
                {/* 1. RATER */}

                <FieldAndLabelUI label='Rating'>
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
                </FieldAndLabelUI>

                {/* 2. LATENT PREVIEW TOOGLE */}
                {/* (only on "last-image" mode; when p.imageID is null )  */}
                {p.imageID == null ? (
                    <FieldAndLabelUI label='Sampler'>
                        <Toggle
                            checked={st.showLatentPreviewInLastImagePanel}
                            onChange={(ev) => (st.showLatentPreviewInLastImagePanel = ev.target.checked)}
                        />
                    </FieldAndLabelUI>
                ) : null}

                <FieldAndLabelUI label='Size'>
                    <input tw='input input-bordered input-xs' value={`${img?.data.width ?? '?'} x ${img?.data.height ?? '?'}`} />
                </FieldAndLabelUI>
                {/* 3. OPEN OUTPUT FOLDER */}
                <Dropdown title='Actions'>
                    <DropdownItem
                        icon={<span className='material-symbols-outlined'>folder</span>}
                        size='xs'
                        // appearance='subtle'
                        disabled={!img?.localAbsolutePath}
                        onClick={() => {
                            if (!img?.localAbsolutePath) return
                            showItemInFolder(img.localAbsolutePath)
                        }}
                    >
                        open folder
                    </DropdownItem>
                    {/* 3. OPEN FILE ITSELF */}
                    <DropdownItem
                        icon={<span className='material-symbols-outlined'>folder</span>}
                        size='xs'
                        // appearance='subtle'
                        disabled={!img?.localAbsolutePath}
                        onClick={() => {
                            if (imgPathWithFileProtocol == null) return
                            openExternal(imgPathWithFileProtocol)
                        }}
                    >
                        open
                    </DropdownItem>
                </Dropdown>
            </div>
            <TransformWrapper centerZoomedOut centerOnInit>
                <TransformComponent
                    wrapperStyle={{ /* border: '5px solid #b53737', */ height: '100%', width: '100%' }}
                    contentStyle={{ /* border: '5px solid #38731f', */ height: '100%', width: '100%' }}
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
