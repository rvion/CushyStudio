import type { NO_PROPS } from '../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { Panel, type PanelHeader } from '../router/Panel'

export const PanelSquoosh = new Panel({
    name: 'Squoosh',
    widget: (): React.FC<NO_PROPS> => PanelSquooshUI,
    header: (p): PanelHeader => ({ title: 'Squoosh' }),
    def: (): NO_PROPS => ({}),
    category: 'tools',
    icon: 'mdiImageFilterVintage',
})

export const PanelSquooshUI = observer(function PanelSquooshUI_(p: NO_PROPS) {
    // return (
    //     <iframe
    //         src='https://squoosh.app/'
    //         className='w-full h-full'
    //         frameBorder='0'
    //         sandbox='allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals allow-popups-to-escape-sandbox'
    //         allow='accelerometer; camera; encrypted-media; fullscreen; gyroscope; magnetometer; microphone; midi; payment; vr; xr-spatial-tracking'
    //     ></iframe>
    // )
    return (
        <iframe //
            className='w-full h-full'
            frameBorder='0'
            src={'https://squoosh.app/'}
        />
    )
})
