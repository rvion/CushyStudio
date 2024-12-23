import useResizeObserver from '@react-hook/resize-observer'
import { useLayoutEffect, useState } from 'react'

export const useSize = (target: React.RefObject<HTMLDivElement>): Maybe<DOMRect> => {
   const [size, setSize] = useState<DOMRect>()

   useLayoutEffect(() => {
      if (target.current == null) return
      const x = target.current.getBoundingClientRect()
      setSize(x)
   }, [target])

   // Where the magic happens
   useResizeObserver(target, (entry) => setSize(entry.contentRect))
   return size
}
