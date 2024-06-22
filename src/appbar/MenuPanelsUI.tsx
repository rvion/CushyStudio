import { observer } from 'mobx-react-lite'

import { allCommands } from '../ALL_CMDS'
import { allLayoutCommands } from '../app/shortcuts/cmd_layout'
import { KEYS } from '../app/shortcuts/shorcutKeys'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { Ikon } from '../csuite/icons/iconHelpers'
import { menuWithoutProps } from '../csuite/menu/Menu'
import { allPanels } from '../router/PANELS'
import { useSt } from '../state/stateContext'

const menuPanels = menuWithoutProps({
    title: 'Panels',
    entries: () => [
        menuWithoutProps({
            title: 'test',
            entries: () => allPanels.flatMap((panel) => panel.menuEntries),
        }).bind(),
        ...allPanels.flatMap((panel) => panel.menuEntries),
    ],
})

const layoutShortcuts = menuWithoutProps({
    title: 'shortcuts',
    entries: () => [...allLayoutCommands],
    // entries: () => [...allLayoutCommands],
})

export const MenuPanelsUI = observer(function MenuPanelsUI_(p: {}) {
    const st = useSt()
    return (
        <>
            {/* <MenuUI menu={menu.UI} /> */}
            {/* <menu.UI /> */}
            <menuPanels.UI />
            <layoutShortcuts.UI />
            {/* <Dropdown
                // startIcon={<span className='material-symbols-outlined'>image</span>}
                title='Panels'
                content={() => (
                    <>
                        <MenuItem
                            onClick={() => st.layout.FOCUS_OR_CREATE('Welcome', {}, 'LEFT_PANE_TABSET')}
                            icon={<span className='material-symbols-outlined text-red-400'>image</span>}
                            label='Welcome'
                        />
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
                    </>
                )}
            /> */}
        </>
    )
})
