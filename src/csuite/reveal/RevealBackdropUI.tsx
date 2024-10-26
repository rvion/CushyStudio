import type { RevealState } from './RevealState'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const RevealBackdropUI = observer(function RevealBackdropUI_({
   reveal,
   children,
}: {
   reveal: RevealState
   children?: ReactNode
}) {
   return (
      <div // backdrop (full-screen)
         onClick={(ev) => reveal.onBackdropClick(ev)}
         style={{ zIndex: 99999999 }}
         tw={'pointer-events-auto absolute inset-0 z-50 flex items-center justify-center'}
      >
         {reveal.showBackdrop && (
            <div // backdrop shadow (child div to avoid animation interference)
               style={{ backgroundColor: reveal.backdropColor }}
               tw='animate-in fade-in absolute inset-0'
            />
         )}
         <div tw='absolute inset-0 overflow-auto'>{children}</div>
      </div>
   )
})
