import { observer } from 'mobx-react-lite'

import { Frame } from '../csuite/frame/Frame'
import { cmd_fav_toggleFavBar } from '../operators/commands/cmd_favorites'
import { HostSchemaIndicatorUI } from '../panels/host/HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from '../panels/host/HostWebsocketIndicatorUI'
import { UpdateBtnUI } from '../updater/UpdateBtnUI'
import { assets } from '../utils/assets/assets'
import { MenuAppsUI } from './MenuApps'
import { MenuComfyUI } from './MenuComfyUI'
import { MenuDebugUI } from './MenuDebugUI'
import { MenuAboutUI } from './MenuAboutUI'
import { MenuNSFWCheckerUI } from './MenuNSFWChecker'
import { MenuPanelsUI } from './MenuPanelsUI'
import { MenuSettingsUI } from './MenuSettingsUI'
import { MenuThemeUI } from './MenuThemeUI'
import { MenuUtilsUI } from './MenuUtilsUI'
import { PanelHeaderUI } from '../panels/PanelHeader'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const mainHost = cushy.mainHost
    return (
        <Frame base={cushy.theme.value.appbar ?? { contrast: 0.3 }} tw='overflow-auto shrink-0' id='CushyAppBar'>
            <PanelHeaderUI tw='flex items-center px-2 overflow-auto'>
                <img style={{ width: '1.6rem' }} src={assets.CushyLogo_512_png} alt='' />
                <div tw='px-1'>
                    <UpdateBtnUI updater={cushy.updater}>CushyStudio </UpdateBtnUI>
                </div>
                <MenuPanelsUI />
                <MenuComfyUI />
                <MenuUtilsUI />
                <MenuAppsUI />
                <cmd_fav_toggleFavBar.NavBarBtnUI label='Favs' />
                <MenuSettingsUI />
                <MenuThemeUI />
                <MenuDebugUI />
                <MenuAboutUI />
                {/* <MenuAuthUI /> */}
                <div className='flex flex-grow'></div>
                <HostWebsocketIndicatorUI host={mainHost} />
                <HostSchemaIndicatorUI host={mainHost} />
                <MenuNSFWCheckerUI />
                {/* <CushyStudioLinkUI /> */}
            </PanelHeaderUI>
        </Frame>
    )
})
