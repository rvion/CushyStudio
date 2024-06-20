import { observer } from 'mobx-react-lite'

import { assets } from '../utils/assets/assets'
import { KEYS } from '../app/shortcuts/shorcutKeys'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDivider, MenuItem } from '../csuite/dropdown/MenuItem'
import { Ikon } from '../csuite/icons/iconHelpers'
import { useSt } from '../state/stateContext'

export const MenuWindowUI = observer(function MenuWindowUI_(p: {}) {
    return (
        <Dropdown
            title='Window'
            content={() => {
                return (
                    <>
                        <MenuItem onClick={cushy.layout.resetCurrent} label='Fix Layout' />
                        <PanelsDropdown />
                        <UtilsDropdown />
                    </>
                )
            }}
        />
    )
})

const PanelsDropdown = observer(function PanelsDropdown_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            expand
            // startIcon={<span className='material-symbols-outlined'>image</span>}
            title='Panels'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Welcome', {}, 'LEFT_PANE_TABSET')}
                        icon={<span className='material-symbols-outlined text-red-400'>image</span>}
                        label='Welcome'
                    />

                    <MenuDivider />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Output', {})}
                        icon={<span className='material-symbols-outlined text-red-400'>image</span>}
                        label='Output'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Icons', {})}
                        icon={<Ikon.mdiPostageStamp className='text-red-400' />}
                        label='Icons'
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
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Steps', {})}
                        icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                        label='STEPS'
                    />
                    <MenuDivider />
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
                    <MenuDivider>Perspectives</MenuDivider>
                    <MenuItem
                        // onClick={() => st.layout.GO_TO('LastStep', {})}
                        icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                        label='default'
                    />
                </>
            )}
        />
    )
})

const UtilsDropdown = observer(function UtilsDropdown_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            // startIcon={<span className='material-symbols-outlined text-green-400'>code</span>}
            // startIcon={<span className='material-symbols-outlined'>code</span>}
            expand
            title='Utils'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Models', {})}
                        icon={<img style={{ width: '1em', height: '1em' }} src={assets.CivitaiLogo_png}></img>}
                        shortcut={KEYS.openPage_Models}
                        label='Civitai (fast and clean)'
                    />

                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Civitai', {})}
                        icon={<img style={{ width: '1em', height: '1em' }} src={assets.CivitaiLogo_png}></img>}
                        shortcut={KEYS.openPage_Civitai}
                        label='Civitai (iframe)'
                    />

                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Squoosh', {})}
                        icon={<img style={{ width: '1em', height: '1em' }} src={assets.logos_squoosh_png}></img>}
                        shortcut={KEYS.openPage_Squoosh}
                        label='Squoosh'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://app.posemy.art/' })}
                        icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                        shortcut={KEYS.openPage_Posemy}
                        label='3d Poser (posemy.art)'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Paint', {})}
                        icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                        shortcut={KEYS.openPage_Paint}
                        label='Minipaint'
                    />
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://unsplash.com/' })}
                        icon={<span className='material-symbols-outlined text-purple-400'>image_search</span>}
                        shortcut={KEYS.openPage_Unsplash}
                        label='Unsplash - Free images'
                    />
                </>
            )}
        />
    )
})
