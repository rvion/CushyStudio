import { observer } from 'mobx-react-lite'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { UpdateBtnUI } from '../../updater/UpdateBtnUI'
import { CushyStudioLinkUI } from './AppBarCushyStudioLinkUI'
import { HostSchemaIndicatorUI } from '../../panels/host/HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from '../../panels/host/HostWebsocketIndicatorUI'
import { MenuAuthUI } from './MenuAuthUI'
import { MenuComfyUI } from './MenuComfyUI'
import { MenuConfigUI } from './MenuConfigUI'
import { MenuThemeUI } from './MenuThemeUI'
import { MenuDebugUI } from './MenuDebugUI'
import { MenuHelpUI } from './MenuHelpUI'
import { MenuPanelsUI } from './MenuPanelsUI'
import { MenuUtilsUI } from './MenuUtilsUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    const mainHost = st.mainHost
    return (
        <div tw='overflow-auto' id='CushyAppBar'>
            <div tw='flex items-center px-2 overflow-auto'>
                <img style={{ width: '1.6rem' }} src={assets.CushyLogo_512_png} alt='' />
                <div tw='px-1'>
                    <UpdateBtnUI updater={st.updater}>CushyStudio </UpdateBtnUI>
                </div>
                <MenuPanelsUI />
                <MenuComfyUI />
                <MenuUtilsUI />
                <MenuConfigUI />
                <MenuThemeUI />
                <MenuHelpUI />
                <MenuDebugUI />
                <MenuAuthUI />
                <div className='flex flex-grow'></div>
                <HostWebsocketIndicatorUI host={mainHost} />
                <HostSchemaIndicatorUI host={mainHost} />
                <CushyStudioLinkUI />
                <label tw='swap swap-flip text-2xl'>
                    <input type='checkbox' />
                    <div tw='swap-on'>😈</div>
                    <div tw='swap-off'>😇</div>
                </label>
            </div>
            {/* <MainNavBarUI /> */}
        </div>
    )
})
