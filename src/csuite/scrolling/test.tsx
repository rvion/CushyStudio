/* Horizontal scrolling container pseudocode
 ** - Should show an indicator (optional, enabled by default)
 ** - Scrolling should scroll horizontally by default
 ** - Smooth-scrolling support? Is it possible to see if this is enabled via the browser so we can do it consistently?
 ** - Let's do it~
 */

import { observer } from 'mobx-react-lite'
import { type ReactNode, useEffect, useRef, useState } from 'react'

export const HorizontalScrollingUI = observer(function HorizontalScrollingUI_(p: {
   children?: ReactNode
}): JSX.Element {
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

   const theme = cushy.preferences.theme.value

   return (
      <div ref={containerRef} tw='relative flex overflow-hidden'>
         {showIndicators && showLeft && (
            <UY.Misc.Frame
               base={{ contrast: 0.1 }}
               tw='pointer-events-none absolute left-0 flex h-full w-5 select-none items-center justify-center'
               icon='mdiChevronDoubleLeft'
               border={theme.global.border}
               roundness={theme.global.roundness}
            />
         )}
         <div // Scroll Handler
            ref={scrollRef}
            tw='flex flex-row overflow-hidden whitespace-nowrap'
            onWheel={(ev) => {
               if (scrollRef.current) {
                  //   scrollRef.current.scrollBy({ behavior: 'smooth', left: ev.deltaY })
                  scrollRef.current.scrollLeft += ev.deltaY
                  setShowRight(
                     Math.ceil(scrollRef.current.scrollLeft) !=
                        scrollRef.current.scrollWidth - scrollRef.current.clientWidth,
                  )
                  setShowLeft(Math.ceil(scrollRef.current.scrollLeft) != 0)
                  console.log(
                     '[FD] - ',
                     ev.deltaY,
                     Math.ceil(scrollRef.current.scrollLeft),
                     scrollRef.current.scrollWidth - scrollRef.current.clientWidth,
                  )
               }
            }}
         >
            {p.children}
         </div>
         {showIndicators && showRight && (
            <UY.Misc.Frame
               base={{ contrast: 0.1 }}
               tw={['pointer-events-none absolute right-0 z-50 flex h-full w-5 items-center justify-center']}
               icon='mdiChevronDoubleRight'
               border={theme.global.border}
               roundness={theme.global.roundness}
            />
         )}
      </div>
   )
})
