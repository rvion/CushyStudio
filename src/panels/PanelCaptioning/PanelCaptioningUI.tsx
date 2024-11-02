import type { CushySchemaBuilder } from '../../controls/Builder'
import type { FieldCtorProps } from '../../csuite/model/Field'
import type { CaptioningDoc } from './PanelCaptioningState'

import fs from 'fs'
import { makeAutoObservable } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useMemo } from 'react'
import { clamp } from 'three/src/math/MathUtils'

import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { CachedResizedImage } from '../../csuite/image/CachedResizedImageUI'
import { ButtonStringUI } from '../../csuite/input-string-button/ButtonStringUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { RegionUI } from '../../csuite/regions/RegionUI'
import { ResizableFrame } from '../../csuite/resizableFrame/resizableFrameUI'
import { BasicShelfUI } from '../../csuite/shelf/ShelfUI'
import { usePanel } from '../../router/usePanel'
import { renameFile, updateActiveCaption, updateActiveDirectory } from './captionningUtils'
import { PanelCaptioningCtx } from './PanelCaptioningCtx'
// TODO: Changing from image to image should try to keep the index, if the length of captions is lower, go to the number of captions.
import { captioningDocSchema } from './PanelCaptioningState'

export type PanelCaptioningProps = {
   uid?: number | string
   /** Should maybe be the item itself instead of a number? This is just for skeleton */
   activeImage: { index: number; captions: Array<string>; filePath: string }
   activeCaption: { index: number; text: string }
   activeGlobalCaption: { index: number; text: string }
   activeDirectory: { path: string; files: Array<string> }

   /** Temp values used to insert captions quickly, instead of clicking a button then editing text. */
   floatingCaption: string
   floatingGlobalCaption: string

   /** Array of indexes, not sure if I like this approach. I think I would prefer the item itself to know if it is selected. But each panel should have a different state, so hmmmm... */
   selected: Set<number>
   folderPath: string
   exportPath: string
}

export class PanelCaptioningState {
   constructor(
      //
      public props: PanelCaptioningProps,
      //  type we're trying to be able to copy-paste, so we can actually have something that work
      //          VVVVVVVVVV
      public doc: CaptioningDoc,
   ) {
      makeAutoObservable(this)
   }

   update(): void {
      const doc = this.doc
      const val = doc.value
      val.activeImage.index = clamp(val.activeImage.index, 0, val.activeDirectory.files.length - 1)
      doc.ActiveImage.value.filePath =
         doc.ActiveDirectory.Files.value[doc.ActiveImage.Index.value] ?? 'NO FILE PATH???'
      doc.ActiveImage.value.captions = updateActiveCaption(
         `${val.activeDirectory.path}/${val.activeImage.filePath.split('.').shift()}.txt`,
      )
      // doc.ActiveCaption.value.index = clamp(
      //    doc.ActiveCaption.value.index,
      //    0,
      //    val.activeImage.captions.length - 1,
      // )
   }

   updateCaptionFile(): void {
      const doc = this.doc
      fs.writeFileSync(
         `${doc.value.activeDirectory.path}/${doc.value.activeImage.filePath.split('.').shift()}.txt`,
         doc.value.activeImage.captions.join('\n'),
      )
   }
}

