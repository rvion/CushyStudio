import { observer } from 'mobx-react-lite'
import React from 'react'
import { assets } from 'src/assets/assets'
import { useSt } from '../../FrontStateCtx'

const iconSize = '1.4rem'

export const MainNavEntryUI = observer(function UI_(p: {
    onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    ix: string
    icon: React.ReactNode
    soon?: boolean
    label: string
}) {
    return (
        <div className='p-0.5 mx-0.5 rounded text-center bg-gray-900 cursor-pointer hover:bg-gray-700' onClick={p.onClick}>
            {/* <div className='flex items-center'> */}
            {/* <div className='text-xs pr-1 text-gray-500'>{p.ix}</div> */}
            <div tw='p-0.5' style={{ fontSize: iconSize, lineHeight: '1em' }}>
                {p.icon}
            </div>
            {/* </div> */}
            {/* <div style={{ fontSize: '.9rem' }} className='text-center text-gray-500'>
                {p.label}
            </div> */}
        </div>
    )
})

export const MainNavBarUI = observer(function MainNavBarUI_(p: {}) {
    const st = useSt()
    return (
        <div id='main-navbar' tw='flex overflow-auto'>
            {/* COMFY */}
            <MainNavEntryUI
                onClick={() => st.layout.addActionPicker()}
                ix='1'
                icon={<span className='material-symbols-outlined text-green-500'>play_circle</span>}
                label='Cards'
            />
            {/* LEGACY MARKETPLACE */}
            {/* <MainNavEntryUI
                onClick={() => st.layout.addLibrary()}
                ix='2'
                icon={<span className='material-symbols-outlined text-blue-500'>apps</span>}
                label='Apps'
            /> */}
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
                icon={<span className='material-symbols-outlined text-yellow-500'>image</span>}
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
        </div>
    )
})
