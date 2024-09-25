import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { SpacerUI } from '../csuite/components/SpacerUI'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { Frame } from '../csuite/frame/Frame'
import { cmd_fav_toggleFavBar } from '../operators/commands/cmd_favorites'
import { HostSchemaIndicatorUI } from '../panels/host/HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from '../panels/host/HostWebsocketIndicatorUI'
import { UpdateBtnUI } from '../updater/UpdateBtnUI'
import { assets } from '../utils/assets/assets'
import { MenuAboutUI } from './MenuAboutUI'
import { MenuAppsUI } from './MenuApps'
import { MenuComfyUI } from './MenuComfyUI'
import { MenuDebugUI } from './MenuDebugUI'
import { MenuNSFWCheckerUI } from './MenuNSFWChecker'
import { MenuSettingsUI } from './MenuSettingsUI'
import { MenuShortcutsUI } from './MenuShortcuts'
import { MenuUtilsUI } from './MenuUtilsUI'
import { MenuPanelsUI } from './MenuWindowUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const mainHost = cushy.mainHost
    return (
        <Frame
            //
            base={cushy.theme.value.appbar ?? { contrast: -0.077 }}
            tw={['flex items-center px-2 overflow-auto', 'overflow-auto shrink-0']}
            id='CushyAppBar'
        >
            {/* <PanelHeaderUI tw='flex items-center px-2 overflow-auto'> */}
            <Button.Ghost // TODO(bird_d): Toggle FavBar button here should be temporary, just to save space for now.
                square
                onClick={cmd_fav_toggleFavBar.execute}
            >
                <img style={{ width: '1.3rem' }} src={assets.CushyLogo_512_png} alt='' />
            </Button.Ghost>
            <div tw='px-1'>
                <UpdateBtnUI updater={cushy.updater}>CushyStudio </UpdateBtnUI>
            </div>
            <MenuPanelsUI />
            <MenuShortcutsUI />
            <MenuComfyUI />
            <MenuAppsUI />
            {/* <MenuEditUI /> */}
            <MenuSettingsUI // TODO(bird_d): Should go inside "Edit" eventually, the nesting is probably inconvienient for now.
            />
            {/* <MenuWindowUI /> */}
            <MenuUtilsUI />
            <MenuAboutUI />

            <MenuDebugUI />

            <SpacerUI />
            <HostWebsocketIndicatorUI host={mainHost} />
            <HostSchemaIndicatorUI host={mainHost} />
            <MenuNSFWCheckerUI />
            {/* </PanelHeaderUI> */}
        </Frame>
    )
})
