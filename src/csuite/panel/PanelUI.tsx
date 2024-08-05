import { observer } from 'mobx-react-lite'

import { Frame, type FrameProps } from '../frame/Frame'
import { PanelHeaderUI } from './PanelHeaderUI'

const _PanelUI = observer(function PanelUI_(p: FrameProps) {
    return (
        <Frame
            // as of 2024-08-05, most panel are vertical
            // let's have that
            col
            expand
            tw='overflow-auto'
            {...p}
        />
    )
})

export const PanelUI = Object.assign(_PanelUI, {
    // name: 'BasicShelfUI',
    Header: PanelHeaderUI,
})
