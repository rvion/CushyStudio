import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

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
import { useCaptioningState } from './PanelCaptioningCtx'

export const PanelCaptioningUI = observer(function PanelCaptioningUI_(p: {}) {
   const doc = useCaptioningState()
   return (
      <>
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
                  src={`file://${doc.folderPath}/${doc.imageNameWithExt}`}
               />
            </Frame>
            <BasicShelfUI tw='flex flex-col !gap-2 overflow-clip p-2' anchor='right'>
               <Frame line tw='flex flex-row'>
                  <Button
                     tooltip={doc.folderPath ?? 'no folder selected'}
                     expand
                     icon={'mdiFolderOpen'}
                     onClick={async () => {
                        const d = await cushy.electron.dialog.showOpenDialog({
                           properties: ['openFile', 'openDirectory'],
                        })
                        if (d.canceled) return
                        // TODO:  if is File, get directory instead and focus file
                        runInAction(() => {
                           doc.folderPath = d.filePaths[0] ?? 'Th e FUCK'
                        })
                     }}
                  >
                     {doc.folderName}
                  </Button>
               </Frame>

               {doc.folderPath ? (
                  <>
                     <ResizableFrame // Files
                     >
                        <Frame tw='flex flex-col gap-0.5 p-1'>
                           {doc.files.map((fileName, ix) => {
                              const isSelected = ix == doc.activeImageIndex
                              return (
                                 <Button
                                    triggerOnPress={{ startingState: isSelected, toggleGroup: '9RAXAFzyuQ' }}
                                    tw='h-input w-full !justify-start'
                                    subtle
                                    borderless
                                    base={{ contrast: isSelected ? 0.1 : 0 }}
                                    onClick={() => (doc.activeImageIndex = ix)}
                                    tooltip={fileName}
                                 >
                                    <CachedResizedImage size={24} src={`${doc.folderPath}/${fileName}`} />
                                    <span tw='truncate text-center'>
                                       {fileName.split('/').pop()!.split('.').shift()}
                                    </span>
                                 </Button>
                              )
                           })}
                        </Frame>
                     </ResizableFrame>
                     <ResizableFrame // Captions
                     >
                        <Frame tw='flex flex-col gap-0.5 p-1'>
                           {doc.captions.map((caption, ix) => {
                              const isSelected = ix == doc.activeCaptionIndex
                              return (
                                 <Frame key={ix} line>
                                    <ButtonStringUI
                                       tw='h-input truncate'
                                       expand
                                       subtle
                                       triggerOnPress={{
                                          startingState: isSelected,
                                          toggleGroup: '3ZrdohNf6d',
                                       }}
                                       borderless
                                       base={{ contrast: isSelected ? 0.1 : 0 }}
                                       onClick={() => (doc.activeCaptionIndex = ix)}
                                       tooltip={caption}
                                       setValue={(val) => (doc.captions[doc.activeCaptionIndex] = val)}
                                       getValue={() => {
                                          const text = doc.captions[doc.activeCaptionIndex]
                                          if (text === undefined) return 'USER SHOULD NOT SEE THIS'
                                          return text
                                       }}
                                    >
                                       <span tw='flex-grow truncate text-start'>{caption}</span>
                                       <Button
                                          tooltip='Remove caption'
                                          size='sm'
                                          square
                                          subtle
                                          borderless
                                          icon='mdiMinus'
                                          onClick={(ev) => {
                                             doc.captions.splice(ix, 1)
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
                           if (!doc.floatingCaption) return
                           if (ev.key == 'Enter') {
                              runInAction(() => {
                                 doc.captions.push(doc.floatingCaption)
                                 doc.floatingCaption = ''
                              })
                           }
                        }}
                        setValue={action((val) => (doc.floatingCaption = val))}
                        getValue={() => doc.floatingCaption}
                     />
                  </>
               ) : (
                  <></>
               )}
            </BasicShelfUI>
         </PanelUI.Content>
      </>
   )
})
