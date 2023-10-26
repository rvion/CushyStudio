import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import type { ImageID } from 'src/models/Image'

import { observer } from 'mobx-react-lite'
import { Rate } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'

export const LastImageUI = observer(function LastImageUI_(p: { imageID?: ImageID }) {
    const st = useSt()
    const imgs = p.imageID //
        ? st.db.images.get(p.imageID)
        : st.db.images.last()
    if (imgs == null) return null
    return (
        <div tw='w-full h-full flex flex-col'>
            <div tw='flex gap-2 p-0.5'>
                {/* <ButtonGroup disabled size='xs'>
                    <Button>fit</Button>
                    <Button appearance='primary'>original</Button>
                    <Button>cover</Button>
                </ButtonGroup> */}
                <Rate size='xs' onChange={(next) => imgs.update({ star: next })} value={imgs.data.star} />
            </div>
            <TransformWrapper centerZoomedOut centerOnInit>
                <TransformComponent
                    wrapperStyle={{ /* border: '5px solid #b53737', */ height: '100%', width: '100%' }}
                    contentStyle={{ /* border: '5px solid #38731f', */ height: '100%', width: '100%' }}
                >
                    <img
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        src={imgs.url}
                        alt='last generated image'
                    />
                    {/* </div> */}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
})