export const PanelCaptioningUI = observer(function PanelCaptioningUI_(p: PanelCaptioningProps) {
   const panel = usePanel<PanelCaptioningProps>()
   const doc = panel.usePersistentModel('uist-1', captioningDocSchema)
   const state = useMemo(() => new PanelCaptioningState(p, doc), [])
   // const b = CushySchemaBuilder
   // const schema = b.fields()
   // .useClass(
   //    (SUPER) =>
   //       class extends SUPER {
   //          constructor(...args: FieldCtorProps) {
   //             super(...args)
   //             this.autoExtendObservable()
   //          }
   //       },
   // ),
   // )

   // const uist = useMemo(() => new PanelCaptioningState({ active: -1, selected: new Set() }), [])

   const activeImage = doc.ActiveImage.value.index ?? 0
   const activePath = doc.ActiveImage.FilePath.value

   return (
      <RegionUI regionName='Captioning' regionCtx={PanelCaptioningCtx} regionValue={state}>
         {/* 1. replace this by   <RegionUI //
            tw='flex flex-1 flex-col'
            regionName='UnifiedCanvas2'
            regionCtx={UnifiedCanvasCtx}
            regionValue={canvas}
         >  */}
         <PanelCaptioningCtx.Provider value={state}>
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
                     src={`file://${doc.ActiveDirectory.Path.value}/${doc.ActiveImage.FilePath.value}`}
                  />
               </Frame>
               <BasicShelfUI tw='flex flex-col !gap-2 overflow-clip p-2' anchor='right'>
                  <Frame line tw='flex flex-row'>
                     <Button
                        tooltip={doc.FolderPath.value}
                        expand
                        icon={'mdiFolderOpen'}
                        onClick={async () => {
                           const d = await cushy.electron.dialog.showOpenDialog({
                              properties: ['openFile', 'openDirectory'],
                           })

                           if (d.canceled) {
                              return
                           }

                           doc.FolderPath.value = d.filePaths[0] ?? 'Th e FUCK'
                           doc.ActiveDirectory.value.path = d.filePaths[0] ?? 'Th e FUCK'
                           doc.ActiveDirectory.value.files = updateActiveDirectory(
                              doc.ActiveDirectory.value.path,
                           )
                           doc.ActiveCaption.value.index = 0
                        }}
                     >
                        {doc.FolderPath.value.split('/').pop()}
                     </Button>
                  </Frame>

                  {doc.FolderPath.value != '' ? (
                     <>
                        <ResizableFrame // Files
                        >
                           <Frame tw='flex flex-col gap-0.5 p-1'>
                              {doc.ActiveDirectory.value.files.map((data, index) => {
                                 return (
                                    <Button
                                       tw='h-input w-full !justify-start'
                                       subtle
                                       borderless
                                       base={{ contrast: index == activeImage ? 0.1 : 0 }}
                                       onClick={() => {
                                          doc.ActiveImage.value.index = index
                                          state.update()
                                       }}
                                       tooltip={data}
                                    >
                                       <CachedResizedImage
                                          size={24}
                                          src={`${doc.ActiveDirectory.Path.value}/${data}`}
                                       ></CachedResizedImage>
                                       <span tw='truncate text-center'>
                                          {data.split('/').pop()!.split('.').shift()}
                                       </span>
                                    </Button>
                                 )
                              })}
                           </Frame>
                        </ResizableFrame>
                        <ResizableFrame // Captions
                        >
                           <Frame tw='flex flex-col gap-0.5 p-1'>
                              {doc.ActiveImage.value.captions.map((data, index) => {
                                 return (
                                    <Frame key={index} line>
                                       <ButtonStringUI
                                          tw='h-input truncate'
                                          expand
                                          subtle
                                          borderless
                                          base={{
                                             contrast: index == doc.ActiveCaption.value.index ? 0.1 : 0,
                                          }}
                                          onClick={() => {
                                             doc.ActiveCaption.value.index = index
                                          }}
                                          tooltip={data}
                                          setValue={(val) => {
                                             doc.value.activeImage.captions[doc.value.activeCaption.index] =
                                                val
                                          }}
                                          getValue={() => {
                                             const text =
                                                doc.value.activeImage.captions[doc.value.activeCaption.index]
                                             if (text === undefined) {
                                                return 'USER SHOULD NOT SEE THIS'
                                             }
                                             return text
                                          }}
                                          onKeyDown={(ev) => {
                                             if (ev.key == 'Enter') {
                                                fs.writeFileSync(
                                                   `${doc.value.activeDirectory.path}/${doc.value.activeImage.filePath.split('.').shift()}.txt`,
                                                   doc.value.activeImage.captions.join('\n'),
                                                )
                                             }
                                          }}
                                       >
                                          <span tw='flex-grow truncate text-start'>{data}</span>
                                          <Button
                                             tooltip='Remove caption'
                                             size='sm'
                                             square
                                             subtle
                                             borderless
                                             icon='mdiMinus'
                                             onClick={(ev) => {
                                                doc.ActiveImage.Captions.removeItemAt(index)
                                                const fp = `${doc.value.activeDirectory.path}/${doc.value.activeImage.filePath.split('.').shift()}.txt`

                                                if (doc.ActiveImage.Captions.length == 0) {
                                                   if (!fs.existsSync(fp)) {
                                                      return
                                                   }

                                                   fs.rmSync(fp)
                                                   return
                                                }

                                                fs.writeFileSync(
                                                   fp,
                                                   doc.value.activeImage.captions.join('\n'),
                                                )
                                                ev.stopPropagation()
                                                ev.preventDefault()
                                             }}
                                             onDoubleClick={(ev) => {
                                                ev.stopPropagation()
                                                ev.preventDefault()
                                             }}
                                          />
                                       </ButtonStringUI>
                                    </Frame>
                                 )
                              })}
                           </Frame>
                        </ResizableFrame>
                        <InputStringUI //
                           clearable
                           icon='mdiTextBoxPlus'
                           onKeyDown={(ev) => {
                              if (!doc.value.floatingCaption) {
                                 return
                              }

                              if (ev.key == 'Enter') {
                                 doc.value.activeImage.captions.push(doc.value.floatingCaption)
                                 state.updateCaptionFile()
                                 state.doc.value.floatingCaption = ''
                              }
                           }}
                           setValue={(val) => {
                              doc.value.floatingCaption = val
                           }}
                           getValue={() => {
                              // const text = test_data[activeImage]?.captions[doc.ActiveCaption.Index.value]
                              // if (text === undefined) {
                              // return 'USER SHOULD NOT SEE THIS'
                              // }
                              return doc.value.floatingCaption
                           }}
                        />
                     </>
                  ) : (
                     <></>
                  )}
               </BasicShelfUI>
            </PanelUI.Content>
         </PanelCaptioningCtx.Provider>
      </RegionUI>
   )
})
