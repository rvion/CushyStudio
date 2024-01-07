import { observer } from 'mobx-react-lite'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'

export const MenuUtilsUI = observer(function MenuUtilsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-green-400'>code</span>}
            title='Utils'
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Civitai', {})}
                icon={<img style={{ width: '1em', height: '1em' }} src={assets.CivitaiLogo_png}></img>}
                label='Civitai'
            />

            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Squoosh', {})}
                icon={<img style={{ width: '1em', height: '1em' }} src={assets.logos_squoosh_png}></img>}
                label='Squoosh'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://app.posemy.art/' })}
                icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                label='3d Poser (posemy.art)'
            />
        </Dropdown>
    )
})
