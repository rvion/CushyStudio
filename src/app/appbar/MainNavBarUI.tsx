import { observer } from 'mobx-react-lite'
import { Button } from 'src/rsuite/shims'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { DBHealthUI } from './AppBarUI'
import { ThemePreviewUI } from './ThemePreviewUI'

export const MainNavBarUI = observer(function MainNavBarUI_(p: { className?: string }) {
    const st = useSt()
    const themeIcon = st.themeMgr.theme === 'light' ? 'highlight' : 'nights_stay'
    return (
        <>
            <Button
                appearance='subtle'
                size='sm'
                onClick={() => st.toggleCardPicker()}
                icon={<span className='material-symbols-outlined text-success'>view_list</span>}
            >
                Library
            </Button>
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
                <MenuItem
                    onClick={() => st.themeMgr.toggle()}
                    icon={<span className='material-symbols-outlined text-purple-500'>{themeIcon}</span>}
                    label='Theme'
                />
            </Dropdown>
            <Dropdown
                appearance='subtle'
                startIcon={<span className='text-warning material-symbols-outlined'>sync</span>}
                title='Debug'
            >
                <MenuItem
                    icon={<span className='text-warning material-symbols-outlined'>sync</span>}
                    onClick={() => window.location.reload()}
                    label='Reload'
                />
                <MenuItem //
                    icon={<span className='text-warning material-symbols-outlined'>bug_report</span>}
                    onClick={() => st.electronUtils.toggleDevTools()}
                    label='console'
                />
                <MenuItem
                    icon={<span className='text-warning material-symbols-outlined'>sync</span>}
                    onClick={() => st.layout.resetCurrent()}
                    label='Fix Layout'
                />
                <DBHealthUI />
            </Dropdown>
            <Dropdown
                startIcon={<span className='material-symbols-outlined text-pink-400'>help_center</span>}
                title='Docs'
                appearance='subtle'
            >
                <MenuItem
                    onClick={() => st.layout.GO_TO('TypeDoc', {})}
                    icon={<span className='material-symbols-outlined text-pink-400'>help_outline</span>}
                    label='Open doc (panel)'
                />
                <MenuItem
                    onClick={() => st.layout.GO_TO('Paint', {})}
                    icon={<span className='material-symbols-outlined text-pink-400'>help</span>}
                    label='Open doc (full page)'
                />
            </Dropdown>
            <Dropdown
                appearance='subtle'
                startIcon={<span className='text-primary material-symbols-outlined'>palette</span>}
                title='Theme'
            >
                {st.themeMgr.themes.map((theme) => (
                    <MenuItem
                        key={theme}
                        // icon={<span className='text-orange-400 material-symbols-outlined'>sync</span>}
                        onClick={() => (st.themeMgr.theme = theme)}
                        label={<ThemePreviewUI theme={theme} />}
                    />
                ))}
            </Dropdown>
            {/* <ThemePickerUI /> */}
        </>
    )
})
