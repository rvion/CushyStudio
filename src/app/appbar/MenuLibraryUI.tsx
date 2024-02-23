import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'

export const MenuConfigUI = observer(function MenuConfigUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown //
            startIcon={<span className='material-symbols-outlined text-purple-500'>Library</span>}
            title='Settings'
        >
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Config', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>Create an app</span>}
                shortcut={'mod+,'}
                label='Config'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>Browse apps</span>}
                label='ComfyUI Hosts'
            />
        </Dropdown>
    )
})
