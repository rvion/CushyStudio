import { observerWC } from '../dropdown/observerWC'
import { Frame, type FrameProps } from '../frame/Frame'
import { PanelContentUI } from './PanelContentUI'
import { PanelHeaderUI } from './PanelHeaderUI'

export type PanelUIProps = FrameProps

export const PanelUI = observerWC(
   function Panel(p: FrameProps) {
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
   },
   {
      Header: PanelHeaderUI,
      Content: PanelContentUI,
   },
)
