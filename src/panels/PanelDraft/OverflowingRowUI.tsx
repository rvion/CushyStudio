import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { useObservableRef } from '../../csuite/utils/useObservableRef'

type TabContent = ReactNode

export type TabBarProps = {
   children: TabContent[]
   className?: string
} & FrameProps

export const OverflowingRowUI = observer(function OverflowingRow({
   //
   children,
   className,
   ...rest
}: TabBarProps): ReactNode {
   const containerRef = useRef<HTMLDivElement>(null)
   const [extraIndex, setExtraIndex] = useState(0)
   const tabRefs = useRef<(HTMLDivElement | null)[]>([])
   const caretRef = useObservableRef<HTMLDivElement>(null)

   const handleReveal = (): void => {
      if (!containerRef.current) return console.log(`[🤠] ❌ no containerRef`)
      if (!caretRef.current) return console.log(`[🤠] ❌ no caretRef`)
      const containerRect = containerRef.current.getBoundingClientRect()
      const caretRect = caretRef.current.getBoundingClientRect()
      const adjustedContainerRight = containerRect.right - caretRect.width
      let index = -1
      for (const tabRef of tabRefs.current) {
         index++
         if (tabRef) {
            const tabRect = tabRef.getBoundingClientRect()
            if (tabRect.right > adjustedContainerRight) {
               setExtraIndex(index)
               return
            }
         }
      }
      setExtraIndex(children.length)
   }

   // ensure computation once caretRef is available
   useLayoutEffect(() => {
      if (caretRef.current == null) return
      handleReveal()
   }, [caretRef.current])

   // Observe changes in container and caret sizes
   useEffect(() => {
      const elements = [containerRef.current, caretRef.current].filter(Boolean) as HTMLElement[]
      if (elements.length === 0) return
      const observer = new ResizeObserver(() => {
         handleReveal()
      })
      elements.forEach((el) => observer.observe(el))
      return (): void => {
         observer.disconnect()
      }
   }, [containerRef.current, caretRef.current])

   const hiddenCount = children.length - extraIndex
   return (
      <Frame //
         ref={containerRef}
         tw='relative flex'
         className={className}
         {...rest}
         style={{ overflow: 'hidden', position: 'relative' }}
      >
         {children.map((tab, index) => (
            <div key={index} ref={(el) => void (tabRefs.current[index] = el)} style={{ flexShrink: 0 }}>
               {tab}
            </div>
         ))}
         <RevealUI
            sharedAnchorRef={caretRef}
            content={() => (
               <div>
                  <div>
                     {extraIndex}...{children.length}
                  </div>
                  {children.slice(extraIndex).map((tab, index) => (
                     <div key={index}>{tab}</div>
                  ))}
               </div>
            )}
         >
            <Frame
               tw={[
                  //
                  'absolute right-0 px-2',
               ]}
               className='caret'
               ref={caretRef}
               style={{ cursor: 'pointer', flexShrink: 0 }}
               onClick={handleReveal}
            >
               {hiddenCount > 0 ? <div>▼ +{hiddenCount}</div> : <div></div>}
               {/* ▼ {hiddenCount > 0 ? `+${hiddenCount}` : null} */}
            </Frame>
         </RevealUI>
      </Frame>
   )
})

export default OverflowingRowUI
