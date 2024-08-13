import type { UnifiedImage } from '../states/UnifiedImage'

import { observer } from 'mobx-react-lite'
import SortableList, { SortableItem } from 'react-easy-sort'

import { InputNumberUI } from '../../../csuite/input-number/InputNumberUI'
import { BasicShelfUI } from '../../../csuite/shelf/ShelfUI'
import { useSt } from '../../../state/stateContext'
import { useImageDrop } from '../../../widgets/galleries/dnd'
import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'

export const UnifiedCanvasMenuUI = observer(function UnifiedCanvasMenuUI_(p: {}) {
    const canvas = useUnifiedCanvas()
    const st = useSt()
    const [dropStyle2, dropRef2] = useImageDrop(st, (img) => canvas.addMask(img))
    return (
        <>
            <BasicShelfUI anchor='right' floating>
                {/* TOP LEVEL BUTTON */}
                <div tw='bd1'>
                    Layers
                    <SortableList onSortEnd={() => {}} className='list' draggedItemClassName='dragged'>
                        {canvas.images.map((p: UnifiedImage) => {
                            // const img = p.img
                            return (
                                <SortableItem key={p.img.id}>
                                    <div tw='flex items-center'>
                                        {/*  */}
                                        <div onClick={() => p.remove()} className='btn btn-square btn-sm btn-ghost'>
                                            <span className='material-symbols-outlined'>delete</span>
                                        </div>
                                        {/* <input type='radio' name='radio-1' className='radio' /> */}
                                        <input type='checkbox' checked tw='checkbox checkbox-xs' />
                                        <div tw='btn btn-sm'>{p.img.filename}</div>
                                    </div>
                                </SortableItem>
                            )
                        })}
                    </SortableList>
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
                                    <div tw='btn btn-sm btn-square btn-outline' onClick={uniSel.remove}>
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
            </BasicShelfUI>
        </>
    )
})
