import { observer } from 'mobx-react-lite'

import { Frame, type FrameProps } from '../frame/Frame'
import { PanelHeaderUI } from './PanelHeaderUI'

export type PanelUIProps = FrameProps

const _PanelUI = observer(function Panel(p: FrameProps) {
    return (
        <Frame
            // as of 2024-08-05, most panel are vertical
            // let's have that
            col
            expand
            tw='overflow-auto h-full'
            {...p}
        />
    )
})

export const PanelContentUI = observer(function PanelContent(p: React.HTMLAttributes<HTMLDivElement>) {
    return <div tw='flex flex-1 p-2 overflow-auto' {...p} />
})

export const PanelUI = Object.assign(_PanelUI, {
    Header: PanelHeaderUI,
    Content: PanelContentUI,
})
