import type { FieldCtorProps } from '../../csuite/model/Field'

import fs from 'fs'
import { makeAutoObservable } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import path from 'path'

import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { CachedResizedImage } from '../../csuite/image/CachedResizedImageUI'
import { ButtonStringUI } from '../../csuite/input-string-button/ButtonStringUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { ResizableFrame } from '../../csuite/resizableFrame/resizableFrameUI'
import { BasicShelfUI } from '../../csuite/shelf/ShelfUI'
import { usePanel } from '../../router/usePanel'

// TODO: Changing from image to image should try to keep the index, if the length of captions is lower, go to the number of captions.

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
   constructor(public props: PanelCaptioningProps) {
      makeAutoObservable(this)
   }
}

const updateActiveDirectory = (dirPath: string): Array<string> => {
   return fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((file) => {
         const ext = path.extname(file.name).toLowerCase()
         return ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)
      })
      .map((val) => {
         return val.name
      })
}

const updateActiveCaption = (path: string): Array<string> => {
   if (!fs.existsSync(path)) {
      return []
   }

   return fs.readFileSync(path, 'utf-8').split('\n')
}

const renameFile = (oldName: string, newName: string): void => {
   if (!fs.existsSync(oldName)) {
      return
   }

   fs.renameSync(oldName, newName)
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
                  captions: b.string().list(),
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
            activeDirectory: b.group({
               items: {
                  path: b.string(),
                  files: b.string().list(),
               },
            }),

            floatingCaption: b.string(),
            floatingGlobalCaption: b.string(),

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

   // const uist = useMemo(() => new PanelCaptioningState({ active: -1, selected: new Set() }), [])

   const activeImage = doc.ActiveImage.value.index ?? 0
   const activePath = doc.ActiveImage.FilePath.value

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
                  src={`file://${doc.ActiveDirectory.Path.value}/${doc.ActiveImage.FilePath.value}`}
               />
            </Frame>
            <BasicShelfUI tw='flex flex-col !gap-2 overflow-clip p-2' anchor='right'>
               <Frame line tw='flex flex-row'>
                  <Button
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
                        // doc.ActiveImage.value
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
                                 <Frame line>
                                    <Button
                                       tw='h-input w-full truncate'
                                       subtle
                                       borderless
                                       base={{ contrast: index == activeImage ? 0.1 : 0 }}
                                       onClick={() => {
                                          doc.ActiveImage.value.index = index
                                          doc.ActiveCaption.value.index = 0
                                          doc.ActiveImage.value.filePath = data
                                          doc.ActiveImage.value.captions = updateActiveCaption(
                                             `${doc.value.activeDirectory.path}/${doc.value.activeImage.filePath.split('.').shift()}.txt`,
                                          )
                                       }}
                                       tooltip={data}
                                    >
                                       <CachedResizedImage size={24} src={data}></CachedResizedImage>
                                       {data.split('/').pop()!.split('.').shift()}
                                    </Button>
                                 </Frame>
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
                                       base={{ contrast: index == doc.ActiveCaption.value.index ? 0.1 : 0 }}
                                       onClick={() => {
                                          doc.ActiveCaption.value.index = index
                                       }}
                                       tooltip={data}
                                       setValue={(val) => {
                                          doc.value.activeImage.captions[doc.value.activeCaption.index] = val
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
                                       <span tw='flex-grow truncate'>{data}</span>
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

                                             fs.writeFileSync(fp, doc.value.activeImage.captions.join('\n'))
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
                              fs.writeFileSync(
                                 `${doc.value.activeDirectory.path}/${doc.value.activeImage.filePath.split('.').shift()}.txt`,
                                 doc.value.activeImage.captions.join('\n'),
                              )
                              doc.value.floatingCaption = ''
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
      </PanelUI>
   )
})
