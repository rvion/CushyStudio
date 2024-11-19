import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'
import { DebugHoveredRegionUI } from './DebugHoveredRegionUI'
import { DebugInputHistoryUI } from './DebugInputHistoryUI'

export const DebugControlsUI = observer(function DebugControlsUI_(p: {}) {
   return (
      <Frame tw='line-clamp-1 flex flex-col !items-start !justify-start gap-1 truncate !text-left'>
         <DebugHoveredRegionUI />
         <DebugInputHistoryUI />
      </Frame>
   )
})
