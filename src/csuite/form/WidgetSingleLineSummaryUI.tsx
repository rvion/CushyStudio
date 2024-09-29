import type { BoxUIProps } from '../box/BoxUIProps'

import { observer } from 'mobx-react-lite'

import { FrameSubtle } from '../../csuite/wrappers/FrameSubtle'

export type WidgetSingleLineSummaryProps = BoxUIProps
export const WidgetSingleLineSummaryUI = observer(function WidgetSingleLineSummaryUI_(p: WidgetSingleLineSummaryProps) {
    return (
        <FrameSubtle //
            tw='COLLAPSE-PASSTHROUGH ml-1 lh-input line-clamp-1 italic'
            {...p}
        />
    )
})
