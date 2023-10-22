import { observer } from 'mobx-react-lite'
import * as I from '@rsuite/icons'
import { useSt } from '../../FrontStateCtx'
import { Nav } from 'rsuite'
import React from 'react'

export const MainNavEntryUI = observer(function UI_(p: {
    onClick: () => void
    ix: string
    icon: React.ReactNode
    label: string
}) {
    return (
        <div className='flex flex-col' onClick={p.onClick}>
            <div className='flex items-center'>
                <div className='text-xs pr-1 text-gray-500'>{p.ix}</div>
                <div>{p.icon}</div>
            </div>
            <div className='text-xs text-center text-gray-500'>{p.label}</div>
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
            <div tw='p-2'>
                <MainNavEntryUI onClick={() => st.layout.addComfy()} ix='3' icon={<I.Branch />} label='Comfy' />
            </div>
            {/* MARKETPLACE */}
            <div tw='p-2'>
                <MainNavEntryUI onClick={() => st.layout.addMarketplace()} ix='3' icon={<I.Plus />} label='Packs' />
            </div>
            {/* PAINT */}
            <div tw='p-2'>
                <MainNavEntryUI onClick={() => st.layout.addPaint()} ix='2' icon={<I.Image />} label='paint' />
            </div>
            {/* CONFIG */}
            <div tw='p-2'>
                <MainNavEntryUI onClick={() => st.layout.addComfy()} ix='4' icon={<I.Gear />} label='Config' />
            </div>
            {/* CIVITAI */}
            <div tw='p-2'>
                <MainNavEntryUI
                    onClick={() => st.layout.addComfy()}
                    ix='5'
                    icon={<img width='25px' height='25px' src='/CivitaiLogo.png'></img>}
                    label='Civitai'
                />
            </div>
            <div tw='p-2'>
                <MainNavEntryUI
                    onClick={() => st.layout.addComfy()}
                    ix='6'
                    icon={<span className='material-symbols-outlined'>cloud</span>}
                    label='GPU'
                />
            </div>
        </div>
    )
})
