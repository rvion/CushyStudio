import { observer } from 'mobx-react-lite'
import React from 'react'
import { assets } from 'src/assets/assets'
import { useSt } from '../../FrontStateCtx'
import { ButtonGroup, IconButton, Popover, Whisper } from 'rsuite'

export const MainNavEntryUI = observer(function UI_(p: {
    onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    ix: string
    icon: React.ReactElement
    soon?: boolean
    label: string
}) {
    return (
        <Whisper placement='bottomStart' speaker={<Popover>{p.label}</Popover>}>
            <IconButton appearance='subtle' size='sm' icon={p.icon} onClick={p.onClick}></IconButton>
        </Whisper>
    )
})

export const MainNavBarUI = observer(function MainNavBarUI_(p: {}) {
    const st = useSt()
    const themeIcon = st.theme.theme === 'light' ? 'highlight' : 'nights_stay'
    return (
        <ButtonGroup id='main-navbar' tw='flex flex-wrap'>
            {/* COMFY */}
            <MainNavEntryUI
                onClick={() => st.layout.addActionPicker()}
                ix='1'
                icon={<span className='material-symbols-outlined text-green-500'>play_circle</span>}
                label='Cards'
            />
            {/* LEGACY MARKETPLACE */}
            <MainNavEntryUI
                onClick={() => st.layout.addMarketplace()}
                ix='2'
                icon={<span className='material-symbols-outlined text-blue-500'>apps</span>}
                label='Apps'
            />
            <MainNavEntryUI
                onClick={() => st.layout.addActionPickerTree()}
                ix='2'
                icon={<span className='material-symbols-outlined text-blue-500'>account_tree</span>}
                label='Files'
            />

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
                icon={<span className='material-symbols-outlined text-yellow-500'>image_search</span>}
                label='Gallery'
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
                label='GPU'
            />
            <MainNavEntryUI
                soon
                onClick={() => st.theme.toggle()}
                ix='8'
                icon={<span className='material-symbols-outlined text-amber-800'>{themeIcon}</span>}
                label='GPU'
            />
        </ButtonGroup>
    )
})
