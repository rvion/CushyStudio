import { observer } from 'mobx-react-lite'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { UpdateBtnUI } from '../../updater/UpdateBtnUI'
import { CushyStudioLinkUI } from './AppBarCushyStudioLinkUI'
import { IndicatorSchemaUI } from './AppBarSchemaBtnUI'
import { IndicatorWebsocketUI } from './AppBarWebsocketBtnUI'
import { MenuAuthUI } from './MenuAuthUI'
import { MenuComfyUI } from './MenuComfyUI'
import { MenuConfigUI } from './MenuConfigUI'
import { MenuDebugUI } from './MenuDebugUI'
import { MenuHelpUI } from './MenuHelpUI'
import { MenuPanelsUI } from './MenuPanelsUI'
import { MenuUtilsUI } from './MenuUtilsUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <div tw='overflow-auto' id='CushyAppBar'>
            <div tw='flex items-center px-2 overflow-auto'>
                <img style={{ width: '1.6rem' }} src={assets.public_CushyLogo_512_png} alt='' />
                <div tw='px-1'>
                    <UpdateBtnUI updater={st.updater}>CushyStudio </UpdateBtnUI>
                </div>
                <MenuAuthUI />
                <MenuPanelsUI />
                <MenuComfyUI />
                <MenuUtilsUI />
                <MenuConfigUI />
                <MenuHelpUI />
                <MenuDebugUI />
                <div className='flex flex-grow'></div>
                <IndicatorWebsocketUI />
                <IndicatorSchemaUI />
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
