import { observer } from 'mobx-react-lite'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { IndicatorDBHealthBtnUI } from './IndicatorDBHealthBtnUI'
import { ThemePreviewUI } from './ThemePreviewUI'

export const MenuDebugUI = observer(function MenuDebugUI_(p: {}) {
    const st = useSt()

    return (
        <Dropdown
            appearance='subtle'
            startIcon={<span className='material-symbols-outlined text-orange-500'>sync</span>}
            title='Debug'
        >
            <MenuItem
                icon={<span className='material-symbols-outlined text-orange-500'>sync</span>}
                onClick={() => window.location.reload()}
                label='Reload'
            />
            <MenuItem //
                icon={<span className='material-symbols-outlined text-orange-500'>bug_report</span>}
                onClick={() => st.electronUtils.toggleDevTools()}
                label='console'
            />
            <MenuItem
                icon={<span className='material-symbols-outlined text-orange-500'>sync</span>}
                onClick={() => st.layout.resetCurrent()}
                label='Fix Layout'
            />
            <IndicatorDBHealthBtnUI />
        </Dropdown>
    )
})

export const MenuHelpUI = observer(function MenuHelpUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-purple-500'>help_center</span>}
            title=''
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.GO_TO('TypeDoc', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>help_outline</span>}
                label='Open doc (panel)'
            />
            <MenuItem
                onClick={() => st.layout.GO_TO('Paint', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>help</span>}
                label='Open doc (full page)'
            />
        </Dropdown>
    )
})

export const MenuConfigUI = observer(function MenuConfigUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown //
            startIcon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
            title='Config'
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.GO_TO('Config', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
                label='Config'
            />
            <MenuItem
                onClick={() => st.layout.GO_TO('Hosts', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>cloud</span>}
                label='GPUs'
            />
            {st.themeMgr.themes.map((theme) => (
                <div
                    tw='cursor-pointer hover:bg-base-300 p-2'
                    key={theme}
                    // icon={<span className='text-orange-400 material-symbols-outlined'>sync</span>}
                    onClick={() => (st.themeMgr.theme = theme)}
                >
                    <ThemePreviewUI theme={theme} />
                </div>
            ))}
        </Dropdown>
    )
})

export const MenuUtilsUI = observer(function MenuUtilsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-green-400'>code</span>}
            title='Utils'
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.GO_TO('Civitai', {})}
                icon={<img style={{ width: '1em', height: '1em' }} src={assets.public_CivitaiLogo_png}></img>}
                label='Civitai'
            />

            <MenuItem
                onClick={() => st.layout.GO_TO('Squoosh', {})}
                icon={<img style={{ width: '1em', height: '1em' }} src={assets.public_logos_squoosh_png}></img>}
                label='Squoosh'
            />
        </Dropdown>
    )
})

export const MenuComfyUI = observer(function MenuComfyUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-blue-400'>account_tree</span>}
            title='ComfyUI'
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.GO_TO('ComfyUI', {})}
                label='Comfy'
                icon={<span className='material-symbols-outlined text-cyan-400'>account_tree</span>}
            />
            <MenuItem
                onClick={() => st.layout.GO_TO('ComfyUINodeExplorer', {})}
                icon={<span className='material-symbols-outlined text-cyan-400'>explore</span>}
                label='Nodes'
            />
        </Dropdown>
    )
})

export const MenuPanelsUI = observer(function MenuPanelsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            startIcon={<span className='material-symbols-outlined text-red-400'>image</span>}
            title='Images'
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.GO_TO('Paint', {})}
                icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                label='paint - Minipaint'
            />
            <MenuItem
                onClick={() => st.layout.GO_TO('Gallery', {})}
                icon={<span className='material-symbols-outlined text-red-400'>image_search</span>}
                label='Gallery'
            />
            <MenuItem
                onClick={() => st.layout.GO_TO('LastImage', {})}
                icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                label='Last IMAGE'
            />
            <MenuItem
                onClick={() => st.layout.GO_TO('LastStep', {})}
                icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                label='Last STEP'
            />
        </Dropdown>
    )
})
