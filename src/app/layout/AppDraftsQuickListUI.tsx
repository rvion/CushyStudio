import type { CushyAppL } from '../../models/CushyApp'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'

export const AppDraftsQuickListUI = observer(function AppDraftsQuickListUI_(p: { app: CushyAppL }) {
   const app = p.app

   const [filterText, setFilterText] = useState<string>('')

   const filteredApps =
      filterText === ''
         ? app.drafts
         : app.drafts.filter((draft) => {
              return draft.name.toLowerCase().indexOf(filterText) != -1
           })
   return (
      <>
         <Frame tw='flex w-full flex-1 flex-grow' line>
            <Button
               tw={[app.isFavorite ? '!text-yellow-500' : null, '!peer-hover:text-red-500']}
               onClick={() => app.setFavorite(!app.isFavorite)}
               icon='mdiStar'
               square
            />
            <span tw='flex-grow truncate text-center'>{app.name}</span>
            <Button //
               onClick={() => app.createDraft()}
               icon='mdiPlus'
               square
            />
         </Frame>
         <Frame tw='flex max-w-md flex-col gap-1'>
            {app.description ? (
               <div //Description
                  tw='flex-1 rounded p-1 text-sm italic'
               >
                  {app.description}
               </div>
            ) : null}
            <div //App Grid Container
               tw='flex-col rounded p-2'
            >
               <Frame line>
                  <InputStringUI
                     tw='csuite-basic-input w-full rounded-r-none'
                     setValue={(val) => {
                        setFilterText(val)
                     }}
                     getValue={() => filterText}
                     placeholder='Filter Drafts'
                  ></InputStringUI>
                  <Button icon='mdiCancel' onClick={(ev) => setFilterText('')}></Button>
               </Frame>
               <Frame //App Grid Container
                  base={{ contrast: -0.1 }}
                  tw='grid h-[20.5rem] grid-cols-3 gap-1 overflow-auto p-1'
               >
                  {filteredApps.map((draft) => (
                     <Button //
                        size='inside'
                        key={draft.id}
                     >
                        <div key={draft.id} onClick={() => draft.openOrFocusTab()}>
                           <div tw='flex justify-center self-center p-1 text-center'>
                              <DraftIllustrationUI size='7.77rem' draft={draft} />
                           </div>
                           <span tw='truncate text-center'>{draft.name}</span>
                        </div>
                     </Button>
                  ))}
               </Frame>
            </div>
         </Frame>
      </>
   )
})
