import { type ForwardedRef, type RefObject, useEffect } from 'react'

/**
 * when parent forwards a ref but we need to have another ref on the same element
 * in the child component itself
 * the child ref is the source of truth, and we keep the parent ref in sync
 * (note: this hook could even include the useRef itself)
 */

export function useSyncForwardedRef(
   forwaredRef: Maybe<ForwardedRef<HTMLDivElement>>,
   localRef: RefObject<HTMLDivElement>,
) {
   useEffect(() => {
      if (forwaredRef == null) return
      if (typeof forwaredRef === 'function') forwaredRef(localRef.current)
      else forwaredRef.current = localRef.current
   }, [localRef.current])
}
