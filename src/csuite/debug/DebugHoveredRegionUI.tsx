import { observer } from 'mobx-react-lite'

import { regionMonitor } from '../regions/RegionMonitor'

export const DebugHoveredRegionUI = observer(function DebugHoveredRegionUI_(p: {}) {
   const rType = regionMonitor.hoveredRegion?.type ?? 'NO_REGION_CONTEXT_FIX_ME'
   const rID = regionMonitor.hoveredRegion?.id ?? '0'
   return (
      <div tw='flex flex-row'>
         {rType}
         <div tw='!opacity-70'>#{rID}</div>
      </div>
   )
})
