import { observer } from 'mobx-react-lite'
import { Button, Dropdown, DropdownItem } from 'src/rsuite/shims'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { DBHealthUI } from './AppBarUI'
import { ThemeName } from 'src/theme/ThemeManager'

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
                style={{ zIndex: 100 }}
                startIcon={<span className='material-symbols-outlined text-red-400'>image</span>}
                title='Images'
                appearance='subtle'
            >
                <DropdownItem
                    onClick={() => st.layout.addPaint()}
                    icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                    label='paint - Minipaint'
                />
                <DropdownItem
                    onClick={() => st.layout.addGallery()}
                    icon={<span className='material-symbols-outlined text-red-400'>image_search</span>}
                    label='Gallery'
                />
                <DropdownItem
                    onClick={() => st.layout.addLastImage({})}
                    icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                    label='Last'
                />
            </Dropdown>
            <Dropdown
                style={{ zIndex: 100 }}
                startIcon={<span className='material-symbols-outlined text-blue-400'>account_tree</span>}
                title='ComfyUI'
                appearance='subtle'
            >
                <DropdownItem
                    onClick={() => st.layout.addComfy()}
                    label='Comfy'
                    icon={<span className='material-symbols-outlined text-cyan-400'>account_tree</span>}
                />
                <DropdownItem
                    onClick={() => st.layout.addComfyNodeExplorer()}
                    icon={<span className='material-symbols-outlined text-cyan-400'>explore</span>}
                    label='Nodes'
                />
            </Dropdown>
            <Dropdown
                style={{ zIndex: 100 }}
                startIcon={<span className='material-symbols-outlined text-green-400'>code</span>}
                title='Utils'
                appearance='subtle'
            >
                <DropdownItem
                    onClick={() => st.layout.addCivitai({})}
                    icon={<img style={{ width: '1em', height: '1em' }} src={assets.public_CivitaiLogo_png}></img>}
                    label='Civitai'
                />

                <DropdownItem
                    onClick={() => st.layout.addSquoosh({})}
                    icon={<img style={{ width: '1em', height: '1em' }} src={assets.public_logos_squoosh_png}></img>}
                    label='Squoosh'
                />
            </Dropdown>
            <Dropdown //
                style={{ zIndex: 100 }}
                startIcon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
                title='Config'
                appearance='subtle'
            >
                <DropdownItem
                    onClick={() => st.layout.addConfig()}
                    icon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
                    label='Config'
                />
                <DropdownItem
                    onClick={() => st.layout.addHosts()}
                    icon={<span className='material-symbols-outlined text-purple-500'>cloud</span>}
                    label='GPUs'
                />
                <DropdownItem
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
                <DropdownItem
                    icon={<span className='text-warning material-symbols-outlined'>sync</span>}
                    onClick={() => window.location.reload()}
                    label='Reload'
                />
                <DropdownItem //
                    icon={<span className='text-warning material-symbols-outlined'>bug_report</span>}
                    onClick={() => st.electronUtils.toggleDevTools()}
                    label='console'
                />
                <DropdownItem
                    icon={<span className='text-warning material-symbols-outlined'>sync</span>}
                    onClick={() => st.layout.resetCurrent()}
                    label='Fix Layout'
                />
                <DBHealthUI />
            </Dropdown>
            <Dropdown
                appearance='subtle'
                startIcon={<span className='text-primary material-symbols-outlined'>palette</span>}
                title='Theme'
            >
                {st.themeMgr.themes.map((theme) => (
                    <DropdownItem
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

export const ThemePreviewUI = observer(function ThemePreviewUI_(p: { theme: ThemeName }) {
    return (
        <div data-theme={p.theme} className='bg-base-100 text-base-content w-full cursor-pointer font-sans'>
            <div className='grid grid-cols-5 grid-rows-3'>
                <div className='bg-base-200 col-start-1 row-span-2 row-start-1'></div>{' '}
                <div className='bg-base-300 col-start-1 row-start-3'></div>{' '}
                <div className='bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2'>
                    <div className='font-bold'>{p.theme}</div>
                    <div className='flex flex-wrap gap-1'>
                        <div className='bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                            <div className='text-primary-content text-sm font-bold'>A</div>
                        </div>{' '}
                        <div className='bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                            <div className='text-secondary-content text-sm font-bold'>A</div>
                        </div>{' '}
                        <div className='bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                            <div className='text-accent-content text-sm font-bold'>A</div>
                        </div>{' '}
                        <div className='bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                            <div className='text-neutral-content text-sm font-bold'>A</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
