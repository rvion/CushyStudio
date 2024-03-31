import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from '../../rsuite/Dropdown'
import { useSt } from '../../state/stateContext'
import { KEYS } from '../shortcuts/shorcutKeys'

export const MenuSettingsUI = observer(function MenuSettingsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-purple-400'>settings</span>}
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
                </>
            )}
        />
    )
})
