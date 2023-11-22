import { observer } from 'mobx-react-lite'
import { Button } from 'src/rsuite/shims'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { UpdateBtnUI } from '../../updater/UpdateBtnUI'
import { CushyStudioLinkUI } from './CushyStudioLinkUI'
import { IndicatorSchemaUI } from './IndicatorSchemaUI'
import { IndicatorWebsocketUI } from './IndicatorWebsocketUI'
import { MenuComfyUI, MenuConfigUI, MenuDebugUI, MenuHelpUI, MenuPanelsUI, MenuUtilsUI } from './MainNavBarUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <div tw='overflow-auto' id='CushyAppBar'>
            <div
                // style={{ borderBottom: '1px solid #2b2b2b' }}
                tw='flex items-center gap-0.5 px-1 overflow-visible'
            >
                <img style={{ width: '1.6rem' }} src={assets.public_CushyLogo_512_png} alt='' />
                <UpdateBtnUI updater={st.updater}>CushyStudio - </UpdateBtnUI>
                <Button
                    appearance='subtle'
                    size='sm'
                    onClick={() => st.toggleCardPicker()}
                    icon={<span className='material-symbols-outlined text-success'>view_list</span>}
                >
                    Library
                </Button>
                <MenuPanelsUI />
                <MenuComfyUI />
                <MenuUtilsUI />
                <MenuDebugUI />
                <div className='flex flex-grow'></div>
                <MenuHelpUI />
                <MenuConfigUI />
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
