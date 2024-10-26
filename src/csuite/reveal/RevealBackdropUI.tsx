import type { RevealState } from './RevealState'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { useRef } from 'react'

export const RevealBackdropUI = observer(function RevealBackdropUI_({
   reveal,
   children,
}: {
   reveal: RevealState
   children?: ReactNode
}) {
   const isClickInsideBackdrop = useRef(false)

   return (
      <div // backdrop (full-screen)
         onClick={(ev) => {
            if (isClickInsideBackdrop.current) return reveal.onBackdropClick(ev)

            // the event bubbles up to the anchor due to React context propagation
            // and it doesn't really make sense to have a click on the anchor
            // when we click anywhere on the backdrop
            ev.stopPropagation()
         }}
         /**
          * 2024-10-14 domi: make sure that a click starting inside the shell
          * and ending in the backdrop will not close the reveal.
          */
         onMouseDown={(ev) => {
            const isInside =
               ev.target instanceof HTMLDivElement && //
               ev.target.className.includes('_BackdropForClickEvents')
            isClickInsideBackdrop.current = isInside
         }}
         onMouseUp={(ev) => {
            const isInside =
               ev.target instanceof HTMLDivElement && //
               ev.target.className.includes('_BackdropForClickEvents')
            isClickInsideBackdrop.current = isInside && isClickInsideBackdrop.current
         }}
         style={{ zIndex: 99999999 }}
         tw={'pointer-events-auto absolute inset-0 z-50 flex items-center justify-center'}
      >
         {reveal.showBackdrop && (
            <div // backdrop shadow (child div to avoid animation interference)
               style={{ backgroundColor: reveal.backdropColor }}
               tw='animate-in fade-in _BackdropForClickEvents absolute inset-0'
            />
         )}
         <div tw='absolute inset-0 overflow-auto'>{children}</div>
      </div>
   )
})
