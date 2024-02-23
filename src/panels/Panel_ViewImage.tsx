import type { MediaImageL } from 'src/models/MediaImage'

import { observer } from 'mobx-react-lite'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { ImageDropdownUI } from './ImageDropdownUI'
import { formatSize } from 'src/db/getDBStats'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Rate } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { assets } from 'src/utils/assets/assets'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

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
    const background = st.galleryConf.get('galleryBgColor')

    const shouldFilter = st.project.filterNSFW
    const safety =
        img?.url && shouldFilter //
            ? st.safetyChecker.isSafe(img?.url)
            : null

    return (
        <div className={p.className} style={{ background }} tw='flex flex-col flex-grow bg-base-100 relative'>
            <ImageActionBarUI img={img} />
            {shouldFilter && <pre>{JSON.stringify(safety?.value)}</pre>}
            <TransformWrapper centerZoomedOut centerOnInit>
                <TransformComponent
                    wrapperStyle={{ height: '100%', width: '100%', display: 'flex' }}
                    contentStyle={{ height: '100%', width: '100%' }}
                >
                    {url ? (
                        <img //
                            style={{
                                filter: !st.project.filterNSFW
                                    ? undefined
                                    : safety?.value == null //
                                    ? 'blur(50px)'
                                    : safety.value.isSafe
                                    ? undefined
                                    : 'blur(50px)',
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
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
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
})

export const ImageActionBarUI = observer(function ImageActionBarUI_(p: { img?: Maybe<MediaImageL> }) {
    const st = useSt()
    const img = p.img
    return (
        <div tw='flex items-center gap-1 flex-wrap'>
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
            <RevealUI>
                <div tw='flex items-center'>
                    <span className='material-symbols-outlined'>info</span>
                    infos
                </div>
                <div>
                    <div>Data</div>
                    <JsonViewUI value={img?.data}></JsonViewUI>
                    <div>meta</div>
                    <JsonViewUI value={img?.ComfyNodeMetadta ?? undefined}></JsonViewUI>
                    <div>node</div>
                    <JsonViewUI value={img?.ComfyNode ?? undefined}></JsonViewUI>
                </div>
            </RevealUI>
            <div tw='btn btn-sm btn-narrow' onClick={() => img?.openInCanvasEditor()}>
                <span className='material-symbols-outlined'>edit</span>
                Canvas
            </div>
            <div
                tw='btn btn-sm btn-narrow'
                onClick={() => {
                    if (img == null) return
                    img.openInImageEditor()
                }}
            >
                <span className='material-symbols-outlined'>edit</span>
                Paint
            </div>
            <div
                tw='btn btn-sm btn-narrow'
                onClick={() => {
                    if (img == null) return
                    st.db.media_images.delete(img.id)
                }}
            >
                <span className='material-symbols-outlined'>delete_forever</span>
                Delete
            </div>

            {/* 3. OPEN OUTPUT FOLDER */}
            {img ? <ImageDropdownUI img={img} /> : null}
            {img ? (
                <>
                    <div tw='virtualBorder p-1 text-sm'>{`${img.data.width ?? '?'} x ${img?.data.height ?? '?'}`}</div>
                    {img.data.fileSize && <div tw='virtualBorder p-1 text-sm'>{`${formatSize(img.data.fileSize)}`}</div>}
                    <div tw='virtualBorder p-1'>{`${img.data.hash?.slice(0, 5)}...`}</div>
                </>
            ) : null}
            {img?.ComfyNodeMetadta?.tag && <div tw='badge badge-primary'>{img?.ComfyNodeMetadta?.tag}</div>}
        </div>
    )
})
