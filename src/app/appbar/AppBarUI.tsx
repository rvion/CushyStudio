import { observer } from 'mobx-react-lite'

import { cmd_fav_toggleFavBar } from '../../operators/commands/cmd_favorites'
import { menu_utils } from '../../operators/commands/cmd_goTo'
import { DebugControlsUI } from '../../operators/DebugControlsUI'
import { HostSchemaIndicatorUI } from '../../panels/host/HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from '../../panels/host/HostWebsocketIndicatorUI'
import { useSt } from '../../state/stateContext'
import { UpdateBtnUI } from '../../updater/UpdateBtnUI'
import { assets } from '../../utils/assets/assets'
import { CushyStudioLinkUI } from './AppBarCushyStudioLinkUI'
import { MenuAppsUI } from './MenuApps'
import { MenuAuthUI } from './MenuAuthUI'
import { MenuComfyUI } from './MenuComfyUI'
import { MenuDebugUI } from './MenuDebugUI'
import { MenuHelpUI } from './MenuHelpUI'
import { MenuNSFWCheckerUI } from './MenuNSFWChecker'
import { MenuPanelsUI } from './MenuPanelsUI'
import { MenuSettingsUI } from './MenuSettingsUI'
import { MenuThemeUI } from './MenuThemeUI'
import { MenuUtilsUI } from './MenuUtilsUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const mainHost = cushy.mainHost
    return (
        <div tw='overflow-auto shrink-0 bg-neutral' id='CushyAppBar'>
            <div tw='flex items-center px-2 overflow-auto'>
                <img style={{ width: '1.6rem' }} src={assets.CushyLogo_512_png} alt='' />
                <div tw='px-1'>
                    <UpdateBtnUI updater={cushy.updater}>CushyStudio </UpdateBtnUI>
                </div>
                <MenuPanelsUI />
                <MenuComfyUI />
                <MenuUtilsUI />
                <menu_utils.UI2 />
                <MenuAppsUI />
                <cmd_fav_toggleFavBar.NavBarBtnUI label='Favs' />
                <MenuSettingsUI />
                <MenuThemeUI />
                <MenuHelpUI />
                <MenuDebugUI />
                <MenuAuthUI />
                <DebugControlsUI />
                <div className='flex flex-grow'></div>
                <HostWebsocketIndicatorUI host={mainHost} />
                <HostSchemaIndicatorUI host={mainHost} />
                <MenuNSFWCheckerUI />
                <CushyStudioLinkUI />
            </div>
            {/* <MainNavBarUI /> */}
        </div>
    )
})
