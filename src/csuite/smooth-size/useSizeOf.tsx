import { runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import { useCallback } from 'react'

import { bang } from '../utils/bang'

type RefFn = (e: HTMLDivElement | null) => void
type DynamicSize = {
   width: Maybe<number>
   height: Maybe<number>
   observer: ResizeObserver
}

export const useSizeOf = (): { ref: RefFn; size: DynamicSize } => {
   const size = useLocalObservable(
      (): DynamicSize => ({
         observer: new ResizeObserver((e, obs) => {
            const e0 = bang(e[0])
            runInAction(() => {
               const width = e0.contentRect.width
               const height = e0.contentRect.height
               size.width = width
               size.height = height
            })
         }),
         width: undefined as Maybe<number>,
         height: undefined as Maybe<number>,
      }),
   )
   const refFn = useCallback(
      (e: HTMLDivElement | null) => {
         if (e == null) return size.observer.disconnect()
         size.observer.observe(e)
      },
      [size],
   )

   return { ref: refFn, size }
}
