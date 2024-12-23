import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { ImportAsImageUI, ImportedFileUI } from '../../importers/FilesBeeingImported'
import { Panel, type PanelHeader } from '../../router/Panel'

export const PanelImport = new Panel({
   name: 'Import',
   category: 'tools',
   widget: (): React.FC<NO_PROPS> => PanelImportUI,
   header: (p): PanelHeader => ({ title: 'Import', icon: 'mdiImport' }),
   def: (): NO_PROPS => ({}),
   icon: 'mdiImport',
})

export const PanelImportUI = observer(function PanelImportUI_(p: {}) {
   return (
      <div tw='h-full w-full'>
         <PanelHeaderUI>
            <SpacerUI />
            {/* Putting clear items button on the right because actions that remove things should be separated in some way from other things to prevent mis-clicks. */}
            <Button //
               look='warning'
               onClick={() => cushy.droppedFiles.splice(0)}
               icon='mdiBackspace'
               children='Clear Items'
            />
         </PanelHeaderUI>
         <div tw='m-3 flex flex-col gap-3'>
            {cushy.droppedFiles.map((file, ix) => (
               <Frame border base key={`${file.name}+${ix}`} tw='p-1'>
                  <Frame line icon='mdiFileImport'>
                     "{file.name}"
                  </Frame>

                  <ul>
                     <Frame as='li' border tw='m-2 p-2'>
                        Import as workflow:
                        <ImportedFileUI key={file.name} file={file} />
                     </Frame>
                     <Frame as='li' border tw='m-2'>
                        Import as image: <ImportAsImageUI file={file} />
                     </Frame>
                  </ul>
               </Frame>
            ))}
         </div>
         {cushy.droppedFiles.length == 0 ? (
            <div tw='flex h-auto w-full items-center justify-center p-10 text-center'>
               <div tw='h-full w-full flex-1 flex-grow select-none opacity-50'>
                  Drag a file or an image from a web browser on to CushyStudio to import it.
               </div>
            </div>
         ) : (
            <></>
         )}
         {/* <div tw='relative w-96 h-96'>
                <TargetBox />
            </div> */}
      </div>
   )
})
