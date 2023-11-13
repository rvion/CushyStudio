import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, Dropdown } from 'rsuite'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { DBHealthUI } from './AppBarUI'
import { ComboUI } from '../shortcuts/ComboUI'
import { MainNavEntryUI } from './MainNavEntryUI'

export const MainNavBarUI = observer(function MainNavBarUI_(p: { className?: string }) {
    const st = useSt()
    const themeIcon = st.theme.theme === 'light' ? 'highlight' : 'nights_stay'

    return (
        <>
            <Button
                // onClick={() => st.layout.addActionPicker()}
                color='green'
                appearance='ghost'
                onClick={() => st.toggleCardPicker()}
                size='sm'
                // ix='1'
                startIcon={<span className='material-symbols-outlined'>view_list</span>}
                // label='Library'
                // tooltip={
                //     <>
                //         Open the Library, in a full-page popup.
                //         <ComboUI combo='cmd+1' /> or <ComboUI combo='ctrl+1' />
                //     </>
                // }
            >
                Library
            </Button>
            {/* <ButtonGroup id='main-navbar' tw='flex flex-wrap items-center' className={p.className}> */}
            {/* debug buttons */}

            {/* COMFY */}
            {/* <CardsPickerModalUI /> */}
            {/* <Dropdown.Item as={MyLink} href='/guide/introduction'>
                        Guide
                        </Dropdown.Item>
                        <Dropdown.Item as={MyLink} href='/components/overview'>
                        Components
                        </Dropdown.Item>
                        <Dropdown.Item as={MyLink} href='/resources/palette'>
                        Resources
                    </Dropdown.Item> */}
            {/* <Dropdown title='Menu' appearance='subtle'></Dropdown> */}
            <Dropdown
                icon={<span className='material-symbols-outlined text-red-400'>😀</span>}
                title='Images'
                appearance='subtle'
            >
                <MainNavEntryUI
                    onClick={() => st.layout.addPaint()}
                    ix='3'
                    icon={<span className='material-symbols-outlined text-red-400'>brush</span>}
                    label='paint'
                />
                <MainNavEntryUI
                    onClick={() => st.layout.addGallery()}
                    ix='5'
                    icon={<span className='material-symbols-outlined text-red-400'>image_search</span>}
                    label='Gallery'
                />
                <MainNavEntryUI
                    onClick={() => st.layout.addLastImage({})}
                    ix='5'
                    icon={<span className='material-symbols-outlined text-red-400'>history</span>}
                    label='Last'
                />
            </Dropdown>
            <Dropdown
                startIcon={<span className='material-symbols-outlined text-blue-400'>play_circle</span>}
                title='ComfyUI'
                appearance='subtle'
            >
                <MainNavEntryUI
                    onClick={() => st.layout.addComfy()}
                    ix='4'
                    label='Comfy'
                    icon={<span className='material-symbols-outlined text-cyan-400'>account_tree</span>}
                />
                <MainNavEntryUI
                    onClick={() => st.layout.addComfyNodeExplorer()}
                    ix='A'
                    icon={<span className='material-symbols-outlined text-cyan-400'>explore</span>}
                    label='Nodes'
                />
            </Dropdown>
            <Dropdown
                startIcon={<span className='material-symbols-outlined text-green-400'>code</span>}
                title='Utils'
                appearance='subtle'
            >
                {/* <OpenComfyExternalUI /> */}
                {/* {SEPARATOR} */}
                {/* CIVITAI */}
                <MainNavEntryUI
                    onClick={() => st.layout.addCivitai({})}
                    ix='7'
                    icon={<img style={{ width: '1em', height: '1em' }} src={assets.public_CivitaiLogo_png}></img>}
                    label='Civitai'
                />

                <MainNavEntryUI
                    onClick={() => st.layout.addSquoosh({})}
                    ix='7'
                    icon={<img style={{ width: '1em', height: '1em' }} src={assets.public_logos_squoosh_png}></img>}
                    label='Squoosh'
                />
            </Dropdown>
            <Dropdown title='Config'>
                {/* {SEPARATOR} */}
                {/* CONFIG */}
                <MainNavEntryUI
                    onClick={() => st.layout.addConfig()}
                    ix='6'
                    icon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
                    label='Config'
                />
                <MainNavEntryUI
                    soon
                    onClick={() => st.layout.addHosts()}
                    ix='8'
                    icon={<span className='material-symbols-outlined text-purple-500'>cloud</span>}
                    label='GPUs'
                />
                <MainNavEntryUI
                    soon
                    onClick={() => st.theme.toggle()}
                    ix='8'
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
                <Button
                    //
                    size='sm'
                    appearance='subtle'
                    color='orange'
                    startIcon={<span className='text-orange-400 material-symbols-outlined'>sync</span>}
                    onClick={() => window.location.reload()}
                >
                    Reload
                </Button>
                <Button //
                    size='sm'
                    appearance='subtle'
                    color='orange'
                    startIcon={<span className='text-orange-400 material-symbols-outlined'>bug_report</span>}
                    onClick={() => st.electronUtils.toggleDevTools()}
                >
                    console
                </Button>
                <Button
                    size='sm'
                    appearance='subtle'
                    color='orange'
                    startIcon={<span className='text-orange-400 material-symbols-outlined'>sync</span>}
                    onClick={() => st.layout.resetCurrent()}
                >
                    Fix Layout
                </Button>
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
//     ix='1'
//     icon={<span className='material-symbols-outlined text-green-500'>play_circle</span>}
//     label='Cards'
// /> */}
// {/* LEGACY MARKETPLACE */}
// {/* <MainNavEntryUI
//     onClick={() => st.layout.addMarketplace()}
//     ix='2'
//     icon={<span className='material-symbols-outlined text-blue-500'>apps</span>}
//     label='Apps'
// /> */}
// {/* <MainNavEntryUI
//     onClick={() => st.layout.addActionPickerTree()}
//     ix='2'
//     icon={<span className='material-symbols-outlined text-blue-500'>account_tree</span>}
//     label='Files'
// /> */}

// {/* PAINT */}
