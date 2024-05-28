import type { MediaImageL } from '../models/MediaImage'

import { observer } from 'mobx-react-lite'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { SpacerUI } from '../controls/widgets/spacer/SpacerUI'
import { formatSize } from '../db/getDBStats'
import { Button } from '../rsuite/button/Button'
import { Frame } from '../rsuite/button/Frame'
import { RevealUI } from '../rsuite/reveal/RevealUI'
import { Rate } from '../rsuite/shims'
import { useSt } from '../state/stateContext'
import { Box } from '../theme/colorEngine/Box'
import { assets } from '../utils/assets/assets'
import { JsonViewUI } from '../widgets/workspace/JsonViewUI'
import { ImageDropdownUI } from './ImageDropdownUI'
import { PanelHeaderUI } from './PanelHeader'

export const Panel_ViewImage = observer(function Panel_ViewImage_(p: {
    //
    className?: string
    imageID?: MediaImageID | 'latent'
}) {
    const st = useSt()
    const img: Maybe<MediaImageL> = p.imageID //
        ? st.db.media_image.get(p.imageID)
        : st.db.media_image.last()
    const url = img?.url
    const background = st.galleryConf.root.get('galleryBgColor')

    const shouldFilter = st.project.filterNSFW
    const safety =
        img?.url && shouldFilter //
            ? st.safetyChecker.isSafe(img?.url)
            : null

    return (
        <div className={p.className} style={{ background }} tw='flex flex-col flex-grow  relative'>
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
    const isStarred = Boolean(img?.data.star)
    return (
        <PanelHeaderUI>
            {/* <FieldAndLabelUI label='Rating'> */}
            <Button
                // subtle
                icon='mdiStar'
                active={isStarred}
                onClick={() => img?.update({ star: isStarred ? 0 : 1 })}
                // default // Star Button
                // border={3}
                // tw='WIDGET-FIELD flex px-1 cursor-default rounded h-full items-center justify-center hover:brightness-125 border border-base-100'
            >
                {/* <Rate
                    name={img?.id ?? 'latent'}
                    value={img?.data.star ?? 0}
                    disabled={img == null}
                /> */}
            </Button>

            <div tw='h-5  mx-1' style={{ width: '1px' }}></div>

            <div tw='join'>
                <Button // Canvas Button
                    onClick={() => img?.openInCanvasEditor()}
                    disabled={img == null}
                    icon='mdiShapeSquareRoundedPlus'
                >
                    Canvas
                </Button>
                <Button // Paint Button
                    icon='mdiFormatPaint'
                    disabled={img == null}
                    onClick={() => img?.openInImageEditor()}
                >
                    Paint
                </Button>
            </div>

            <div tw='h-5  mx-1' style={{ width: '1px' }}></div>

            {img ? <ImageDropdownUI tw='WIDGET-FIELD' img={img} /> : null}

            <SpacerUI />

            {/* Image Info Button */}
            <RevealUI
                tw='hover:brightness-125 rounded text-shadow'
                content={() => (
                    <div>
                        <div>Data</div>
                        <JsonViewUI value={img?.data}></JsonViewUI>
                        <div>meta</div>
                        <JsonViewUI value={img?.ComfyNodeMetadta ?? undefined}></JsonViewUI>
                        <div>node</div>
                        <JsonViewUI value={img?.ComfyNode ?? undefined}></JsonViewUI>
                    </div>
                )}
            >
                <div tw='WIDGET-FIELD flex px-2 cursor-default rounded items-center justify-center border border-base-100 text-sm'>
                    <span className='material-symbols-outlined'>info</span>

                    {img ? (
                        <>
                            <div tw='WIDGET-FIELD p-1 truncate'>{`${img.data.width ?? '?'} x ${img?.data.height ?? '?'}`}</div>
                            {img.data.fileSize && (
                                <div tw='WIDGET-FIELD border-l border-base-100 p-1 truncate'>{`${formatSize(
                                    img.data.fileSize,
                                )}`}</div>
                            )}
                            <div tw='WIDGET-FIELD border-l border-base-100 p-1 truncate'>{`${img.data.hash?.slice(
                                0,
                                5,
                            )}...`}</div>
                        </>
                    ) : null}
                    {img?.ComfyNodeMetadta?.tag && <div tw='badge badge-primary'>{img?.ComfyNodeMetadta?.tag}</div>}
                    {img?.tags.map((t) => (
                        <div key={t} tw='italic'>
                            #{t}
                        </div>
                    ))}
                </div>
            </RevealUI>

            <Box base={5} tw='h-5 mx-1' style={{ width: '1px' }}></Box>

            <div // Delete button
                tw='WIDGET flex px-1 cursor-default bg-warning text-warning-content rounded h-full items-center justify-center hover:brightness-110 border border-base-100 text-shadow-inv text-sm'
                onClick={() => {
                    if (img == null) return
                    st.db.media_image.delete(img.id)
                }}
            >
                <span className='material-symbols-outlined'>delete_forever</span>
                <p tw='px-1'>Delete</p>
            </div>
        </PanelHeaderUI>
    )
})
