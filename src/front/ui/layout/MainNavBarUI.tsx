import { observer } from 'mobx-react-lite'
import React from 'react'
import { Popover, Whisper } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { OpenComfyExternalUI } from './AppBarUI'
import { assets } from 'src/assets/assets'

export const MainNavEntryUI = observer(function UI_(p: {
    onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    ix: string
    icon: React.ReactNode
    soon?: boolean
    label: string
}) {
    return (
        <div className='m-1 rounded bg-gray-900 cursor-pointer hover:bg-gray-800' onClick={p.onClick}>
            <div className='flex items-center px-3 '>
                <div className='text-xs pr-1 text-gray-500'>{p.ix}</div>
                <div tw='text-xl'>{p.icon}</div>
            </div>
            <div className='text-xs text-center text-gray-500'>{p.label}</div>
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
                icon={
                    <span style={{ fontSize: '1em' }} className='material-symbols-outlined text-green-500'>
                        play_circle
                    </span>
                }
                label='Cards'
            />
            <MainNavEntryUI
                onClick={() => st.layout.addMarketplace()}
                ix='2'
                icon={
                    <span style={{ fontSize: '1em' }} className='material-symbols-outlined text-blue-500'>
                        apps
                    </span>
                }
                label='Apps'
            />
            <MainNavEntryUI
                onClick={() => st.layout.addActionPickerTree()}
                ix='2'
                icon={
                    <span style={{ fontSize: '1em' }} className='material-symbols-outlined text-blue-500'>
                        account_tree
                    </span>
                }
                label='Files'
            />

            {/* PAINT */}
            <MainNavEntryUI
                onClick={() => st.layout.addPaint()}
                ix='3'
                icon={
                    <span style={{ fontSize: '1em' }} className='material-symbols-outlined text-red-500'>
                        brush
                    </span>
                }
                label='paint'
            />

            {/* <Whisper
                placement='right'
                enterable
                speaker={
                    <Popover>
                    </Popover>
                }
            >
                <div>
                </div>
            </Whisper> */}
            <MainNavEntryUI
                //
                onClick={() => st.layout.addComfy()}
                ix='4'
                icon={
                    <img
                        src={assets.public_ComfyUILogo_png}
                        style={{
                            paddingBottom: '0.4rem',
                            paddingLeft: '0.4rem',
                            width: '1.5rem',
                            height: '1.5rem',
                        }}
                    />
                }
                label='Comfy'
            />
            <MainNavEntryUI
                //
                onClick={() => st.layout.addComfyNodeExplorer()}
                ix='A'
                icon={
                    <span style={{ fontSize: '1em' }} className='material-symbols-outlined'>
                        explore
                    </span>
                }
                label='Nodes'
            />
            <OpenComfyExternalUI />

            <MainNavEntryUI
                onClick={() => st.layout.addGallery()}
                ix='5'
                icon={
                    <span style={{ fontSize: '1em' }} className='material-symbols-outlined text-yellow-500'>
                        image
                    </span>
                }
                label='Gallery'
            />

            {/* CONFIG */}
            <MainNavEntryUI
                onClick={() => st.layout.addConfig()}
                ix='6'
                icon={
                    <span style={{ fontSize: '1em' }} className='material-symbols-outlined text-purple-500'>
                        settings
                    </span>
                }
                label='Config'
            />

            {/* CIVITAI */}
            <MainNavEntryUI
                onClick={() => st.layout.addCivitai()}
                ix='7'
                icon={<img width='25px' height='25px' src={assets.public_CivitaiLogo_png}></img>}
                label='Civitai'
            />

            <MainNavEntryUI
                soon
                onClick={() => st.layout.addHosts()}
                ix='8'
                icon={
                    <span style={{ fontSize: '1em' }} className='material-symbols-outlined text-amber-800'>
                        cloud
                    </span>
                }
                label='GPU'
            />
        </div>
    )
})
