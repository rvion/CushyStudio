import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup } from 'rsuite'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../FrontStateCtx'
import { DBHealthUI } from './AppBarUI'
import { CardsPickerModalUI } from 'src/cards/CardPicker3UI'
import { ComboUI } from './ComboUI'
import { MainNavEntryUI } from './MainNavEntryUI'

export const MainNavBarUI = observer(function MainNavBarUI_(p: { className?: string }) {
    const st = useSt()
    const themeIcon = st.theme.theme === 'light' ? 'highlight' : 'nights_stay'
    return (
        <ButtonGroup id='main-navbar' tw='flex flex-wrap items-center' className={p.className}>
            {/* debug buttons */}
            <Button
                //
                size='sm'
                appearance='subtle'
                color='orange'
                startIcon={<span className='material-symbols-outlined'>sync</span>}
                onClick={() => window.location.reload()}
            >
                Reload
            </Button>
            {/* COMFY */}
            <MainNavEntryUI
                // onClick={() => st.layout.addActionPicker()}
                color='green'
                appearance='primary'
                onClick={() => st.openCardPicker()}
                ix='1'
                icon={<span className='material-symbols-outlined'>play_circle</span>}
                label='Cards'
                tooltip={
                    <>
                        Open the card picker
                        <ComboUI combo='cmd+1' /> or <ComboUI combo='ctrl+1' />
                    </>
                }
            />
            <CardsPickerModalUI />

            {/* <MainNavEntryUI
                onClick={() => st.layout.addActionPicker()}
                ix='1'
                icon={<span className='material-symbols-outlined text-green-500'>play_circle</span>}
                label='Cards'
            /> */}
            {/* LEGACY MARKETPLACE */}
            {/* <MainNavEntryUI
                onClick={() => st.layout.addMarketplace()}
                ix='2'
                icon={<span className='material-symbols-outlined text-blue-500'>apps</span>}
                label='Apps'
            /> */}
            {/* <MainNavEntryUI
                onClick={() => st.layout.addActionPickerTree()}
                ix='2'
                icon={<span className='material-symbols-outlined text-blue-500'>account_tree</span>}
                label='Files'
            /> */}

            {/* PAINT */}
            <MainNavEntryUI
                onClick={() => st.layout.addPaint()}
                ix='3'
                icon={<span className='material-symbols-outlined text-red-500'>brush</span>}
                label='paint'
            />

            <MainNavEntryUI
                onClick={() => st.layout.addComfy()}
                ix='4'
                label='Comfy'
                icon={<img src={assets.public_ComfyUILogo_png} style={{ width: '1em', height: '1em' }} />}
            />
            <MainNavEntryUI
                onClick={() => st.layout.addComfyNodeExplorer()}
                ix='A'
                icon={<span className='material-symbols-outlined'>explore</span>}
                label='Nodes'
            />
            {/* <OpenComfyExternalUI /> */}

            <MainNavEntryUI
                onClick={() => st.layout.addGallery()}
                ix='5'
                icon={<span className='material-symbols-outlined text-yellow-500'>image_search</span>}
                label='Gallery'
            />
            <MainNavEntryUI
                onClick={() => st.layout.addLastImage()}
                ix='5'
                icon={<span className='material-symbols-outlined text-yellow-500'>history</span>}
                label='Last'
            />

            {/* CONFIG */}
            <MainNavEntryUI
                onClick={() => st.layout.addConfig()}
                ix='6'
                icon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
                label='Config'
            />

            {/* CIVITAI */}
            <MainNavEntryUI
                onClick={() => st.layout.addCivitai()}
                ix='7'
                icon={<img style={{ width: '1em', height: '1em' }} src={assets.public_CivitaiLogo_png}></img>}
                label='Civitai'
            />

            <MainNavEntryUI
                soon
                onClick={() => st.layout.addHosts()}
                ix='8'
                icon={<span className='material-symbols-outlined text-amber-800'>cloud</span>}
                label='GPUs'
            />
            <MainNavEntryUI
                soon
                onClick={() => st.theme.toggle()}
                ix='8'
                icon={<span className='material-symbols-outlined text-amber-800'>{themeIcon}</span>}
                label='Theme'
            />
            <Button //
                size='sm'
                appearance='subtle'
                color='orange'
                startIcon={<span className='material-symbols-outlined'>bug_report</span>}
                onClick={() => st.electronUtils.toggleDevTools()}
            >
                Open console
            </Button>
            <Button
                size='sm'
                appearance='subtle'
                color='orange'
                startIcon={<span className='material-symbols-outlined'>sync</span>}
                onClick={() => st.layout.resetCurrent()}
            >
                Reset Layout
            </Button>
            <Button
                appearance='subtle'
                loading={Boolean(st.db.saveTimeout)}
                size='sm'
                startIcon={<span className='material-symbols-outlined'>save</span>}
                onClick={() => st.db.markDirty()}
            >
                save
            </Button>
            <DBHealthUI />
        </ButtonGroup>
    )
})
