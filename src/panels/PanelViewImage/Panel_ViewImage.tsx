import type { MediaImageL } from '../../models/MediaImage'

import { observer } from 'mobx-react-lite'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { BadgeListUI } from '../../csuite/badge/BadgeListUI'
import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { Ikon } from '../../csuite/icons/iconHelpers'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { JsonViewUI } from '../../csuite/json/JsonViewUI'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { formatSize } from '../../csuite/utils/formatSize'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { assets } from '../../utils/assets/assets'
import { ImageDropdownUI } from '../ImageDropdownUI'

export const PanelViewImage = new Panel({
    name: 'Image',
    category: 'outputs',
    widget: (): React.FC<PanelViewImageProps> => PanelViewImageUI,
    header: (p): PanelHeader => ({ title: 'Image', icon: 'mdiCameraImage' }),
    def: (): PanelViewImageProps => ({}),
    icon: 'mdiCameraImage',
})

export const PanelLastImage = new Panel({
    name: 'LastImage',
    category: 'outputs',
    widget: (): React.FC<PanelViewImageProps> => PanelViewImageUI,
    header: (p): PanelHeader => ({ title: 'LastImage', icon: 'mdiImageSyncOutline' }),
    def: (): PanelViewImageProps => ({}),
    icon: 'mdiImageSyncOutline',
})

export type PanelViewImageProps = {
    className?: string
    imageID?: MediaImageID | 'latent'
}

export const PanelViewImageUI = observer(function PanelViewImageUI_(p: PanelViewImageProps) {
    const st = useSt()
    const img: Maybe<MediaImageL> = p.imageID //
        ? st.db.media_image.get(p.imageID)
        : st.db.media_image.last()
    const url = img?.url
    const background = st.galleryConf.value.galleryBgColor ?? undefined

    const shouldFilter = st.project.filterNSFW
    const safety =
        img?.url && shouldFilter //
            ? st.safetyChecker.isSafe(img?.url)
            : null

    return (
        <div
            //
            className={p.className}
            style={{ background }}
            tw='flex flex-col flex-grow w-full'
        >
            <ImageActionBarUI img={img} />
            {/* 🟢 test2 */}
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
        <div>
            <PanelHeaderUI>
                {img ? <ImageDropdownUI tw='h-input' img={img} /> : null}
                <Button // rating button
                    square
                    icon='mdiStar'
                    active={isStarred}
                    borderless
                    onClick={() => img?.update({ star: isStarred ? 0 : 1 })}
                />
                <Button // Canvas Button
                    onClick={() => img?.openInCanvasEditor()}
                    disabled={img == null}
                    icon='mdiVectorSquareEdit'
                    borderless
                    children='Canvas'
                />
                <Button // Paint Button
                    icon='mdiBrush'
                    disabled={img == null}
                    borderless
                    onClick={() => img?.openInImageEditor()}
                >
                    Paint
                </Button>
                <SpacerUI />
                <Button // Delete button
                    look='warning'
                    tooltip='Delete Image'
                    icon='mdiDeleteForever'
                    iconSize='1.2rem'
                    onClick={() => {
                        if (img == null) return
                        st.db.media_image.delete(img.id)
                    }}
                />
            </PanelHeaderUI>
            <PanelHeaderUI>
                <InputStringUI
                    icon='mdiTagEdit'
                    getValue={() => img?.data.tags ?? ''}
                    setValue={(next) => {
                        if (!img) return
                        img.tags = next
                    }}
                ></InputStringUI>
                <div>
                    <BadgeListUI
                        wrap={false}
                        badges={img?.data.tags?.split(',')}
                        onClick={(tag) => img?.removeTag(tag.toString())}
                    ></BadgeListUI>
                </div>
                {/* Image Info Button */}
                <RevealUI
                    tw='hover:brightness-125 rounded text-shadow'
                    content={() => (
                        <div>
                            <div>Data</div>
                            <JsonViewUI value={img?.data}></JsonViewUI>
                            <div>meta</div>
                            <JsonViewUI value={img?.ComfyNodeMetadata ?? undefined}></JsonViewUI>
                            <div>node</div>
                            <JsonViewUI value={img?.ComfyNode ?? undefined}></JsonViewUI>
                        </div>
                    )}
                >
                    <div tw='h-input flex px-2 cursor-default rounded items-center justify-center border border-base-100 text-sm'>
                        {img ? (
                            <>
                                <div tw='h-input truncate'>{`${img.data.width ?? '?'} x ${img?.data.height ?? '?'}`}</div>
                                {img.data.fileSize && (
                                    <div tw='h-input border-l border-base-100 p-1 truncate'>{`${formatSize(img.data.fileSize)}`}</div>
                                )}
                                <div tw='h-input border-l border-base-100 p-1 truncate'>{`${img.data.hash?.slice(0, 5)}...`}</div>
                            </>
                        ) : null}
                        {/* {img?.ComfyNodeMetadata?.tag && <div tw='badge badge-primary'>{img?.ComfyNodeMetadata?.tag}</div>} */}
                        {/* {img?.tags.map((t) => (
                        <div key={t} tw='italic'>
                            #{t}
                        </div>
                    ))} */}
                    </div>
                </RevealUI>
                <Frame base={5} tw='h-5 mx-1' style={{ width: '1px' }}></Frame>
            </PanelHeaderUI>
        </div>
    )
})
