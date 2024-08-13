import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { FrameSubtle } from '../../csuite/wrappers/FrameSubtle'

export const WidgetSingleLineSummaryUI = observer(function WidgetSingleLineSummaryUI_(p: { children?: ReactNode }) {
    return <FrameSubtle className='COLLAPSE-PASSTHROUGH ml-1 lh-input line-clamp-1 italic'>{p.children}</FrameSubtle>
})
