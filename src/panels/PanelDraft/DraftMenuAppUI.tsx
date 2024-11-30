import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { showItemInFolder } from '../../app/layout/openExternal'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { MenuDivider } from '../../csuite/dropdown/MenuDivider'
import { MenuItem } from '../../csuite/dropdown/MenuItem'
import { useSt } from '../../state/stateContext'
import { openInVSCode } from '../../utils/electron/openInVsCode'

export const DraftMenuAppUI = observer(function DraftMenuAppUI_(p: { draft: DraftL; className?: string }) {
   const st = useSt()
   const draft = p.draft
   const file = draft.file
   const app = draft.app

   return (
      <Dropdown
         title='App'
         className={p.className}
         content={() => (
            <>
               <MenuItem
                  label={app.isFavorite ? 'Un-Favorite' : 'Favorite'}
                  icon={app.isFavorite ? 'mdiStarMinus' : 'mdiStar'}
                  onClick={() => app.setFavorite(!app.isFavorite)}
               />

               <MenuDivider />
               <MenuItem //
                  icon='mdiBookEdit'
                  onClick={() => openInVSCode(file?.absPath ?? '')}
                  label='Edit Definition'
               />
               <MenuItem //
                  icon='mdiOpenInApp'
                  onClick={() => showItemInFolder(file.absPath)}
                  label='Show Item In Folder'
               />

               <MenuDivider />
               <MenuItem
                  loading={app.isPublishing}
                  icon='mdiPublish'
                  onClick={() => app.publish()}
                  label='Publish on app-store'
               />
            </>
         )}
      />
   )
})
