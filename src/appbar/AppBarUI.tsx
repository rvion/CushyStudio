import { observer } from 'mobx-react-lite'

import { activityManager } from '../csuite/activity/ActivityManager'
import { Button } from '../csuite/button/Button'
import { SpacerUI } from '../csuite/components/SpacerUI'
import { Frame } from '../csuite/frame/Frame'
import { Ikon, IkonOf } from '../csuite/icons/iconHelpers'
import { defineMenu, type Menu } from '../csuite/menu/Menu'
import { PanelUI } from '../csuite/panel/PanelUI'
import { DBStatsUI } from '../db/gui/DBStats'
import { quickBench } from '../db/quickBench'
import { cmd_fav_toggleFavBar } from '../operators/commands/cmd_favorites'
import { DEMO_ACTIVITY } from '../operators/useDebugActivity'
import { ConnectionInfoUI } from '../panels/host/HostWebsocketIndicatorUI'
import { UpdateBtnUI } from '../updater/UpdateBtnUI'
import { assets } from '../utils/assets/assets'
import { MenuAboutUI } from './MenuAboutUI'
import { MenuAppsUI } from './MenuApps'
import { menuComfyUI2 } from './MenuComfyUI'
import { MenuDebugUI } from './MenuDebugUI'
import { MenuNSFWCheckerUI } from './MenuNSFWChecker'
import { MenuSettingsUI } from './MenuSettingsUI'
import { menuCommands } from './MenuShortcuts'
import { MenuUtilsUI } from './MenuUtilsUI'
import { menuView } from './MenuWindowUI'
import { PerspectivePickerUI } from './PerspectivePickerUI'

// const viewMenu = defineMenu({
//    title: 'View',
//    entries: () => [menuCommands],
// })

const editMenu: Menu = defineMenu({
   title: 'Edit',
   entries: (b) => [
      b.Divider,
      // <Frame base={{ contrast: 0.1 }} tw='h-[1px]'></Frame>,
      // Should have commands that open menus that we can re-use in spots.
      b.SimpleMenuAction({
         label: 'Preferences',
         onClick: () => cushy.layout.open('Config', {}),
         // icon: 'mdiCog',
      }),
   ],
})

/* 

/>
               <MenuItem
                  
               />
               <MenuItem
                  onClick={() => {
                     void window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
                  }}
                  icon={'mdiPost'}
                  label='Blog'
               />
               {cushy.auth.isConnected ? (
                  <MenuItem //
                     icon='mdiLogout'
                     onClick={() => cushy.auth.logout()}
                     label='Logout'
                  />
               ) : (
                  <MenuItem //
                     icon='mdiLogin'
                     onClick={() => void cushy.auth.startLoginFlowWithGithub()}
                     label='Login with Github'
                  />
               )}



*/

const helpMenu: Menu = defineMenu({
   title: 'Help',
   entries: (b) => [
      //
      menuCommands,

      b.Divider,
      b.SimpleMenuAction({
         label: 'Github',
         icon: 'mdiGithub',
         onClick: () => {
            void window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio#readme')
         },
      }),
      b.SimpleMenuAction({
         label: 'Documentation',
         icon: 'mdiWeb',
         onClick: () => {
            void window.require('electron').shell.openExternal('https://www.CushyStudio.com')
         },
      }),
      b.SimpleMenuAction({
         label: 'Blog',
         icon: 'mdiPost',
         onClick: () => {
            void window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
         },
      }),
      cushy.auth.isConnected
         ? b.SimpleMenuAction({
              icon: 'mdiLogout',
              label: 'Logout',
              onClick: () => cushy.auth.logout(),
           })
         : b.SimpleMenuAction({
              icon: 'mdiLogin',
              label: 'Login with Github',
              onClick: () => void cushy.auth.startLoginFlowWithGithub(),
           }),
   ],

   // TODO(bird): Properly do this
   /**<RevealUI content={() => <JsonViewUI value={cushy.auth.user} />}>
                  <MenuItem //
                     icon='mdiInformation'
                     label={cushy.auth.user?.email ?? '<no-email>'}
                  />
               </RevealUI> */
})

const cushyMenu = defineMenu({
   title: '',
   icon: 'cdiCushyStudio',
   entries: (b) => [
      b.SimpleMenuAction({
         label: 'Show Dev Playground Page',
         icon: 'mdiPlayNetwork',
         onClick: () => cushy.layout.open('Playground', {}),
      }),
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
         onClick: () => cushy.electron.toggleDevTools(),
         label: 'console',
      }),

      b.SimpleMenuAction({
         icon: 'mdiBug',
         onClick: () => activityManager.start(DEMO_ACTIVITY),
         label: 'Start debug activity',
      }),

      b.SimpleMenuAction({
         icon: 'mdiSync',
         onClick: () => cushy.reloadCushyMainWindow(),
         label: 'Reload',
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

const mainMenu = defineMenu({
   title: 'mainMenu',
   entries: () => [
      //
      cushyMenu,
      menuView,
      editMenu,
      // viewMenu,
      helpMenu,
   ],
   // horizontalMenuGroup: true,
})

export const AppBarUI = observer(function AppBarUI_(p: {}) {
   const mainHost = cushy.mainHost
   return (
      <Frame
         //
         base={cushy.theme.value.appbar ?? { contrast: 0 }}
         tw={['flex items-center overflow-auto px-2 py-0.5', 'shrink-0 overflow-auto']}
         id='CushyAppBar'
      >
         {/* <PanelHeaderUI tw='flex items-center px-2 overflow-auto'> */}
         {/* <div tw='px-1'>CushyStudio</div> */}
         <mainMenu.MenuBarUI />
         {/* <MenuPanelsUI /> */}
         {/* <MenuCommandsUI /> */}
         {/* <MenuComfyUI /> */}
         <MenuAppsUI />
         {/* <MenuEditUI /> */}
         {/* <MenuAboutUI /> */}
         {/* <MenuDebugUI /> */}
         <PerspectivePickerUI tw='mx-auto self-center' />

         <SpacerUI />
         <UpdateBtnUI updater={cushy.updater} />
         <Frame line>
            <ConnectionInfoUI host={mainHost} />
            {/* <HostWebsocketIndicatorUI host={mainHost} /> */}
            {/* <HostSchemaIndicatorUI host={mainHost} /> */}
            <MenuNSFWCheckerUI />
         </Frame>
         {/* </PanelHeaderUI> */}
      </Frame>
   )
})
