import { observer } from 'mobx-react-lite'

import { Frame } from '../csuite/frame/Frame'
import { cmd_fav_toggleFavBar } from '../operators/commands/cmd_favorites'
import { HostSchemaIndicatorUI } from '../panels/host/HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from '../panels/host/HostWebsocketIndicatorUI'
import { UpdateBtnUI } from '../updater/UpdateBtnUI'
import { assets } from '../utils/assets/assets'
import { MenuDebugUI } from './MenuDebugUI'
import { MenuAboutUI } from './MenuAboutUI'
import { MenuNSFWCheckerUI } from './MenuNSFWChecker'
import { MenuSettingsUI } from './MenuSettingsUI'
import { PanelHeaderUI } from '../panels/PanelHeader'
import { MenuWindowUI } from './MenuWindowUI'
import { MenuEditUI } from './MenuEditUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const mainHost = cushy.mainHost
    return (
        <Frame base={cushy.theme.value.appbar ?? { contrast: 0.3 }} tw='overflow-auto shrink-0' id='CushyAppBar'>
            <PanelHeaderUI tw='flex items-center px-2 overflow-auto'>
                <img style={{ width: '1.6rem' }} src={assets.CushyLogo_512_png} alt='' />
                <div tw='px-1'>
                    <UpdateBtnUI updater={cushy.updater}>CushyStudio </UpdateBtnUI>
                </div>
                <MenuWindowUI />
                <MenuEditUI />
                <cmd_fav_toggleFavBar.NavBarBtnUI label='Favs' />
                <MenuSettingsUI />
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
