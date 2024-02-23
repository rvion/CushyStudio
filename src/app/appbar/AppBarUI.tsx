import { observer } from 'mobx-react-lite'

import { HostSchemaIndicatorUI } from '../../panels/host/HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from '../../panels/host/HostWebsocketIndicatorUI'
import { useSt } from '../../state/stateContext'
import { UpdateBtnUI } from '../../updater/UpdateBtnUI'
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
import { assets } from 'src/utils/assets/assets'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    const mainHost = st.mainHost
    return (
        <div tw='overflow-auto shrink-0' id='CushyAppBar'>
            <div tw='flex items-center px-2 overflow-auto'>
                <img style={{ width: '1.6rem' }} src={assets.CushyLogo_512_png} alt='' />
                <div tw='px-1'>
                    <UpdateBtnUI updater={st.updater}>CushyStudio </UpdateBtnUI>
                </div>
                <MenuPanelsUI />
                <MenuComfyUI />
                <MenuUtilsUI />
                <MenuAppsUI />
                <MenuSettingsUI />
                <MenuThemeUI />
                <MenuHelpUI />
                <MenuDebugUI />
                <MenuAuthUI />
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
