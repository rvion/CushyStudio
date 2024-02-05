import { Image, Layer, Stage } from 'react-konva'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useSt } from '../../state/stateContext'

import * as React from 'react'
import { MediaImageL } from 'src/models/MediaImage'
import { useImageDrop } from 'src/widgets/galleries/dnd'
import { PanelCanvasState } from './PanelCanvasState'
import { onWheelScrollCanvas } from './onWheelScrollCanvas'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { toastError } from 'src/utils/misc/toasts'
import { CanvasSelectionUI } from './CanvasSelectionUI'
import SortableList, { SortableItem } from 'react-easy-sort'
import { useSize } from './useSize'

// https://github.com/devforth/painterro
export const Panel_Canvas = observer(function Panel_Canvas_(p: {
    //
    imgID?: MediaImageID
}) {
    const st = useSt()
    const img0 = st.db.media_images.get(p.imgID!)
    const uist = useMemo(() => {
        if (img0 == null) throw new Error('img0 is null')
        return new PanelCanvasState(st, img0)
    }, [img0])
    if (img0 == null) return <>❌ error</>
    const w = img0.data.width
    const h = img0.data.width
    const [dropStyle, dropRef] = useImageDrop(st, (img) => {
        runInAction(() => uist.images.push({ img }))
    })

    const target = React.useRef<HTMLDivElement>(null)
    const size = useSize(target)
    const imgs = uist.images // [img]
    return (
        <div
            //
            style={dropStyle}
            ref={dropRef}
            className='DROP_IMAGE_HANDLER'
            tw='_Panel_Canvas flex-grow flex flex-row h-full'
        >
            <div tw='virtualBorder flex flex-col gap-2'>
                <section>
                    <div tw='btn btn-sm w-full btn-primary' onClick={uist.saveImage}>
                        Save selection as image
                    </div>
                </section>
                <section>
                    <div tw='divider my-2'>
                        Selections
                        <div
                            tw='btn btn-sm btn-square'
                            onClick={() => {
                                toastError('not implemented')
                            }}
                        >
                            <span className='material-symbols-outlined'>add</span>
                        </div>
                    </div>
                    <RevealUI>
                        <div tw='btn btn-sm w-full'>Selection 0</div>
                        <pre>{JSON.stringify(uist.stableData, null, 4)}</pre>
                    </RevealUI>
                </section>
                <section>
                    <div tw='divider my-2'>Images</div>
                    <SortableList onSortEnd={() => {}} className='list' draggedItemClassName='dragged'>
                        {imgs.map((p: { img: MediaImageL }) => {
                            // const img = p.img
                            return (
                                <SortableItem key={p.img.id}>
                                    <div tw='flex'>
                                        {/*  */}
                                        <div className='btn btn-square btn-sm btn-ghost'>
                                            <span className='material-symbols-outlined'>delete</span>
                                        </div>
                                        <div tw='btn btn-sm'>{p.img.filename}</div>
                                    </div>
                                </SortableItem>
                            )
                        })}
                    </SortableList>
                </section>
            </div>
            <div ref={target} tw='flex-1'>
                <Stage
                    onWheel={onWheelScrollCanvas()}
                    width={size?.width ?? img0.width}
                    height={size?.height ?? img0.height}
                    onContextMenu={(e) => {
                        uist.saveImage()
                        // e.evt.preventDefault()
                        // console.log('context menu')
                        // // get image from stage
                        // const dataURL = e.target.toDataURL()
                        // console.log(dataURL)
                    }}
                >
                    {imgs.map(({ img }) => (
                        <Layer key={img?.id}>
                            {/* <Text text='Try to drag a star' /> */}
                            {img?.url ? ( //
                                <Image draggable image={img.asHTMLImageElement_noWait} />
                            ) : null}
                            <CanvasSelectionUI uist={uist} />
                        </Layer>
                    ))}
                </Stage>
            </div>
        </div>
    )
})
