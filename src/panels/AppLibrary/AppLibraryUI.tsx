import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { AppCardUI } from '../../cards/fancycard/AppCardUI'
import { Button } from '../../csuite/button/Button'
import { ToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { InputNumberUI } from '../../csuite/input-number/InputNumberUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { toastSuccess } from '../../csuite/utils/toasts'

export const PanelAppLibraryUI = observer(function PanelAppLibraryUI_(p: NO_PROPS) {
   const library = cushy.library

   return (
      <div tw='relative flex h-full flex-grow flex-col'>
         <PanelHeaderUI>
            <InputStringUI
               icon='mdiMagnify'
               tw='csuite-basic-input'
               getValue={() => library.query}
               setValue={(next) => (library.query = next)}
               onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     const app = library.appsFiltered[library.selectionCursor]
                     if (app == null) return
                     app.openLastOrCreateDraft()
                  } else if (e.key === 'ArrowDown') {
                     library.selectionCursor++
                  } else if (e.key === 'ArrowUp') {
                     library.selectionCursor--
                  }
               }}
               autoFocus
               placeholder='search'
               // auto select text on focus
               onFocus={(e) => e.target.select()}
            />
            <Button //
               look='primary'
               onClick={cushy.startupFileIndexing}
               children='Index All Apps'
            />
            <ToggleButtonUI
               toggleGroup='panel-app-header'
               showToggleButtonBox
               mode='checkbox'
               text='Descriptions'
               value={cushy.library.showDescription}
               onValueChange={(next) => (cushy.library.showDescription = next)}
            />
            <ToggleButtonUI
               toggleGroup='panel-app-header'
               showToggleButtonBox
               mode='checkbox'
               text='Drafts'
               value={cushy.library.showDrafts}
               onValueChange={(next) => (cushy.library.showDrafts = next)}
            />
            <ToggleButtonUI
               toggleGroup='panel-app-header'
               showToggleButtonBox
               mode='checkbox'
               text='Favorites'
               value={cushy.library.showFavorites}
               onValueChange={(next) => (cushy.library.showFavorites = next)}
            />
            <InputNumberUI
               text='size'
               mode='int'
               min={3}
               max={20}
               style={{ width: '10rem' }}
               suffix='rem'
               onValueChange={(next) => (cushy.library.imageSize = `${next}rem`)}
               value={parseInt(cushy.library.imageSize.slice(0, -3), 10)}
            />
         </PanelHeaderUI>
         <Button
            tw='self-start'
            look='error'
            children='remove every deleted app'
            onClick={() => {
               const allapps = cushy.db.cushy_app.findAll()

               const toDelete = allapps.filter((app) => !app.scriptStillExistsOnDisk)
               if (toDelete.length === 0) {
                  toastSuccess('no deleted apps found')
               }
               cushy.startActivity({
                  backdrop: true,
                  shell: 'popup-full',
                  UI: () => (
                     <div>
                        {toDelete.length} app lacks based on non-existing scripts
                        <Button
                           onClick={() => {
                              toDelete.forEach((app) => {
                                 app.delete({
                                    draft_appID: {
                                       project_currentDraftID: 'set null',
                                       step_draftID: 'set null',
                                    },
                                    // 🔶 we probably want to make step.app nullable.
                                    step_appID: {
                                       comfy_prompt_stepID: {},
                                    },
                                 })
                              })
                           }}
                        >
                           Send them to oblivion (SUPER SLOW)
                        </Button>
                     </div>
                  ),
               })
            }}
         />
         <div tw='flex flex-grow flex-col overflow-auto p-4'>
            <div tw='text-accent text-xl font-bold'>Built-in Apps</div>
            <div tw='flex flex-wrap  gap-2'>
               {cushy.library.appsFilteredBuiltIn.map((app, ix) => (
                  <div key={app.id}>
                     <AppCardUI //
                        active={cushy.library.selectionCursor === ix}
                        app={app}
                     />
                  </div>
               ))}
            </div>
            <div tw='divider'></div>
            <div tw='text-accent text-xl font-bold'>Local Apps</div>
            <div tw='flex flex-wrap  gap-2'>
               {cushy.library.appsFilteredLocal.map((app, ix) => (
                  <div key={app.id}>
                     <AppCardUI //
                        active={cushy.library.selectionCursor === ix}
                        app={app}
                     />
                  </div>
               ))}
            </div>
            <div tw='divider'></div>
            <div tw='text-accent text-xl font-bold'>SDK Examples</div>
            <div tw='flex flex-wrap  gap-2'>
               {cushy.library.appsFilteredExample.map((app, ix) => (
                  <div key={app.id}>
                     <AppCardUI //
                        active={cushy.library.selectionCursor === ix}
                        app={app}
                     />
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
})
