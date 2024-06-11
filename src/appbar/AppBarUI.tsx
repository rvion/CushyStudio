import { observer } from 'mobx-react-lite'

import { Frame } from '../csuite/frame/Frame'
import { cmd_fav_toggleFavBar } from '../operators/commands/cmd_favorites'
import { HostSchemaIndicatorUI } from '../panels/host/HostSchemaIndicatorUI'
import { HostWebsocketIndicatorUI } from '../panels/host/HostWebsocketIndicatorUI'
import { UpdateBtnUI } from '../updater/UpdateBtnUI'
import { assets } from '../utils/assets/assets'
import { MenuAboutUI } from './MenuAboutUI'
import { MenuNSFWCheckerUI } from './MenuNSFWChecker'
import { MenuSettingsUI } from './MenuSettingsUI'
import { PanelHeaderUI } from '../panels/PanelHeader'
import { MenuWindowUI } from './MenuWindowUI'
import { MenuEditUI } from './MenuEditUI'
import { Button } from '../csuite/button/Button'
import { SpacerUI } from '../controls/widgets/spacer/SpacerUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const mainHost = cushy.mainHost
    return (
        <Frame base={cushy.theme.value.appbar ?? { contrast: 0.3 }} tw='overflow-auto shrink-0' id='CushyAppBar'>
            <PanelHeaderUI tw='flex items-center px-2 overflow-auto'>
                <Button // TODO(bird_d): Toggle FavBar button here should be temporary, just to save space for now.
                    square
                    onClick={cmd_fav_toggleFavBar.execute}
                >
                    <img style={{ width: '1.3rem' }} src={assets.CushyLogo_512_png} alt='' />
                </Button>
                <div tw='px-1'>
                    <UpdateBtnUI updater={cushy.updater}>CushyStudio </UpdateBtnUI>
                </div>
                <MenuEditUI />
                <MenuSettingsUI // TODO(bird_d): Should go inside "Edit" eventually, the nesting is probably inconvienient for now.
                />
                <MenuWindowUI />
                <MenuAboutUI />

                <SpacerUI />
                <HostWebsocketIndicatorUI host={mainHost} />
                <HostSchemaIndicatorUI host={mainHost} />
                <MenuNSFWCheckerUI />
            </PanelHeaderUI>
        </Frame>
    )
})
