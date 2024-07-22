import type { DependencyList } from 'react'

import { useEffect, useState } from 'react'

let _timeout: Maybe<NodeJS.Timeout>

/**
 * quick hook to wait for props to stabilize for at least X milliseconds
 * 🔴 sligthly buggy; not properly updating when deps change
 */
export const useDelay = (
    /** miliseconds */
    delayMs: Maybe<number>, // null means no dealy
    deps: DependencyList,
): boolean => {
    const defVal =
        delayMs == null //
            ? false
            : delayMs === 0
            ? false
            : true

    const [delayed, setDelayed] = useState(defVal)

    useEffect(() => {
        if (_timeout != null) clearTimeout(_timeout)
        if (delayMs == null) return
        _timeout = setTimeout((): void => {
            // console.log('delayed')
            setDelayed(false)
        }, delayMs)

        return (): void => {
            setDelayed(defVal)
            if (_timeout != null) clearTimeout(_timeout)
        }
    }, deps)
    // if (delayMs == null) return true
    return delayed
}
