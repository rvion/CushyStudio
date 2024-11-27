import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { KEYS } from '../../app/shortcuts/shorcutKeys'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { MenuDivider } from '../../csuite/dropdown/MenuDivider'
import { MenuItem } from '../../csuite/dropdown/MenuItem'
import { useSt } from '../../state/stateContext'

export const DraftMenuDraftUI = observer(function DraftMenuDraftUI_(p: {
   draft: DraftL
   className?: string
}) {
   const st = useSt()
   const draft = p.draft
   const file = draft.file
   const app = draft.app

   return (
      <Dropdown
         title='Draft'
         className={p.className}
         content={() => (
            <>
               <MenuItem
                  label={draft.isFavorite ? 'Un-Favorite' : 'Favorite'}
                  icon={draft.isFavorite ? 'mdiStarMinus' : 'mdiStar'}
                  onClick={() => draft.setFavorite(!draft.isFavorite)}
               />

               <MenuDivider />
               <MenuItem //
                  label='New'
                  icon='mdiContentCopy'
                  onClick={() => draft.app.createDraft()}
               />
               <MenuItem
                  label='Duplicate'
                  localShortcut={KEYS.duplicateCurrentDraft}
                  onClick={() => draft.duplicateAndFocus()}
               />

               <MenuDivider />
               <MenuItem
                  label='Reset'
                  tooltip='Resets all fields of a Draft to their default'
                  onClick={() => {
                     const confirm = window.confirm('Are you sure you want to delete this draft?')
                     if (confirm) draft.update({ formSerial: {} as any })
                  }}
               />

               <MenuDivider // Developer stuff
               />
               <MenuItem //
                  label={`Copy ID`}
                  icon='mdiClipboard'
                  tooltip={`Copy draft ID to clipboard\n${draft.id}`}
                  onClick={() => navigator.clipboard.writeText(draft.id)}
               />
               <MenuItem //
                  label='Form Serial'
                  onClick={() => st.layout.open('DraftJsonSerial', { draftID: draft.id })}
               />

               <MenuItem //
                  label='App code'
                  onClick={() => st.layout.open('Script', { scriptID: draft.app.script.id })}
               />

               <MenuDivider />
               <MenuItem
                  label='Delete'
                  icon='mdiDelete'
                  onClick={() => {
                     const confirm = window.confirm('Are you sure you want to delete this draft?')
                     if (confirm) draft.delete({})
                  }}
               />
            </>
         )}
      />
   )
})
