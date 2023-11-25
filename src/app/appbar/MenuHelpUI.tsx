import { observer } from 'mobx-react-lite'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'

export const MenuHelpUI = observer(function MenuHelpUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-purple-500'>help_center</span>}
            title='Help'
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.GO_TO('TypeDoc', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>help_outline</span>}
                label='Open doc (panel)'
            />
            <MenuItem
                onClick={() => st.layout.GO_TO('TypeDoc', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>help</span>}
                label='Open doc (full page)'
            />
            <MenuItem
                onClick={() => {
                    window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio#readme')
                }}
                icon={<span className='material-symbols-outlined text-purple-500'>help</span>}
                label='Open Github'
            />
        </Dropdown>
    )
})
