import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'
import { KEYS } from '../shortcuts/shorcutKeys'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'

export const MenuAppsUI = observer(function MenuAppsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown //
            startIcon={<span className='material-symbols-outlined text-green-400'>apps</span>}
            title='Apps'
        >
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Marketplace', {})}
                icon={<span className='material-symbols-outlined'>cloud_download</span>}
                shortcut={KEYS.openPage_Marketplace}
                label='Civitai'
            />
        </Dropdown>
    )
})
