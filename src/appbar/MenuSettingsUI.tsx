import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { useSt } from '../state/stateContext'

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
                        onClick={() => st.layout.open('Config', {})}
                        icon={'mdiSettingsHelper'}
                        localShortcut={KEYS.openPage_Config}
                        label='Config'
                    />
                    <MenuItem
                        onClick={() => st.layout.open('Hosts', {})}
                        icon={'mdiHospital'}
                        localShortcut={KEYS.openPage_Hosts}
                        label='ComfyUI Hosts'
                    />
                    <MenuItem
                        onClick={() => st.layout.open('Shortcuts', {})}
                        icon={'mdiKey'}
                        localShortcut={KEYS.openPage_Shortcuts}
                        label='Shortcuts'
                    />
                    {/* <MenuDivider />
                    <MenuDivider /> */}
                    {/* <MenuDebugUI /> */}
                </>
            )}
        />
    )
})
