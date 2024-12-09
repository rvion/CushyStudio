import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { activityManager } from '../csuite/activity/ActivityManager'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDividerUI_ } from '../csuite/dropdown/MenuDivider2'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { PanelUI } from '../csuite/panel/PanelUI'
import { DBStatsUI } from '../db/gui/DBStats'
import { quickBench } from '../db/quickBench'
import { DEMO_ACTIVITY } from '../operators/useDebugActivity'

export const MenuDebugUI = observer(function MenuDebugUI_(p: {}) {
   return (
      <Dropdown
         title='Dev'
         content={() => (
            <>
               <MenuItem //
                  onClick={() => cushy.layout.open('Playground', {})}
                  icon='mdiPlayNetwork'
                  label='Show Dev Playground Page'
               />
               <MenuDividerUI_ />
               <MenuItem
                  iconClassName='text-green-500'
                  icon='mdiAutoFix'
                  onClick={() => cushy.layout.resetCurrent()}
                  localShortcut={KEYS.resetLayout}
                  label='Reset Layout'
               />
               <MenuItem
                  iconClassName='text-green-500'
                  icon='mdiAutoFix'
                  onClick={() => cushy.layout.fixTabsWithNegativeArea()}
                  localShortcut={KEYS.resetLayout}
                  label='Fix Tabs with negative size'
               />
               {/* 🔴 */}
               <MenuItem
                  iconClassName='text-green-500'
                  icon='mdiVideo'
                  onClick={() => cushy.resizeWindowForVideoCapture()}
                  localShortcut={KEYS.resizeWindowForVideoCapture}
                  label='set screen size to 1920 x 1080'
               />
               <MenuItem
                  iconClassName='text-green-500'
                  icon='mdiLaptop'
                  onClick={() => cushy.resizeWindowForLaptop()}
                  localShortcut={KEYS.resizeWindowForLaptop}
                  label='set screen size to 1280 x 720'
               />
               <MenuItem //
                  iconClassName='text-green-500'
                  icon='mdiBug'
                  onClick={() => cushy.electron.toggleDevTools()}
                  label='console'
               />
               <MenuItem //
                  iconClassName='text-green-500'
                  icon='mdiBug'
                  onClick={() => activityManager.start(DEMO_ACTIVITY)}
                  label='Start debug activity'
               />
               <MenuItem
                  iconClassName='text-orange-500'
                  icon='mdiSync'
                  onClick={() => cushy.reloadCushyMainWindow()}
                  localShortcut='mod+R'
                  label='Reload'
               />
               <MenuDividerUI_ />
               <MenuItem //
                  iconClassName='text-yellow-500'
                  onClick={async () =>
                     cushy.layout.addCustomV2(
                        () => (
                           <PanelUI>
                              <PanelUI.Header title='DB Stats' />
                              <DBStatsUI />
                           </PanelUI>
                        ),
                        {},
                     )
                  }
                  icon='mdiAccount'
                  label='print DB stats'
               />

               <MenuItem //
                  iconClassName='text-yellow-500'
                  onClick={() => quickBench.printAllStats()}
                  icon='mdiAccountOutline'
                  label='print QuickBench stats'
               />
               <MenuItem //
                  iconClassName='text-yellow-500'
                  onClick={cushy.auth.__testCB}
                  icon='mdiAccount'
                  label='Test Auth CB page'
               />
               <MenuDividerUI_ />
               <MenuItem //
                  onClick={() => cushy.wipeOuputTopLevelImages()}
                  iconClassName='text-red-500'
                  icon='mdiImageBroken'
                  label='remove all images'
               />
               <MenuItem //
                  onClick={() => cushy.wipeOuputTopLevelImages()}
                  iconClassName='text-red-500'
                  icon='mdiImageBroken'
                  label='remove top-level images'
               />
               <MenuDividerUI_ />
               <MenuItem
                  iconClassName='text-red-500'
                  icon='mdiSync'
                  label='Reset DB'
                  onClick={() => {
                     cushy.db.reset()
                     cushy.reloadCushyMainWindow()
                  }}
               />

               <MenuItem
                  iconClassName='text-red-500'
                  icon='mdiSync'
                  onClick={() => cushy.fullReset_eraseConfigAndSchemaFilesAndDB()}
                  label='Full Reset'
               />
               <MenuDividerUI_ />
               <MenuItem //
                  iconClassName='text-purple-500'
                  icon='mdiStorageTankOutline'
                  onClick={cushy.db.migrate}
                  label='Migrate'
               />
               <MenuItem //
                  iconClassName='text-purple-500'
                  icon='mdiHomeGroup'
                  onClick={cushy.db.runCodegen}
                  label='CodeGen'
               />
            </>
         )}
      />
   )
})
