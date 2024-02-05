import { Image, Layer, Stage } from 'react-konva'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useSt } from '../../state/stateContext'

import * as React from 'react'
import { MediaImageL } from 'src/models/MediaImage'
import { useImageDrop } from 'src/widgets/galleries/dnd'
import { UnifiedCanvas } from './states/UnifiedCanvas'
import { onWheelScrollCanvas } from './behaviours/onWheelScrollCanvas'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { toastError } from 'src/utils/misc/toasts'
import { CanvasSelectionUI } from './uis/CanvasSelectionUI'
import SortableList, { SortableItem } from 'react-easy-sort'
import { useSize } from './useSize'

// https://github.com/devforth/painterro
export const Panel_Canvas = observer(function Panel_Canvas_(p: {
    //
    imgID?: MediaImageID
}) {
    const st = useSt()
    const img0 = st.db.media_images.get(p.imgID!)

    const canvas = useMemo(() => {
        if (img0 == null) throw new Error('img0 is null')
        return new UnifiedCanvas(st, img0)
    }, [img0])

    if (img0 == null) return <>❌ error</>
    const w = img0.data.width
    const h = img0.data.width
    const [dropStyle, dropRef] = useImageDrop(st, (img) => {
        runInAction(() => canvas.images.push({ img }))
    })

    const target = React.useRef<HTMLDivElement>(null)
    const size = useSize(target)
    return (
        <div
            //
            style={dropStyle}
            ref={dropRef}
            className='DROP_IMAGE_HANDLER'
            tw='_Panel_Canvas flex-grow flex flex-row h-full'
        >
            <div tw='virtualBorder flex flex-col gap-2'>
                {/* TOP LEVEL BUTTON */}
                <div tw='bd1'>
                    Virtual images for your form
                    <div tw='m-1 flex gap-1'>
                        <div tw='btn btn-square bd1'>Image</div>
                        <div tw='btn btn-square bd1'>Mask</div>
                    </div>
                </div>

                {/* GRID SIZE */}
                <div tw='flex gap-1 items-center'>
                    {/*  */}
                    snap:
                    <input tw='input input-bordered input-sm w-24' type='number' value={canvas.snapSize} />
                    x
                    <input tw='input input-bordered input-sm w-24' type='number' value={canvas.snapSize} />
                </div>
                {/* SELECTIONS */}
                <div tw='bd1'>
                    <div tw='flex items-center justify-between'>
                        Selections
                        <div tw='btn btn-sm btn-square btn-outline' onClick={canvas.addSelection}>
                            <span className='material-symbols-outlined'>add</span>
                        </div>
                    </div>
                    <div tw='w-full bd1 m-1'>
                        {canvas.selections.map((uniSel) => (
                            <div key={uniSel.id} className='flex whitespace-nowrap justify-between'>
                                <div tw='flex gap-1 items-center'>
                                    <input
                                        type='radio'
                                        checked={canvas.activeSelection === uniSel}
                                        onChange={() => (canvas.activeSelection = uniSel)}
                                        name='active'
                                        className='radio'
                                    />
                                    <div>Selection 0</div>
                                </div>
                                <div
                                    //
                                    tw='btn btn-sm btn-square btn-outline'
                                    onClick={uniSel.saveImage}
                                >
                                    <span className='material-symbols-outlined'>save</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <RevealUI>
                        <pre>{JSON.stringify(uist.stableData, null, 4)}</pre>
                    </RevealUI> */}
                </div>

                {/* Masks */}
                <div tw='bd1'>
                    <div tw='flex items-center justify-between'>
                        <div>Masks</div>
                        <div
                            tw='btn btn-sm btn-square btn-outline'
                            onClick={() => {
                                toastError('not implemented')
                            }}
                        >
                            <span className='material-symbols-outlined'>add</span>
                        </div>
                    </div>
                    <div tw='flex items-center gap-1 w-full'>
                        <input type='radio' name='radio-1' className='radio' />
                        <input type='checkbox' checked className='checkbox' />
                        <div className='flex whitespace-nowrap items-center'>
                            <div>masks 0</div>
                            {/* <div tw='btn btn-square bd1'>Image</div> */}
                            {/* <div tw='btn btn-square bd1'>Mask</div> */}
                        </div>
                    </div>
                </div>

                {/* TOP LEVEL BUTTON */}
                <div tw='bd1'>
                    Images
                    <SortableList onSortEnd={() => {}} className='list' draggedItemClassName='dragged'>
                        {canvas.images.map((p: { img: MediaImageL }) => {
                            // const img = p.img
                            return (
                                <SortableItem key={p.img.id}>
                                    <div tw='flex'>
                                        {/*  */}
                                        <input type='radio' name='radio-1' className='radio' />
                                        <input type='checkbox' checked className='checkbox' />
                                        <div tw='btn btn-sm'>{p.img.filename}</div>
                                        <div className='btn btn-square btn-sm btn-ghost'>
                                            <span className='material-symbols-outlined'>delete</span>
                                        </div>
                                    </div>
                                </SortableItem>
                            )
                        })}
                    </SortableList>
                </div>
            </div>
            <div ref={target} tw='flex-1'>
                <Stage
                    onWheel={onWheelScrollCanvas()}
                    width={size?.width ?? img0.width}
                    height={size?.height ?? img0.height}
                    // ⏸️ onContextMenu={(e) => {
                    // ⏸️     uist.saveImage()
                    // ⏸️     // e.evt.preventDefault()
                    // ⏸️     // console.log('context menu')
                    // ⏸️     // // get image from stage
                    // ⏸️     // const dataURL = e.target.toDataURL()
                    // ⏸️     // console.log(dataURL)
                    // ⏸️ }}
                >
                    {canvas.images.map(({ img }) => (
                        <Layer key={img?.id}>
                            {/* <Text text='Try to drag a star' /> */}
                            {img?.url ? ( //
                                <Image draggable image={img.asHTMLImageElement_noWait} />
                            ) : null}
                        </Layer>
                    ))}

                    {canvas.masks.map(({ img }) => (
                        <Layer key={img?.id}>
                            {/* <Text text='Try to drag a star' /> */}
                            {img?.url ? ( //
                                <Image draggable image={img.asHTMLImageElement_noWait} />
                            ) : null}
                        </Layer>
                    ))}

                    {canvas.selections.map((uniSel) => (
                        <Layer key={uniSel.id}>
                            <CanvasSelectionUI key={uniSel.id} uniSel={uniSel} />
                        </Layer>
                    ))}
                </Stage>
            </div>
        </div>
    )
})
