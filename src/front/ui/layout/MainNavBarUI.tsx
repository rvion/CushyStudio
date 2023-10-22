import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useSt } from '../../FrontStateCtx'

export const MainNavEntryUI = observer(function UI_(p: {
    onClick: () => void
    ix: string
    icon: React.ReactNode
    soon?: boolean
    label: string
}) {
    return (
        <div className='flex flex-col py-2 cursor-pointer hover:bg-gray-800' onClick={p.onClick}>
            <div className='flex items-center px-3'>
                <div className='text-xs pr-1 text-gray-300'>{p.ix}</div>
                <div tw='text-xl'>{p.icon}</div>
            </div>
            <div className='text-xs text-center text-gray-300'>{p.label}</div>
        </div>
    )
})

export const MainNavBarUI = observer(function MainNavBarUI_(p: {}) {
    const st = useSt()
    return (
        <div tw='fle flex-col'>
            {/* FORM */}
            {/* <div tw='p-2'>
                <MainNavEntryUI onClick={() => st.layout.addComfy()} ix='1' icon='🛋️' label='prompt' />
            </div> */}
            {/* COMFY */}

            <MainNavEntryUI onClick={() => st.layout.addComfy()} ix='3' icon={<I.Branch />} label='Comfy' />

            {/* MARKETPLACE */}
            <MainNavEntryUI
                onClick={() => st.layout.addMarketplace()}
                ix='3'
                icon={<span className='material-symbols-outlined'>apps</span>}
                label='Packs'
            />

            {/* PAINT */}
            <MainNavEntryUI onClick={() => st.layout.addPaint()} ix='2' icon={<I.Image />} label='paint' />

            {/* CONFIG */}
            <MainNavEntryUI onClick={() => st.layout.addComfy()} ix='4' icon={<I.Gear />} label='Config' />

            {/* CIVITAI */}
            <MainNavEntryUI
                onClick={() => st.layout.addCivitai()}
                ix='5'
                icon={<img width='25px' height='25px' src='/CivitaiLogo.png'></img>}
                label='Civitai'
            />

            <MainNavEntryUI
                soon
                onClick={() => st.layout.addComfy()}
                ix='6'
                icon={<span className='material-symbols-outlined'>cloud</span>}
                label='GPU'
            />
        </div>
    )
})
