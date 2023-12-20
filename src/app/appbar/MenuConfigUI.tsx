import { observer } from 'mobx-react-lite'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'

export const MenuConfigUI = observer(function MenuConfigUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown //
            startIcon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
            title='Config'
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Config', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
                label='Config'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>cloud</span>}
                label='ComfyUI Hosts'
            />
        </Dropdown>
    )
})
