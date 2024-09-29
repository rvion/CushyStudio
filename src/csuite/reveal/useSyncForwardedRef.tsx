import { type ForwardedRef, type RefObject, useEffect } from 'react'

/**
 * when parent forwards a ref but we need to have another ref on the same element
 * in the child component itself
 * the child ref is the source of truth, and we keep the parent ref in sync
 * (note: this hook could even include the useRef itself)
 */

export function useSyncForwardedRef(
    //
    forwaredRef: Maybe<ForwardedRef<HTMLDivElement>>,
    localRef: RefObject<HTMLDivElement>,
): void {
    useEffect(() => {
        if (forwaredRef == null) return
        if (typeof forwaredRef === 'function') forwaredRef(localRef.current)
        else forwaredRef.current = localRef.current
        // 💬 2024-09-28 rvion:
        // | surprisingly, ref is forwarded a bit late;
        // | TODO: investigate sometime later
        // | console.log(`[🤠] REF HAVE BEEN FORWARDED`)
    }, [localRef.current])
}
