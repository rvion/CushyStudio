/* Horizontal scrolling container pseudocode
 ** - Should show an indicator. Done
        - (optional, enabled by default)
 ** - Scrolling should scroll horizontally by default. Done.
 ** - Smooth-scrolling support? Is it possible to see if this is enabled via the browser so we can do it consistently? Would need to handle accumulation and animation seperately? Seems not good.
 ** - Let's do it~
 */

import React, { type ReactNode, useEffect, useRef, useState } from 'react'

export const HorizontalScrollingUI = obs(function HorizontalScrollingUI_(p: {
   children?: ReactNode
}): React.JSX.Element {
   const containerRef = useRef<HTMLDivElement>(null)
   const scrollRef = useRef<HTMLDivElement>(null)
   const [showIndicators, setShowIndicators] = useState<boolean>(false)
   const [showLeft, setShowLeft] = useState<boolean>(false)
   const [showRight, setShowRight] = useState<boolean>(false)

   useEffect((): (() => void) => {
      const observer = new ResizeObserver(() => {
         if (scrollRef.current) {
            setShowIndicators(scrollRef.current.scrollWidth > scrollRef.current.clientWidth)
            setShowRight(
               Math.ceil(scrollRef.current.scrollLeft) !=
                  scrollRef.current.scrollWidth - scrollRef.current.clientWidth,
            )
            setShowLeft(Math.ceil(scrollRef.current.scrollLeft) != 0)
         }
      })

      if (containerRef.current) observer.observe(containerRef.current)

      return (): void => observer.disconnect()
   }, [])

   const theme = cushy.preferences.theme.zValue

   return (
      <div ref={containerRef} tw='relative flex flex-1 shrink-0 flex-row overflow-hidden'>
         {showIndicators && showLeft && (
            <uy.misc.Frame
               base={{ contrast: 0.1 }}
               tw='pointer-events-none absolute left-0 flex h-full w-5 select-none items-center justify-center'
               icon={IKONS.mdiChevronDoubleLeft}
               border={theme.global.border}
               roundness={theme.global.roundness}
            />
         )}
         <div // Scroll Handler
            ref={scrollRef}
            tw='flex flex-1 shrink-0 flex-row overflow-hidden whitespace-nowrap'
            onWheel={(ev) => {
               if (scrollRef.current) {
                  //   scrollRef.current.scrollBy({ behavior: 'smooth', left: ev.deltaY })
                  scrollRef.current.scrollLeft += ev.deltaY
                  setShowRight(
                     Math.ceil(scrollRef.current.scrollLeft) <
                        scrollRef.current.scrollWidth - scrollRef.current.clientWidth,
                  )
                  setShowLeft(Math.ceil(scrollRef.current.scrollLeft) != 0)
               }
            }}
         >
            {p.children}
         </div>
         {showIndicators && showRight && (
            <uy.misc.Frame
               base={{ contrast: 0.1 }}
               tw={['pointer-events-none absolute right-0 z-50 flex h-full w-5 items-center justify-center']}
               icon={IKONS.mdiChevronDoubleRight}
               border={theme.global.border}
               roundness={theme.global.roundness}
            />
         )}
      </div>
   )
})
