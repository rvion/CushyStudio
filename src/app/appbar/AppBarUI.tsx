import { observer } from 'mobx-react-lite'
import { Button } from 'src/rsuite/shims'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { UpdateBtnUI } from '../../updater/UpdateBtnUI'
import { CushyStudioLinkUI } from './AppBarCushyStudioLinkUI'
import { IndicatorSchemaUI } from './AppBarSchemaBtnUI'
import { IndicatorWebsocketUI } from './AppBarWebsocketBtnUI'
import { MenuUtilsUI } from './MenuUtilsUI'
import { MenuPanelsUI } from './MenuPanelsUI'
import { MenuComfyUI } from './MenuComfyUI'
import { MenuConfigUI } from './MenuConfigUI'
import { MenuHelpUI } from './MenuHelpUI'
import { MenuDebugUI } from './MenuDebugUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <div tw='overflow-auto' id='CushyAppBar'>
            <div tw='flex items-center px-1 overflow-auto'>
                <img style={{ width: '1.6rem' }} src={assets.public_CushyLogo_512_png} alt='' />
                <UpdateBtnUI updater={st.updater}>CushyStudio </UpdateBtnUI>
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
