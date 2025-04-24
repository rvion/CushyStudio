import type { CollapsibleProps } from './CollapsibleProps'

import { useMemo } from 'react'

import { Frame } from '../frame/Frame'
// import { AnimatedSizeUI } from '../smooth-size/AnimatedSizeUI'
import { CollapsibleState } from './CollapsibleState'

export const CollapsibleUI = obs(function CollapsibleUI_(p: CollapsibleProps) {
   const SELF = useMemo(() => new CollapsibleState(p), [])

   // 🔶 AnimatedSizeUI doesn't work with padding
   // (demo: <CollapsibleUI tw='pt-5' ... /> with encapsulating AnimatedSizeUI instead of div)
   return (
      <div tw={['flex cursor-pointer flex-col']} className={p.className} style={p.style}>
         {SELF.p.hideAnchorWhenExpanded && SELF.isExpanded ? null : (
            <div tw='flex select-none' onClick={(ev) => SELF.toggle()}>
               {p.children ?? (
                  <Frame
                     tw='flex'
                     look='link'
                     icon={SELF.isCollapsed ? IKONS.mdiChevronRight : IKONS.mdiChevronDown}
                  >
                     {SELF.isCollapsed
                        ? (p.titleCollapsed ?? 'Voir plus')
                        : (p.titleExpanded ?? 'Voir moins')}
                  </Frame>
               )}
            </div>
         )}
         {SELF.isExpanded && p.content(SELF)}
      </div>
   )
})
