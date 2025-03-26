import { Frame, type FrameProps } from '../frame/Frame'
import { PanelHeaderUI } from './PanelHeaderUI'

export type PanelUIProps = FrameProps

const _PanelUI = obs(function Panel(p: FrameProps) {
   return (
      <Frame
         // as of 2024-08-05, most panel are vertical
         // let's have that
         col
         expand
         tw='h-full overflow-auto'
         {...p}
      />
   )
})

export const PanelContentUI = obs(function PanelContent(p: React.HTMLAttributes<HTMLDivElement>) {
   return <div tw='flex flex-1 overflow-auto p-2' {...p} />
})

export const PanelUI = Object.assign(_PanelUI, {
   Header: PanelHeaderUI,
   Content: PanelContentUI,
})
