import type { BoxUIProps } from '../box/BoxUIProps'

import { observer } from 'mobx-react-lite'

import { FrameSubtle } from '../../csuite/wrappers/FrameSubtle'

export type WidgetSingleLineSummaryProps = BoxUIProps

export const WidgetSingleLineSummaryUI = observer(function WidgetSingleLineSummaryUI_(
   p: WidgetSingleLineSummaryProps,
) {
   // return (
   //     <>
   //         🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢 🟢
   //         🟢 🟢 🟢
   //     </>
   // )
   return (
      <FrameSubtle //
         tw='COLLAPSE-PASSTHROUGH lh-input ml-1 line-clamp-1 overflow-hidden italic'
         {...p}
      />
   )
})
