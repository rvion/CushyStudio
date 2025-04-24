import type { BoxUIProps } from '../box/BoxUIProps'

import { FrameSubtle } from '../../csuite/wrappers/FrameSubtle'

export type WidgetSingleLineSummaryProps = BoxUIProps<HTMLDivElement>

export const WidgetSingleLineSummaryUI = obs(function WidgetSingleLineSummaryUI_(
   p: WidgetSingleLineSummaryProps,
) {
   return (
      <FrameSubtle //
         tw='COLLAPSE-PASSTHROUGH lh-input ml-1 line-clamp-1 overflow-hidden italic'
         {...p}
      />
   )
})
