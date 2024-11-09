import { observer } from 'mobx-react-lite'

import { commandManager } from '../commands/CommandManager'
import { Frame } from '../frame/Frame'
import { regionMonitor } from '../regions/RegionMonitor'

export const DebugControlsUI = observer(function DebugControlsUI_(p: {}) {
   const rType = regionMonitor.hoveredRegion?.type ?? 'NO_REGION_CONTEXT_FIX_ME'
   const rID = regionMonitor.hoveredRegion?.id ?? '0'
   return (
      <Frame //
         tw='line-clamp-1 flex flex-col !items-start !justify-start gap-1 truncate !text-left'
      >
         <div tw='flex flex-row'>
            {rType}
            <div tw='!opacity-70'>#{rID}</div>
         </div>
         <Frame //
            tw='flex gap-0.5'
         >
            {commandManager.inputHistory.slice(-3).map((text, _) => {
               return (
                  <Frame //
                     tw='px-2'
                     roundness={cushy.theme.value.inputRoundness}
                     base={{ contrast: -0.075 }}
                  >
                     {text}
                  </Frame>
               )
            })}
         </Frame>
      </Frame>
   )
})
