import type { DependencyList } from 'react'

import { useEffect, useState } from 'react'

/** wrap a promise into a hook */
export const usePromise = <T>(
   //
   promise?: () => Maybe<Promise<T>>,
   deps?: DependencyList,
   opts?: { refreshEvery?: number },
): {
   value: T | null
   error: Error | null
} => {
   const [value, setValue] = useState<T | null>(null)
   const [error, setError] = useState<Error | null>(null)
   useEffect(() => {
      promise?.()?.then(setValue).catch(setError)
      if (opts?.refreshEvery) {
         const interval = setInterval(() => {
            promise?.()?.then(setValue).catch(setError)
         }, opts.refreshEvery)
         return (): void => clearInterval(interval)
      }
   }, deps)
   return { value, error }
}
