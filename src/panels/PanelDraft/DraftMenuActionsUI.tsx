import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { showItemInFolder } from '../../app/layout/openExternal'
import { KEYS } from '../../app/shortcuts/shorcutKeys'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { MenuDividerUI_ } from '../../csuite/dropdown/MenuDivider2'
import { MenuItem } from '../../csuite/dropdown/MenuItem'
import { useSt } from '../../state/stateContext'
import { openInVSCode } from '../../utils/electron/openInVsCode'

export const DraftMenuActionsUI = observer(function DraftMenuActionsUI_(p: {
   //
   title: string
   draft: DraftL
   className?: string
}) {
   const st = useSt()
   const draft = p.draft
   const file = draft.file
   const app = draft.app
   return (
      <Dropdown
         className={p.className}
         // startIcon='mdiMenu'
         title='Actions'
         content={() => (
            <>
               <MenuItem
                  onClick={() => app.setFavorite(!app.isFavorite)}
                  iconClassName={app.isFavorite ? 'text-yellow-500' : undefined}
                  icon='mdiStar'
                  label='Favorite App'
               />
               <MenuItem
                  // active={draft.isFavorite}
                  onClick={() => draft.setFavorite(!draft.isFavorite)}
                  iconClassName={draft.isFavorite ? 'text-yellow-500' : null}
                  icon='mdiStar'
                  label='Favorite Draft'
               />
               <div tw='divider my-0'></div>
               <MenuItem
                  localShortcut={KEYS.duplicateCurrentDraft}
                  iconClassName='text-green-500'
                  icon='mdiContentCopy'
                  onClick={() => draft.duplicateAndFocus()}
                  label='Duplicate Draft'
               />
               <MenuItem
                  // shortcut={KEYS.duplicateCurrentDraft}
                  iconClassName={'text-green-500'}
                  icon='mdiContentCopy'
                  onClick={() => draft.app.createDraft()}
                  label='New empty Draft'
               />
               <MenuItem //
                  icon='mdiContentCopy'
                  onClick={() => navigator.clipboard.writeText(draft.id)}
                  label={`Copy ID ({draft.id})`}
               />
               <MenuItem //
                  icon='mdiMicrosoftVisualStudioCode'
                  onClick={() => openInVSCode(file?.absPath ?? '')}
                  label='Edit App Definition'
               />
               <MenuItem //
                  icon='mdiOpenInApp'
                  onClick={() => showItemInFolder(file.absPath)}
                  label='Show Item In Folder'
               />
               <MenuItem
                  label='Delete'
                  icon='mdiDelete'
                  iconClassName=' text-red-500'
                  onClick={() => {
                     const confirm = window.confirm('Are you sure you want to delete this draft?')
                     if (confirm) draft.delete({})
                  }}
               />
               <MenuItem
                  label='reset Form'
                  icon='mdiDelete'
                  iconClassName=' text-red-500'
                  onClick={() => {
                     const confirm = window.confirm('Are you sure you want to delete this draft?')
                     if (confirm) draft.update({ formSerial: {} as any })
                  }}
               />

               <MenuDividerUI_ />
               <MenuItem
                  loading={app.isPublishing}
                  icon='mdiPublish'
                  onClick={() => app.publish()}
                  label='Publish on app-store'
               />

               <div tw='divider my-0'>Debug</div>
               <MenuItem //
                  icon='mdiForest'
                  onClick={() => st.layout.open('DraftJsonSerial', { draftID: draft.id })}
                  label='Form Serial'
               />

               <MenuItem //
                  icon='mdiCodeArray'
                  onClick={() => st.layout.open('Script', { scriptID: draft.app.script.id })}
                  label='App code'
               />
            </>
         )}
      />
   )
})
