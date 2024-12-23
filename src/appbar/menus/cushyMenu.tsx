import { activityManager } from '../../csuite/activity/ActivityManager'
import { defineMenu } from '../../csuite/menu/Menu'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { DBStatsUI } from '../../db/gui/DBStats'
import { quickBench } from '../../db/quickBench'
import { DEMO_ACTIVITY } from '../../operators/useDebugActivity'

export const cushyMenu = defineMenu({
   title: '',
   icon: 'cdiCushyStudio',
   entries: (b) => [
      b.SimpleMenuAction({
         label: 'Open Dev Playground',
         icon: 'mdiPlayNetwork',
         onClick: () => cushy.layout.open('Playground', {}),
      }),
      b.SimpleMenuAction({
         icon: 'mdiBug',
         onClick: () => cushy.electron.toggleDevTools(),
         label: 'Toggle Electron Dev Tools',
      }),
      b.SimpleMenuAction({
         icon: 'mdiSync',
         onClick: () => cushy.reloadCushyMainWindow(),
         label: 'Reload',
      }),

      b.Divider,
      b.SimpleMenuAction({
         label: 'Reset Layout',
         icon: 'mdiAutoFix',
         onClick: () => cushy.layout.resetCurrent(),
      }),
      b.SimpleMenuAction({
         icon: 'mdiAutoFix',
         onClick: () => cushy.layout.fixTabsWithNegativeArea(),
         label: 'Fix Tabs with negative size',
      }),

      b.SimpleMenuAction({
         icon: 'mdiVideo',
         onClick: () => cushy.resizeWindowForVideoCapture(),
         label: 'set screen size to 1920 x 1080',
      }),

      b.SimpleMenuAction({
         icon: 'mdiLaptop',
         onClick: () => cushy.resizeWindowForLaptop(),
         label: 'set screen size to 1280 x 720',
      }),

      b.SimpleMenuAction({
         icon: 'mdiBug',
         onClick: () => activityManager.start(DEMO_ACTIVITY),
         label: 'Start debug activity',
      }),

      b.Divider,
      b.SimpleMenuAction({
         onClick: async () =>
            cushy.layout.addCustomV2(
               () => (
                  <PanelUI>
                     <PanelUI.Header title='DB Stats' />
                     <DBStatsUI />
                  </PanelUI>
               ),
               {},
            ),
         icon: 'mdiAccount',
         label: 'print DB stats',
      }),

      b.SimpleMenuAction({
         onClick: () => quickBench.printAllStats(),
         icon: 'mdiAccountOutline',
         label: 'print QuickBench stats',
      }),

      b.SimpleMenuAction({
         onClick: cushy.auth.__testCB,
         icon: 'mdiAccount',
         label: 'Test Auth CB page',
      }),

      b.Divider,
      b.SimpleMenuAction({
         onClick: () => cushy.wipeOuputTopLevelImages(),
         icon: 'mdiImageBroken',
         label: 'remove all images',
      }),

      b.SimpleMenuAction({
         onClick: () => cushy.wipeOuputTopLevelImages(),
         icon: 'mdiImageBroken',
         label: 'remove top-level images',
      }),

      b.Divider,
      b.SimpleMenuAction({
         icon: 'mdiSync',
         label: 'Reset DB',
         onClick: () => {
            cushy.db.reset()
            cushy.reloadCushyMainWindow()
         },
      }),

      b.SimpleMenuAction({
         icon: 'mdiSync',
         onClick: () => cushy.fullReset_eraseConfigAndSchemaFilesAndDB(),
         label: 'Full Reset',
      }),

      b.Divider,
      b.SimpleMenuAction({
         icon: 'mdiStorageTankOutline',
         onClick: cushy.db.migrate,
         label: 'Migrate',
      }),

      b.SimpleMenuAction({
         icon: 'mdiHomeGroup',
         onClick: cushy.db.runCodegen,
         label: 'CodeGen',
      }),
   ],
})
