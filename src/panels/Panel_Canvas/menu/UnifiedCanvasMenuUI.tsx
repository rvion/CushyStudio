import { observer } from 'mobx-react-lite'
import SortableList, { SortableItem } from 'react-easy-sort'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { MediaImageL } from 'src/models/MediaImage'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { useSt } from 'src/state/stateContext'
import { useImageDrop } from 'src/widgets/galleries/dnd'
import { useUnifiedCanvas } from '../UnifiedCanvasCtx'
import { toastError } from 'src/utils/misc/toasts'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'

export const UnifiedCanvasMenuUI = observer(function UnifiedCanvasMenuUI_(p: {}) {
    const canvas = useUnifiedCanvas()
    const st = useSt()
    const [dropStyle2, dropRef2] = useImageDrop(st, (img) => canvas.addMask(img))
    return (
        <div tw='virtualBorder flex flex-col gap-1 m-2 bg-base-200 absolute right-10 z-50'>
            <CanvasToolbarUI />
            <div>
                <div onClick={() => canvas.undo()} className='btn btn-sm btn-outline'>
                    Undo (stack.size={canvas.undoBuffer.length})
                </div>
            </div>
            {/* GRID SIZE */}
            <div tw='bd1 p-1 flex gap-1 items-center'>
                {/*  */}
                <input checked tw='checkbox' type='checkbox' />
                grid snap:
                <input tw='input input-bordered input-sm w-24' type='number' value={canvas.snapSize} /> px
                {/* x */}
                {/* <input tw='input input-bordered input-sm w-24' type='number' value={canvas.snapSize} /> */}
            </div>
            {/* TOP LEVEL BUTTON */}
            <div tw='bd1'>
                Layers
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
            {/*  */}
            {/* TOP LEVEL BUTTON */}
            {/* <div tw='bd1'>
                Virtual images for your form
                <div tw='m-1 flex gap-1'>
                    <div tw='btn btn-square bd1'>Image</div>
                    <div tw='btn btn-square bd1'>Mask</div>
                </div>
            </div> */}
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
                        draft.start({ imageToStartFrom: image })
                    }}
                >
                    AMAZE YOURSEF
                </div>
            </div>
            <div tw='bd1 p-1'>
                {/* <div tw='flex items-center gap-2'>
                    Mode:
                    <div
                        onClick={() => (canvas.tool = 'move')}
                        tw={['btn btn-sm', canvas.tool === 'move' ? 'btn-primary' : null]}
                    >
                        Move
                    </div>
                    <div
                        onClick={() => (canvas.tool = 'mask')}
                        tw={['btn btn-sm', canvas.tool === 'mask' ? 'btn-primary' : null]}
                    >
                        Mask
                    </div>
                </div> */}
                Brush
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
                {/*
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
                1*/}
            </div>

            {/* SELECTIONS */}
            <div tw='bd1 p-1'>
                <div tw='flex items-center justify-between'>
                    Selections
                    <div tw='btn btn-sm btn-square btn-outline' onClick={canvas.addSelection}>
                        <span className='material-symbols-outlined'>add</span>
                    </div>
                </div>
                <div tw='w-full bd1 m-1'>
                    {canvas.selections.map((uniSel) => (
                        <div>
                            <div key={uniSel.id} className='flex whitespace-nowrap gap-1'>
                                <div tw='flex gap-0.5 items-center'>
                                    <input
                                        type='radio'
                                        checked={canvas.activeSelection === uniSel}
                                        onChange={() => (canvas.activeSelection = uniSel)}
                                        name='active'
                                        className='radio'
                                    />
                                    <div>Selection 0</div>
                                </div>
                                <div className='flex-1'></div>
                                <div
                                    //
                                    tw='btn btn-sm btn-square btn-outline'
                                    onClick={uniSel.remove}
                                >
                                    <span className='material-symbols-outlined'>delete</span>
                                </div>

                                <div
                                    //
                                    tw='btn btn-sm btn-square btn-outline'
                                    onClick={uniSel.saveImage}
                                >
                                    <span className='material-symbols-outlined'>save</span>
                                </div>
                            </div>
                            <div tw='flex gap-1'>
                                <div tw='w-16'>width:</div>
                                <InputNumberUI
                                    //
                                    onValueChange={(e) => {
                                        uniSel.stableData.width = e
                                        uniSel.applyStableData()
                                    }}
                                    value={uniSel.stableData.width}
                                    mode='int'
                                    softMin={128}
                                    softMax={1024}
                                />
                            </div>
                            <div tw='flex gap-1'>
                                <div tw='w-16'>height:</div>
                                <InputNumberUI
                                    //
                                    onValueChange={(e) => {
                                        uniSel.stableData.width = e
                                        uniSel.applyStableData()
                                    }}
                                    value={uniSel.stableData.width}
                                    mode='int'
                                    softMin={128}
                                    softMax={1024}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {/* <RevealUI>
                    <pre>{JSON.stringify(uist.stableData, null, 4)}</pre>
                </RevealUI> */}
            </div>

            {/* Masks */}
            <div tw='bd1 p-1' style={dropStyle2} ref={dropRef2}>
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
            {/* DEBUG */}
            {/* <div className='w-96'>
                <pre>{JSON.stringify(canvas.infos, null, 3)}</pre>
            </div> */}
        </div>
    )
})

export const CanvasToolbarUI = observer(function CanvasToolbarUI_(p: {}) {
    const canvas = useUnifiedCanvas()
    return (
        <div /* tw='absolute top-0 z-50 [left:50%]' */>
            <div tw='flex items-center bd'>
                <div
                    onClick={() => (canvas.tool = 'generate')}
                    tw={['btn btn-sm', canvas.tool === 'generate' ? 'btn-primary' : null]}
                >
                    Generate
                    <ComboUI combo='1' />
                </div>
                <div onClick={() => (canvas.tool = 'mask')} tw={['btn btn-sm', canvas.tool === 'mask' ? 'btn-primary' : null]}>
                    Mask
                    <ComboUI combo='2' />
                </div>
                <div onClick={() => (canvas.tool = 'paint')} tw={['btn btn-sm', canvas.tool === 'paint' ? 'btn-primary' : null]}>
                    Paint
                    <ComboUI combo='2' />
                </div>
                <div onClick={() => (canvas.tool = 'move')} tw={['btn btn-sm', canvas.tool === 'move' ? 'btn-primary' : null]}>
                    Move
                    <ComboUI combo='4' />
                </div>
            </div>
            <div tw='flex'>
                {
                    /* canvas.tool === 'generate' && */
                    canvas.st.favoriteDrafts.map((draft) => (
                        <div tw={[draft === canvas.currentDraft ? 'bd' : null]}>
                            <DraftIllustrationUI
                                onClick={() => {
                                    draft.openOrFocusTab()
                                    canvas.currentDraft = draft
                                }}
                                draft={draft}
                                size='3rem'
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
})
