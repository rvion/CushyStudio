import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import type { ImageID, ImageL } from 'src/models/Image'

import { observer } from 'mobx-react-lite'
import { Button, Rate, Toggle } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { openExternal } from './openExternal'

export const LastImageUI = observer(function LastImageUI_(p: { imageID?: ImageID }) {
    const st = useSt()
    const img: Maybe<ImageL> = p.imageID //
        ? st.db.images.get(p.imageID)
        : st.db.images.last()
    const imgFolder = img ? `file://${img.localAbsolutePath}/..` : null
    if (img == null) return null
    return (
        <div
            tw='w-full h-full flex flex-col'
            style={{
                background: st.configFile.value.galleryBgColor,
            }}
        >
            <div tw='flex gap-2 p-0.5'>
                {/* <ButtonGroup disabled size='xs'>
                    <Button>fit</Button>
                    <Button appearance='primary'>original</Button>
                    <Button>cover</Button>
                </ButtonGroup> */}
                <Rate size='xs' onChange={(next) => img.update({ star: next })} value={img.data.star} />
                <div>
                    <Toggle
                        checked={st.showLatentPreviewInLastImagePanel}
                        onChange={(next) => (st.showLatentPreviewInLastImagePanel = next)}
                    />
                    <span tw='text-light'>include sampler preview</span>
                </div>
                {imgFolder && (
                    <Button
                        startIcon={<span className='material-symbols-outlined'>folder</span>}
                        size='xs'
                        appearance='link'
                        onClick={() => openExternal(imgFolder)}
                    >
                        open folder
                    </Button>
                )}
            </div>
            <TransformWrapper centerZoomedOut centerOnInit>
                <TransformComponent
                    wrapperStyle={{ /* border: '5px solid #b53737', */ height: '100%', width: '100%' }}
                    contentStyle={{ /* border: '5px solid #38731f', */ height: '100%', width: '100%' }}
                >
                    <img
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        src={img.url}
                        alt='last generated image'
                    />
                    {/* </div> */}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
})
