import { observer } from 'mobx-react-lite'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'

export const MenuDebugUI = observer(function MenuDebugUI_(p: {}) {
    const st = useSt()

    return (
        <Dropdown
            appearance='subtle'
            startIcon={<span className='material-symbols-outlined text-orange-500'>sync</span>}
            title='Debug'
        >
            <MenuItem
                icon={<span className='material-symbols-outlined text-orange-500'>panorama_horizontal</span>}
                onClick={st.layout.resetCurrent}
                label='Fix Layout'
            />
            <MenuItem
                icon={<span className='material-symbols-outlined text-orange-500'>sync</span>}
                onClick={st.restart}
                label='Reload'
            />
            <MenuItem
                //
                tw={[st.db.healthColor]}
                onClick={() => st.db.reset()}
                icon={<span className='text-orange-500 material-symbols-outlined'>sync</span>}
            >
                Reset DB ({st.db.health.sizeTxt})
            </MenuItem>
            <MenuItem //
                icon={<span className='material-symbols-outlined text-orange-500'>bug_report</span>}
                onClick={st.electronUtils.toggleDevTools}
                label='console'
            />
            <MenuItem
                icon={<span className='material-symbols-outlined text-orange-500'>sync</span>}
                onClick={st.fullReset_eraseConfigAndSchemaFilesAndDB}
                label='Full Reset'
            />
        </Dropdown>
    )
})
