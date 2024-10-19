import { observer } from 'mobx-react-lite'

import { ShellInputOnly } from '../../../csuite-cushy/shells/ShellInputOnly'
import { Button } from '../../../csuite/button/Button'
import { mkPlacement } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import { Frame } from '../../../csuite/frame/Frame'
import { BasicShelfUI } from '../../../csuite/shelf/ShelfUI'
import { toastError } from '../../../csuite/utils/toasts'
import { useImageDrop } from '../../../widgets/galleries/dnd'
import { useUCV2 } from '../V2/ucV2'
import { DraftInlineImageOutputsUI } from './DraftInlineImageOutputsUI'
import { UCLayerUI } from './UCLayerUI'
import { UCMaskMenuUI } from './UCMaskMenuUI'

export const UnifiedCanvasMenuUI = observer(function UnifiedCanvasMenuUI_(p: {}) {
    const ucv2 = useUCV2()
    const layers = ucv2.Layers
    const masks = ucv2.Masks.items

    const [dropStyle2, dropRef2] = useImageDrop(cushy, (img) => {
        // TODO: move as method once setup with custom classes finished
        // canvas.addMask(img)
        ucv2.Masks.push({
            image: img,
            visible: true,
            name: 'masky-mac-mask-face',
            placement: mkPlacement({ x: 0, y: 0 }),
        })
    })
    return (
        <>
            <BasicShelfUI anchor='right' floating tw='flex flex-col gap-1.5 p-1.5'>
                {/* TOP LEVEL BUTTON */}
                <Frame tw='rounded-md p-2' style={{ filter: 'drop-shadow(0px 1px 0px black)' }}>
                    Layers
                    <Frame tw='rounded-md p-2' base={{ contrast: -0.1 }}>
                        <div /* SortableList */ className='list' tw='flex flex-col gap-2'>
                            {layers.items.map((layer, i) => {
                                return layer.Content.when1({
                                    image: () => <UCLayerUI layer={layer} index={i} />,
                                    aiGeneration: (x) => (
                                        <div>
                                            <UCLayerUI layer={layer} index={i} />
                                            <x.DraftId.UI Shell={ShellInputOnly} />
                                            <DraftInlineImageOutputsUI
                                                onCLick={(img) => (x.Image.value = img)}
                                                draftID={x.DraftId.value.id}
                                            />
                                            <div tw='flex gap-1'>
                                                <Button icon='mdiCursorMove' />
                                                <Button
                                                    icon='mdiPlay'
                                                    onClick={() => {
                                                        const draft = cushy.db.draft.get(x.DraftId.value.id)
                                                        if (!draft) return toastError('Draft not found')
                                                        draft.start({
                                                            /* context */
                                                        })
                                                    }}
                                                />
                                                <Button
                                                    icon='mdiContentCopy'
                                                    onClick={() => {
                                                        const newLayer = layers.duplicateItemAtIndex(i)
                                                        if (newLayer == null) return toastError('Failed to duplicate layer')
                                                        newLayer.Content.when({
                                                            aiGeneration: (x) => x.Image.setActive(false),
                                                        })
                                                        // should create a copy of that layer, below, without any image selected
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ),
                                })
                            })}
                        </div>
                    </Frame>
                </Frame>
                <Frame tw='rounded-md p-2' style={{ filter: 'drop-shadow(0px 1px 0px black)' }}>
                    Masks
                    <Frame tw='rounded-md p-2' base={{ contrast: -0.1 }}>
                        <div /* SortableList */ className='list' tw='flex flex-col gap-2'>
                            {masks.map((p, i) => {
                                return <UCMaskMenuUI mask={p} index={i} />
                            })}
                        </div>
                    </Frame>
                </Frame>
            </BasicShelfUI>
        </>
    )
})

// {/* SELECTIONS */}
// {/* <Frame tw='rounded-md p-2' border>
// <div tw='flex items-center justify-between'>
//     Selections
//     <Button square onClick={canvas.addSelection}>
//         <span className='material-symbols-outlined'>add</span>
//     </Button>
// </div>
// <Frame base={{ contrast: -0.1 }} tw='w-full p-2'>
//     {canvas.selections.map((uniSel) => (
//         <Frame base={{ contrast: canvas.activeSelection === uniSel ? 0.25 : 0.1 }} border tw='p-2'>
//             <div key={uniSel.id} className='flex gap-1 whitespace-nowrap'>
//                 <div tw='flex items-center gap-0.5'>
//                     <input
//                         type='radio'
//                         checked={canvas.activeSelection === uniSel}
//                         onChange={() => (canvas.activeSelection = uniSel)}
//                         name='active'
//                         className='radio'
//                     />
//                     <InputStringUI setValue={(val) => (uniSel.name = val)} getValue={() => uniSel.name} />
//                 </div>
//                 <div className='flex-1' />
//                 <Button onClick={uniSel.remove} icon='mdiDelete' />
//                 <Button square onClick={uniSel.saveImage} icon='mdiContentSave' />
//             </div>
//             <div tw='flex gap-1'>
//                 <div tw='w-16'>width:</div>
//                 <InputNumberUI
//                     //
//                     onValueChange={(e) => {
//                         uniSel.stableData.width = e
//                         uniSel.applyStableData()
//                     }}
//                     value={uniSel.stableData.width}
//                     mode='int'
//                     softMin={128}
//                     softMax={1024}
//                     step={12}
//                 />
//             </div>
//             <div tw='flex gap-1'>
//                 <div tw='w-16'>height:</div>
//                 <InputNumberUI
//                     //
//                     onValueChange={(e) => {
//                         uniSel.stableData.height = e
//                         uniSel.applyStableData()
//                     }}
//                     value={uniSel.stableData.height}
//                     mode='int'
//                     softMin={128}
//                     softMax={1024}
//                     step={12}
//                 />
//             </div>
//         </Frame>
//     ))}
// </Frame>
// </Frame> */}
// {/* <RevealUI>
// <pre>{JSON.stringify(uist.stableData, null, 4)}</pre>
// </RevealUI> */}

// {/* Masks */}
// {/* <Frame tw='rounded-md p-2.5'>
//     <div ref={dropRef2}>
//         <div tw='flex items-center justify-between'>
//             <div>Masks</div>
//             <Button square onClick={() => canvas.addMask()} icon='mdiPlus'>
//                 <span className='material-symbols-outlined'>add</span>
//             </Button>
//         </div>
//         {canvas.masks.map((mask) => {
//             const active = mask === canvas.activeMask
//             return (
//                 <div key={mask.uid} tw='flex w-full items-center gap-1'>
//                     <input
//                         type='radio'
//                         checked={active}
//                         name='radio-1'
//                         className='radio'
//                         onChange={() => {
//                             canvas.activeMask = mask
//                         }}
//                     />
//                     <div className='flex items-center whitespace-nowrap'>
//                         <Button onClick={() => void (canvas.activeMask = mask)}>{mask.uid}</Button>
//                         <input
//                             value={mask.name}
//                             onChange={(ev) => (mask.name = ev.target.value)}
//                             tw='input input-sm'
//                             type='text'
//                         />
//                     </div>
//                 </div>
//             )
//         })}
//     </div>
// </Frame> */}

// inlist={true}
// onSortEnd={(oldIndex, newIndex) => {
//     //
//     const images = canvas.images
//     const [item] = images.splice(oldIndex, 1)
//     const [layerItem] = canvas.imageLayer.children.splice(oldIndex, 1)
//     if (!item || !layerItem) {
//         return
//     }
//     // Step 2: Insert the item at the new index
//     images.splice(newIndex, 0, item)
//     canvas.imageLayer.children.splice(newIndex, 0, layerItem)
//     canvas.imageLayer.cache()
// }}
// draggedItemClassName='dragged'
