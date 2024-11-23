import { observer } from 'mobx-react-lite'

import { ShellInputOnly } from '../../../csuite-cushy/shells/ShellInputOnly'
import { Button } from '../../../csuite/button/Button'
import { mkPlacement } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import { Frame } from '../../../csuite/frame/Frame'
import { BasicShelfUI } from '../../../csuite/shelf/ShelfUI'
import { toastError } from '../../../csuite/utils/toasts'
import { useImageDrop } from '../../../widgets/galleries/dnd'
import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'
import { useUCV2 } from '../stateV2/ucV2'
import { UCDraftImagePickerHorizontalUI } from './UCDraftImagePickerHorizontalUI'
import { UCMaskMenuUI } from './UCMaskMenuUI'
import { UCMenuLayerEntryUI } from './UCMenuLayerEntryUI'

export const UCMenuUI = observer(function UCMenuUI_(p: {}) {
   const uc1 = useUnifiedCanvas()
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
               <div tw='flex justify-between'>
                  <span>Layers</span>
                  <Button
                     icon='mdiPlus'
                     borderless
                     subtle
                     onClick={() => {
                        const lastActiveDraft = cushy.db.draft.last()
                        if (lastActiveDraft == null) return toastError('No active draft')
                        ucv2.Layers.addItem({
                           value: {
                              name: 'new layer',
                              placement: mkPlacement({ x: 0, y: 0 }),
                              visible: true,
                              content: {
                                 aiGeneration: {
                                    draftId: { id: lastActiveDraft?.id, label: lastActiveDraft?.name },
                                    image: undefined,
                                    masks: [],
                                 },
                              },
                           },
                        })
                     }}
                  ></Button>
               </div>
               <Frame //
               // tw='rounded-md p-2'
               // base={{ contrast: -0.1 }}
               >
                  <div /* SortableList */ className='list' tw='flex flex-col gap-2'>
                     {layers.items.map((layer, i) => {
                        return layer.Content.match({
                           image: () => (
                              <UCMenuLayerEntryUI //
                                 active={layer === uc1.activeLayer}
                                 layer={layer}
                                 index={i}
                              />
                           ),
                           aiGeneration: (x) => (
                              <UCMenuLayerEntryUI
                                 //
                                 active={layer === uc1.activeLayer}
                                 layer={layer}
                                 index={i}
                                 onClick={() => {
                                    uc1.activeLayer = layer
                                    cushy.layout.open('Draft', { draftID: x.DraftId.value.id })
                                 }}
                                 body={
                                    x.DraftId.value_unchecked?.id && (
                                       <UCDraftImagePickerHorizontalUI
                                          size={32}
                                          onCLick={(img) => (x.Image.value = img)}
                                          draftID={x.DraftId.value_unchecked.id}
                                       />
                                    )
                                 }
                                 children={
                                    <>
                                       <div tw='flex gap-0.5'>
                                          <x.DraftId.UI Shell={ShellInputOnly} className='flex-1' />
                                          {/* <Button icon='mdiCursorMove' /> */}
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
                                                if (newLayer == null)
                                                   return toastError('Failed to duplicate layer')
                                                newLayer.Content.matchAll({
                                                   aiGeneration: (x) => x.Image.setActive(false),
                                                })
                                                // should create a copy of that layer, below, without any image selected
                                             }}
                                          />
                                       </div>
                                    </>
                                 }
                              />
                           ),
                        })
                     })}
                  </div>
               </Frame>
            </Frame>
            <Frame tw='rounded-md p-2' style={{ filter: 'drop-shadow(0px 1px 0px black)' }}>
               <div tw='flex justify-between'>
                  <span>Masks</span>
                  <Button
                     icon='mdiPlus'
                     borderless
                     subtle
                     onClick={() => {
                        const lastActiveDraft = cushy.db.draft.last()
                        if (lastActiveDraft == null) return toastError('No active draft')
                        ucv2.Masks.addItem({
                           value: {
                              name: 'new layer',
                              placement: mkPlacement({ x: 0, y: 0 }),
                              visible: true,
                              image: cushy.db.media_image.lastOrCrash(),
                           },
                        })
                     }}
                  ></Button>
               </div>{' '}
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
