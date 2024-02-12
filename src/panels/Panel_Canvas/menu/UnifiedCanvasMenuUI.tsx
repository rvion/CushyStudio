import { observer } from 'mobx-react-lite'
import SortableList, { SortableItem } from 'react-easy-sort'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { MediaImageL } from 'src/models/MediaImage'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { useSt } from 'src/state/stateContext'
import { toastError } from 'src/utils/misc/toasts'
import { useUnifiedCanvas } from '../UnifiedCanvasCtx'
import { useImageDrop } from 'src/widgets/galleries/dnd'

export const UnifiedCanvasMenuUI = observer(function UnifiedCanvasMenuUI_(p: {}) {
    const canvas = useUnifiedCanvas()
    const st = useSt()
    const [dropStyle2, dropRef2] = useImageDrop(st, (img) => canvas.addMask(img))
    return (
        <div tw='virtualBorder flex flex-col gap-2'>
            <div
                onClick={() => {
                    canvas.undo()
                }}
                className='btn'
            >
                Undo (stack.size={canvas.undoBuffer.length})
            </div>
            {/*  */}
            {/* TOP LEVEL BUTTON */}
            <div tw='bd1'>
                Virtual images for your form
                <div tw='m-1 flex gap-1'>
                    <div tw='btn btn-square bd1'>Image</div>
                    <div tw='btn btn-square bd1'>Mask</div>
                </div>
            </div>
            <div tw='bd'>
                <div
                    tw='btn btn-primary'
                    onClick={() => {
                        // create
                        // canvas.activeMask?.saveMask()
                        const res = canvas.activeSelection.saveImage()
                        if (res == null) return toastError('❌ FAILED to canvas.activeSelection.saveImage')
                        const { image, mask } = res

                        // quick check
                        if (image == null) return toastError('❌ image is null')
                        if (mask == null) return toastError('❌ mask is null')

                        // showcase
                        const draft = st.db.drafts.get('HU3BR0X9yd6qB3rWTH3Dd')
                        if (draft == null) return toastError('❌ draft(id=HU3BR0X9yd6qB3rWTH3Dd) not found')
                        draft.start(null, image)
                    }}
                >
                    AMAZE YOURSEF
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
            <div style={{ border: '1px solid cyan' }}>
                <div tw='flex items-center gap-2'>
                    Mode:
                    <div
                        onClick={() => (canvas.mode = 'move')}
                        tw={['btn btn-sm', canvas.mode === 'move' ? 'btn-primary' : null]}
                    >
                        Move
                    </div>
                    <div
                        onClick={() => (canvas.mode = 'mask')}
                        tw={['btn btn-sm', canvas.mode === 'mask' ? 'btn-primary' : null]}
                    >
                        Mask
                    </div>
                </div>
                <div tw='flex items-center gap-2'>
                    Tool:
                    <div
                        onClick={() => (canvas.maskTool = 'paint')}
                        tw={['btn btn-sm', canvas.maskTool === 'paint' ? 'btn-primary' : null]}
                    >
                        Paint
                    </div>
                    <div
                        onClick={() => (canvas.maskTool = 'erase')}
                        tw={['btn btn-sm', canvas.maskTool === 'erase' ? 'btn-primary' : null]}
                    >
                        Mask
                    </div>
                </div>
                <div tw='flex items-center gap-2'>
                    size:
                    <InputNumberUI //
                        mode='int'
                        value={canvas.maskToolSize}
                        onValueChange={(next) => (canvas.maskToolSize = next)}
                        min={1}
                        max={1000}
                    />
                    px
                </div>
                <div tw='flex items-center gap-2'>
                    <ComboUI combo={'mod+m'} /> toggle mode
                </div>
                <div tw='flex items-center gap-2'>
                    <ComboUI combo={'mod+t'} /> toggle tools
                </div>
                <div tw='flex items-center gap-2'>
                    <ComboUI combo={'mod+shift+x'} /> increase tool weight
                </div>
                <div tw='flex items-center gap-2'>
                    <ComboUI combo={'mod+shift+y'} /> decrease tool weight
                </div>
            </div>
            {/* Masks */}
            <div tw='bd1' style={dropStyle2} ref={dropRef2}>
                <div tw='flex items-center justify-between'>
                    <div>Masks</div>
                    <div
                        tw='btn btn-sm btn-square btn-outline'
                        onClick={() => {
                            canvas.addMask()
                        }}
                    >
                        <span className='material-symbols-outlined'>add</span>
                    </div>
                </div>
                {canvas.masks.map((mask) => {
                    const active = mask === canvas.activeMask
                    return (
                        <div key={mask.uid} tw='flex items-center gap-1 w-full'>
                            <input
                                type='radio'
                                checked={active}
                                name='radio-1'
                                className='radio'
                                onChange={() => {
                                    canvas.activeMask = mask
                                }}
                            />
                            <div className='flex whitespace-nowrap items-center'>
                                <div
                                    tw='btn btn-sm btn-outline'
                                    onClick={() => {
                                        canvas.activeMask = mask
                                    }}
                                >
                                    {mask.uid}
                                </div>
                                <input
                                    value={mask.name}
                                    onChange={(ev) => (mask.name = ev.target.value)}
                                    tw='input input-sm'
                                    type='text'
                                />
                                {/* <div tw='btn btn-square bd1'>Image</div> */}
                                {/* <div tw='btn btn-square bd1'>Mask</div> */}
                            </div>
                        </div>
                    )
                })}
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
            {/* DEBUG */}
            <div className='w-96'>
                <pre>{JSON.stringify(canvas.infos, null, 3)}</pre>
            </div>
        </div>
    )
})
