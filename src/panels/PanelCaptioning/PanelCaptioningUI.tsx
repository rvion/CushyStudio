import type { FieldCtorProps } from '../../csuite/model/Field'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'

import { CushySchemaBuilder } from '../../controls/Builder'
import { ShellInputOnly } from '../../csuite-cushy/shells/ShellInputOnly'
import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { Ikon } from '../../csuite/icons/iconHelpers'
import { CachedResizedImage } from '../../csuite/image/CachedResizedImageUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { ResizableFrame } from '../../csuite/resizableFrame/resizableFrameUI'
import { BasicShelfUI } from '../../csuite/shelf/ShelfUI'
import { usePanel } from '../../router/usePanel'

export type PanelCaptioningProps = {
   uid?: number | string
   /** Should maybe be the item itself instead of a number? This is just for skeleton */
   activeImage: { index: number; filePath: string }
   activeCaption: { index: number; text: string }
   activeGlobalCaption: { index: number; text: string }
   activeDirectory: { path: string; files: Array<string> }
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
   // const b = CushySchemaBuilder
   // const schema = b.fields()
   const doc = panel.usePersistentModel('uist-1', (b) =>
      b
         .fields({
            uid: b.string(),

            activeImage: b.group({
               items: {
                  index: b.number(),
                  filePath: b.string(),
               },
            }),

            activeCaption: b.group({
               items: {
                  index: b.number(),
                  text: b.string(),
               },
            }),
            activeGlobalCaption: b.group({
               items: {
                  index: b.number(),
                  text: b.string(),
               },
            }),
            activeDirectory: b.string().list(),

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
      {
         filepath: 'example/path/maw.png',
         captions: ['mouth teeth maw', '', 'ur mom lol'],
      },
      { filepath: 'wah/tmooafphniawhniop/paw.png', captions: ['paw foot feet', '', 'ur dad lol'] },
   ]

   // const uist = useMemo(() => new PanelCaptioningState({ active: -1, selected: new Set() }), [])

   const activeImage = doc.ActiveImage.value.index ?? 0
   const activePath = doc.ActiveImage.FilePath.value

   console.log('[FD], ', activePath)

   return (
      <PanelUI>
         <PanelHeaderUI>
            <SpacerUI />

            <SpacerUI />
         </PanelHeaderUI>
         <PanelUI.Content
            // Cropping, potentially region-based captioning in the future?
            tw='!flex-row' // Content
         >
            <Frame //
               tw='flex w-full items-center justify-center'
               base={{ contrast: 0.1 }}
            >
               <img // Active Image
                  tw='select-none'
                  draggable={false}
                  src={`file://${doc.ActiveImage.FilePath.value}`}
               />
            </Frame>
            <BasicShelfUI tw='flex flex-col !gap-2 overflow-clip p-2' anchor='right'>
               <Button
                  icon={'mdiFolderOpen'}
                  onClick={async () => {
                     const d = await cushy.electron.dialog.showOpenDialog({
                        properties: ['openFile', 'openDirectory'],
                     })

                     if (d.canceled) {
                        console.log('[FD] suck me')
                        return
                     }

                     doc.FolderPath.value = d.filePaths[0] ?? 'Th e FUCK'

                     // console.log('[FD] foldeR: ', d.filePaths[0])
                  }}
               >
                  {doc.FolderPath.value.split('/').pop()}
               </Button>

               {doc.FolderPath.value != '' ? (
                  <>
                     <ResizableFrame // List of files in folder, when one is selected it should try to load the associated .caption and fill the captioning data with it
                     >
                        <Frame tw='flex flex-col gap-0.5 p-1'>
                           {test_data.map((data, index) => {
                              return (
                                 <Frame line>
                                    <Button
                                       tw='h-input w-full'
                                       subtle
                                       borderless
                                       base={{ contrast: index == activeImage ? 0.1 : 0 }}
                                       onClick={() => {
                                          doc.ActiveImage.value.index = index
                                          doc.ActiveCaption.value.index = 0
                                          doc.ActiveImage.value.filePath = data.filepath
                                       }}
                                       tooltip={data.filepath}
                                    >
                                       <CachedResizedImage size={24} src={data.filepath}></CachedResizedImage>
                                       {data.filepath.split('/').pop()!.split('.').shift()}
                                    </Button>
                                 </Frame>
                              )
                           })}
                        </Frame>
                     </ResizableFrame>
                     <ResizableFrame // List of files in folder, when one is selected it should try to load the associated .caption and fill the captioning data with it
                     >
                        <Frame tw='flex flex-col gap-0.5 p-1'>
                           {test_data[activeImage]?.captions.map((data, index) => {
                              return (
                                 <Button
                                    tw='h-input'
                                    subtle
                                    borderless
                                    base={{ contrast: index == doc.ActiveCaption.value.index ? 0.1 : 0 }}
                                    onClick={() => {
                                       doc.ActiveCaption.value.index = index
                                    }}
                                    tooltip={data}
                                 >
                                    {data}
                                 </Button>
                              )
                           })}
                        </Frame>
                     </ResizableFrame>
                     <InputStringUI //
                        setValue={(val) => {
                           test_data[activeImage]!.captions[doc.ActiveCaption.Index.value] = val
                        }}
                        getValue={() => {
                           const text = test_data[activeImage]?.captions[doc.ActiveCaption.Index.value]
                           if (text === undefined) {
                              return 'USER SHOULD NOT SEE THIS'
                           }
                           return text
                        }}
                     />
                  </>
               ) : (
                  <></>
               )}
            </BasicShelfUI>
         </PanelUI.Content>
      </PanelUI>
   )
})
