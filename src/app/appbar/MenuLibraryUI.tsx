import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from '../../rsuite/Dropdown'
import { useSt } from '../../state/stateContext'

export const MenuConfigUI = observer(function MenuConfigUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-purple-500'>Library</span>}
            title='Settings'
            content={() => (
                <>
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
                </>
            )}
        />
    )
})
