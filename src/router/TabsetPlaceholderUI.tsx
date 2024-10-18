import { observer } from 'mobx-react-lite'

import { PanelUI } from '../csuite/panel/PanelUI'
import { PanelWelcomeUI } from '../panels/PanelWelcome/PanelWelcome'

// 💬 2024-10-18 rvion:
// | flexlayout-react do not support memo, so we can't wrap in observer
export const TabsetPlaceholderUI = (): JSX.Element => {
    return (
        <PanelUI>
            <PanelWelcomeUI />
        </PanelUI>
    )
}
