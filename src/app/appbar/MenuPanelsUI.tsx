import { observer } from 'mobx-react-lite'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'
import { KEYS } from '../shortcuts/shorcutKeys'

export const MenuPanelsUI = observer(function MenuPanelsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown startIcon={<span className='material-symbols-outlined text-red-400'>image</span>} title='Panels'>
            <MenuItem
                icon={<span className='material-symbols-outlined text-orange-500'>panorama_horizontal</span>}
                onClick={st.layout.resetCurrent}
                label='Fix Layout'
            />
            <div className='divider my-1'>Panels</div>
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Output', {})}
                icon={<span className='material-symbols-outlined text-red-400'>image</span>}
                label='Output'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Models', {})}
                icon={<span className='material-symbols-outlined text-red-400'>model_training</span>}
                shortcut={KEYS.openPage_Models}
                label='Model Manager'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://app.posemy.art/' })}
                shortcut={KEYS.openPage_Posemy}
                icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                label='3d Poser (posemy.art)'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Paint', {})}
                icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                shortcut={KEYS.openPage_Paint}
                label='paint - Minipaint'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Gallery', {})}
                icon={<span className='material-symbols-outlined text-red-400'>image_search</span>}
                label='Gallery'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('LastImage', {})}
                icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                label='Last IMAGE'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('LastStep', {})}
                icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                label='Last STEP'
            />
            <div className='divider my-1'>Layout Navigation</div>
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('LastStep', {})}
                icon={<span className='material-symbols-outlined text-red-400'>keyboard_arrow_left</span>}
                shortcut={'mod+left'}
                label='Focus previous tab'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('LastStep', {})}
                icon={<span className='material-symbols-outlined text-red-400'>keyboard_arrow_right</span>}
                shortcut={'mod+right'}
                label='Focus next tab'
            />
            <div className='divider my-1'>Perspectives</div>
            <MenuItem
                // onClick={() => st.layout.GO_TO('LastStep', {})}
                icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                label='default'
            />
        </Dropdown>
    )
})
