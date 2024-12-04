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
                  icon='mdiFileDocumentPlus'
                  onClick={() => draft.app.createDraft()}
               />
               <MenuItem
                  label='Duplicate'
                  icon='mdiContentCopy'
                  localShortcut={KEYS.duplicateCurrentDraft}
                  onClick={() => draft.duplicateAndFocus()}
               />

               <MenuDivider />
               <MenuItem
                  label='Open In ComfyUI'
                  disabled={p.draft.file?.liteGraphJSON == null}
                  onClick={() => cushy.layout.open('ComfyUI', { litegraphJson: p.draft.file.liteGraphJSON })}
               />

               <MenuDivider />
               <MenuItem
                  label='Reset'
                  icon='mdiUndoVariant'
                  tooltip='Resets all fields of a Draft to their default value'
                  onClick={() => {
                     const confirm = window.confirm('Are you sure you want to delete this draft?')
                     if (confirm) draft.update({ formSerial: {} as any })
                  }}
               />

               {cushy.preferences.interface.value.developerOptions.showMenuItems && (
                  <>
                     <MenuDivider />
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
                  </>
               )}

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
