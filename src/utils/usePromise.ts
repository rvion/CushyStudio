import type { Maybe } from './ComfyUtils'

import { useState, useEffect } from 'react'

/** wrap a promise into a hook */
export const usePromise = <T>(promise?: Maybe<Promise<T>>) => {
    const [value, setValue] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)
    useEffect(() => {
        promise?.then(setValue).catch(setError)
    }, [promise])
    return { value, error }
}
