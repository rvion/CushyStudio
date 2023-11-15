import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, Dropdown, MenuBar } from 'src/rsuite/shims'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { DBHealthUI } from './AppBarUI'
import { ComboUI } from '../shortcuts/ComboUI'
import { MainNavEntryUI } from './MainNavEntryUI'

export const MainNavBarUI = observer(function MainNavBarUI_(p: { className?: string }) {
    const st = useSt()
    const themeIcon = st.theme.theme === 'light' ? 'highlight' : 'nights_stay'

    // onClick={() => st.layout.addActionPicker()}
    // color='green'
    // size='sm'
    // label='Library'
    // tooltip={
    //     <>
    //         Open the Library, in a full-page popup.
    //         <ComboUI combo='cmd+1' /> or <ComboUI combo='ctrl+1' />
    //     </>
    // }
    // {/* <ButtonGroup id='main-navbar' tw='flex flex-wrap items-center' className={p.className}> */}
    // {/* debug buttons */}
    // {/* COMFY */}
    // {/* <CardsPickerModalUI /> */}
    // {/* <DropdownItem as={MyLink} href='/guide/introduction'>
    //             Guide
    //             </DropdownItem>
    //             <DropdownItem as={MyLink} href='/components/overview'>
    //             Components
    //             </DropdownItem>
    //             <DropdownItem as={MyLink} href='/resources/palette'>
    //             Resources
    //         </DropdownItem> */}
    // {/* <Dropdown title='Menu' appearance='subtle'></Dropdown> */}
    return (
        <>
            <Button
                appearance='subtle'
                size='sm'
                onClick={() => st.toggleCardPicker()}
                startIcon={<span className='material-symbols-outlined text-green-600'>view_list</span>}
            >
                Library
            </Button>
            <Dropdown
                style={{ zIndex: 100 }}
                startIcon={<span className='material-symbols-outlined text-red-400'>image</span>}
                title='Images'
                appearance='subtle'
            >
                <MainNavEntryUI
                    onClick={() => st.layout.addPaint()}
                    icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                    label='paint - Minipaint'
                />
                <MainNavEntryUI
                    onClick={() => st.layout.addGallery()}
                    icon={<span className='material-symbols-outlined text-red-400'>image_search</span>}
                    label='Gallery'
                />
                <MainNavEntryUI
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
                <MainNavEntryUI
                    onClick={() => st.layout.addComfy()}
                    label='Comfy'
                    icon={<span className='material-symbols-outlined text-cyan-400'>account_tree</span>}
                />
                <MainNavEntryUI
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
                {/* <OpenComfyExternalUI /> */}
                {/* {SEPARATOR} */}
                {/* CIVITAI */}
                <MainNavEntryUI
                    onClick={() => st.layout.addCivitai({})}
                    icon={<img style={{ width: '1em', height: '1em' }} src={assets.public_CivitaiLogo_png}></img>}
                    label='Civitai'
                />

                <MainNavEntryUI
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
                {/* {SEPARATOR} */}
                {/* CONFIG */}
                <MainNavEntryUI
                    onClick={() => st.layout.addConfig()}
                    icon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
                    label='Config'
                />
                <MainNavEntryUI
                    soon
                    onClick={() => st.layout.addHosts()}
                    icon={<span className='material-symbols-outlined text-purple-500'>cloud</span>}
                    label='GPUs'
                />
                <MainNavEntryUI
                    soon
                    onClick={() => st.theme.toggle()}
                    icon={<span className='material-symbols-outlined text-purple-500'>{themeIcon}</span>}
                    label='Theme'
                />
                {/* {SEPARATOR} */}
            </Dropdown>
            <Dropdown
                appearance='subtle'
                startIcon={<span className='text-orange-400 material-symbols-outlined'>sync</span>}
                title='Debug'
            >
                <MainNavEntryUI
                    appearance='subtle'
                    color='orange'
                    icon={<span className='text-orange-400 material-symbols-outlined'>sync</span>}
                    onClick={() => window.location.reload()}
                    label='Reload'
                />
                <MainNavEntryUI //
                    appearance='subtle'
                    color='orange'
                    icon={<span className='text-orange-400 material-symbols-outlined'>bug_report</span>}
                    onClick={() => st.electronUtils.toggleDevTools()}
                    label='console'
                />
                <MainNavEntryUI
                    size='sm'
                    appearance='subtle'
                    color='orange'
                    icon={<span className='text-orange-400 material-symbols-outlined'>sync</span>}
                    onClick={() => st.layout.resetCurrent()}
                    label='Fix Layout'
                />
                {/* <Button
                appearance='subtle'
                loading={Boolean(st.db.saveTimeout)}
                size='sm'
                startIcon={<span className='material-symbols-outlined'>save</span>}
                onClick={() => st.db.markDirty()}
            >
                save
            </Button> */}
                <DBHealthUI />
                {/* </ButtonGroup> */}
            </Dropdown>
        </>
    )
})
const SEPARATOR = <div style={{ flexShrink: 0, width: '2px', height: '1.4rem', border: '1px solid #6e6e6e' }}> </div>
// {/* <MainNavEntryUI
//     onClick={() => st.layout.addActionPicker()}
//     icon={<span className='material-symbols-outlined text-green-500'>play_circle</span>}
//     label='Cards'
// /> */}
// {/* LEGACY MARKETPLACE */}
// {/* <MainNavEntryUI
//     onClick={() => st.layout.addMarketplace()}
//     icon={<span className='material-symbols-outlined text-blue-500'>apps</span>}
//     label='Apps'
// /> */}
// {/* <MainNavEntryUI
//     onClick={() => st.layout.addActionPickerTree()}
//     icon={<span className='material-symbols-outlined text-blue-500'>account_tree</span>}
//     label='Files'
// /> */}

// {/* PAINT */}
