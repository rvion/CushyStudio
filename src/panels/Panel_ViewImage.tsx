import type { MediaImageL } from 'src/models/MediaImage'
import type { STATE } from 'src/state/state'

import { observer } from 'mobx-react-lite'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { Rate, Toggle } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { assets } from 'src/utils/assets/assets'
import { openExternal, showItemInFolder } from '../app/layout/openExternal'

export const Panel_ViewImage = observer(function Panel_ViewImage_(p: {
    //
    className?: string
    imageID?: MediaImageID | 'latent'
}) {
    const st = useSt()
    const img: Maybe<MediaImageL> = p.imageID //
        ? st.db.media_images.get(p.imageID)
        : st.db.media_images.last()
    const url = img?.url
    // const { img, url, latentUrl } = getPreviewType(st, p.imageID)
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
                    {/* {latentUrl && (
                        <img //
                            tw='absolute bottom-0 right-0 shadow-xl'
                            style={{ width: st.latentSizeStr, height: st.latentSizeStr, objectFit: 'contain' }}
                            src={latentUrl}
                            alt='last generated image'
                        />
                    )} */}
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
                                src={assets.illustrations_image_home_transp_webp}
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
