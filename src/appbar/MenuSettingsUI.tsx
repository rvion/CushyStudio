import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDivider, MenuItem } from '../csuite/dropdown/MenuItem'
import { useSt } from '../state/stateContext'
import { Ikon } from '../csuite/icons/iconHelpers'
import { MenuDebugUI } from './MenuDebugUI'

export const MenuSettingsUI = observer(function MenuSettingsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            // text-purple-400
            // startIcon={<span className='material-symbols-outlined'>settings</span>}
            title='Settings'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Config', {})}
                        icon={<span className='material-symbols-outlined text-purple-400'>settings</span>}
                        shortcut={KEYS.openPage_Config}
                        label='Config'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}
                        icon={<span className='material-symbols-outlined text-purple-400'>cloud</span>}
                        shortcut={KEYS.openPage_Hosts}
                        label='ComfyUI Hosts'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Shortcuts', {})}
                        icon={<span className='material-symbols-outlined text-purple-400'>keyboard</span>}
                        shortcut={KEYS.openPage_Shortcuts}
                        label='Shortcuts'
                    />
                    <MenuDivider />
                    <Dropdown // TODO(bird_d): Temporary, just to clean up the top bar for now. Not good to have this be a pop-up imo and should be removed when done testing the theming stuff.
                        startIcon={'mdiThemeLightDark'}
                        expand
                        title='Quick Theming'
                        content={() => <>{cushy.theme.render()}</>}
                    />
                    <MenuDivider />
                    <MenuDebugUI />
                </>
            )}
        />
    )
})
