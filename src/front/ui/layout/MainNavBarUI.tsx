import type { UIAction } from 'src/front/UIAction'
import { observer } from 'mobx-react-lite'
import * as I from '@rsuite/icons'
import { useSt } from '../../FrontStateCtx'
import { Nav } from 'rsuite'
import React from 'react'

export const MainNavEntryUI = observer(function UI_(p: { ix: string; icon: React.ReactNode; label: string }) {
    return (
        <div className='flex flex-col'>
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
        <Nav
            //
            activeKey={st.action.type}
            onSelect={(k: UIAction['type']) => {
                if (k === 'comfy') return st.setAction({ type: 'comfy' })
                if (k === 'form') return st.setAction({ type: 'form' })
                if (k === 'paint') return st.setAction({ type: 'paint' })
                if (k === 'config') return st.setAction({ type: 'config' })
                if (k === 'iframe') return st.setAction({ type: 'iframe', url: 'https://civitai.com' })
            }}
            className='text-xl'
            appearance='tabs'
            vertical
        >
            {/* FORM */}
            <Nav.Item eventKey='form'>
                <MainNavEntryUI ix='1' icon='🛋️' label='prompt' />
            </Nav.Item>
            {/* PAINT */}
            <Nav.Item eventKey='paint'>
                <MainNavEntryUI ix='2' icon={<I.Image />} label='paint' />
            </Nav.Item>
            {/* COMFY */}
            <Nav.Item eventKey='comfy'>
                <MainNavEntryUI ix='3' icon={<I.Branch />} label='Comfy' />
            </Nav.Item>
            {/* CONFIG */}
            <Nav.Item eventKey='config'>
                <MainNavEntryUI ix='4' icon={<I.Gear />} label='Config' />
            </Nav.Item>
            {/* CIVITAI */}
            <Nav.Item eventKey='iframe'>
                <MainNavEntryUI ix='5' icon={<img width='25px' height='25px' src='/CivitaiLogo.png'></img>} label='Civitai' />
            </Nav.Item>
            <Nav.Item eventKey='cloud'>
                <MainNavEntryUI ix='6' icon={<span className='material-symbols-outlined'>cloud</span>} label='GPU' />
            </Nav.Item>
        </Nav>
    )
})
