import type { FC } from 'react'

import { observer } from 'mobx-react-lite'

import { Panel, type PanelHeader, type PanelPreset } from '../../router/Panel'

export const PanelIframe = new Panel({
    name: 'IFrame',
    widget: (): FC<PanelIframeProps> => PanelIframeUI,
    header: (): PanelHeader => ({ title: 'IFrame' }),
    def: (): PanelIframeProps => ({ url: 'https://app.posemy.art/' }),
    category: 'tools',
    icon: 'mdiWebPlus',
    presets: {
        Posemy(): PanelPreset<PanelIframeProps> {
            return { props: { url: 'https://app.posemy.art/' } }
        },
        Civitai(): PanelPreset<PanelIframeProps> {
            return { props: { url: 'https://civitai.com/' } }
        },
        Squoosh(): PanelPreset<PanelIframeProps> {
            return { props: { url: 'https://squoosh.app/' } }
        },
        Paint(): PanelPreset<PanelIframeProps> {
            return { props: { url: 'https://minipaint.github.io/' } }
        },
        Photopea(): PanelPreset<PanelIframeProps> {
            return { props: { url: 'https://www.photopea.com/' } }
        },
    },
})

type PanelIframeProps = {
    onPageChange?: (p: { url: string }) => void
    name?: string
    url: string
}

export const PanelIframeUI = observer(function Panel_Iframe_(p: PanelIframeProps) {
    // return (
    //     <iframe
    //         src='...'
    //         className='w-full h-full'
    //         frameBorder='0'
    //         sandbox='allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals allow-popups-to-escape-sandbox'
    //         allow='accelerometer; camera; encrypted-media; fullscreen; gyroscope; magnetometer; microphone; midi; payment; vr; xr-spatial-tracking'
    //     ></iframe>
    // )
    return (
        <iframe //
            className='w-full h-full disable-x-frame-options'
            src={p.url}
            // frameBorder='0'
            // ⏸️ onLoad={() => {
            // ⏸️     console.log(`[🧐] 🍻 loaded`)
            // ⏸️ }}
        />
    )
})
