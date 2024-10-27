import type { FieldCtorProps } from '../../csuite/model/Field'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'

import { ShellInputOnly } from '../../csuite-cushy/shells/ShellInputOnly'
import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { ResizableFrame } from '../../csuite/resizableFrame/resizableFrameUI'
import { BasicShelfUI } from '../../csuite/shelf/ShelfUI'
import { usePanel } from '../../router/usePanel'

export type PanelCaptioningProps = {
   uid?: number | string
   /** Should maybe be the item itself instead of a number? This is just for skeleton */
   active: number
   /** Array of indexes, not sure if I like this approach. I think I would prefer the item itself to know if it is selected. But each panel should have a different state, so hmmmm... */
   selected: Set<number>
   folderPath: string
   exportPath: string
}

export class PanelCaptioningState {
   constructor(public props: PanelCaptioningProps) {
      makeAutoObservable(this)
   }
}

export const PanelCaptioningUI = observer(function PanelCaptioningUI_(p: PanelCaptioningProps) {
   const panel = usePanel<PanelCaptioningProps>()
   const doc = panel.usePersistentModel('uist-1', (b) =>
      b
         .fields({
            uid: b.string(),
            active: b.number(),
            selected: b.number().list(),
            folderPath: b.string(),
         })
         .useClass(
            (SUPER) =>
               class extends SUPER {
                  constructor(...args: FieldCtorProps) {
                     super(...args)
                     this.autoExtendObservable()
                  }
               },
         ),
   )

   const test_data = [
      //
      { filepath: 'wah/tmooafphniawhniop/maw.png', captions: ['mouth teeth maw', '', 'ur mom lol'] },
      { filepath: 'wah/tmooafphniawhniop/paw.png', captions: ['paw foot feet', '', 'ur dad lol'] },
   ]

   // const uist = useMemo(() => new PanelCaptioningState({ active: -1, selected: new Set() }), [])

   return (
      <PanelUI>
         <PanelHeaderUI>
            <SpacerUI />

            <Button
               onClick={() => {
                  'WOW'
               }}
            />
            <SpacerUI />
         </PanelHeaderUI>
         <PanelUI.Content
            // Cropping, potentially region-based captioning in the future?
            tw='!flex-row' // Content
         >
            <Frame //
               tw='w-full'
               base={{ contrast: 0.1 }}
            ></Frame>
            <BasicShelfUI tw='flex flex-col !gap-2 overflow-clip p-2' anchor='right'>
               <doc.FolderPath.UI Shell={ShellInputOnly} />

               {doc.FolderPath.value != '' ? (
                  <ResizableFrame // List of files in folder, when one is selected it should try to load the associated .caption and fill the captioning data with it
                  >
                     <Frame tw='flex flex-col gap-0.5 p-1'>
                        {test_data.map((data, index) => {
                           return (
                              <Frame
                                 tw='h-input'
                                 hover
                                 base={{ contrast: index == doc.Active.value ? 0.1 : 0 }}
                                 onClick={() => {
                                    doc.Active.value = index
                                 }}
                              ></Frame>
                           )
                        })}
                     </Frame>
                  </ResizableFrame>
               ) : (
                  <></>
               )}
            </BasicShelfUI>
         </PanelUI.Content>
      </PanelUI>
   )
})
