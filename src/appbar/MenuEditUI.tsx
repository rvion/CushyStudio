import { observer } from 'mobx-react-lite'

import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDivider, MenuItem } from '../csuite/dropdown/MenuItem'
import { Ikon } from '../csuite/icons/iconHelpers'
import { Button } from '../csuite/button/Button'
import { JsonViewUI } from '../widgets/workspace/JsonViewUI'
import { MenuComfyUI } from './MenuComfyUI'
import { MenuAppsUI } from './MenuApps'

// TODO(bird_d): Settings can go here eventually, but it's a bit cluttered right now.

export const MenuEditUI = observer(function MenuEditUI_(p: {}) {
    return (
        <Dropdown
            title='Edit'
            content={() => (
                <>
                    <MenuComfyUI />
                    <MenuAppsUI />
                </>
            )}
        />
    )
})
