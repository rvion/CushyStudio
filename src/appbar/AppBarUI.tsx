import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { SpacerUI } from '../csuite/components/SpacerUI'
import { Frame } from '../csuite/frame/Frame'
import { defineMenu } from '../csuite/menu/Menu'
import { cmd_fav_toggleFavBar } from '../operators/commands/cmd_favorites'
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
import { menuPanels } from './MenuWindowUI'
import { PerspectivePickerUI } from './PerspectivePickerUI'

const viewMenu = defineMenu({
   title: 'View',
   entries: () => [menuPanels, menuCommands],
})

const mainMenu = defineMenu({
   title: 'mainMenu',
   entries: () => [
      //
      viewMenu,
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
         <Button.Ghost // TODO(bird_d): Toggle FavBar button here should be temporary, just to save space for now.
            square
            onClick={cmd_fav_toggleFavBar.execute}
         >
            <img style={{ width: '1.3rem' }} src={assets.CushyLogo_512_png} alt='' />
         </Button.Ghost>
         <div tw='px-1'>CushyStudio</div>
         <mainMenu.MenuBarUI />
         {/* <MenuPanelsUI /> */}
         {/* <MenuCommandsUI /> */}
         {/* <MenuComfyUI /> */}
         <MenuAppsUI />
         {/* <MenuEditUI /> */}
         <MenuSettingsUI // TODO(bird_d): Should go inside "Edit" eventually, the nesting is probably inconvienient for now.
         />
         {/* <MenuWindowUI /> */}
         <MenuAboutUI />
         <MenuDebugUI />
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
