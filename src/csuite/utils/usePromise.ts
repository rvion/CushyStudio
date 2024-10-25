import type { DependencyList } from 'react'

import { useEffect, useState } from 'react'

/** wrap a promise into a hook */
export const usePromise = <T>(
   //
   promise?: () => Maybe<Promise<T>>,
   deps?: DependencyList,
): {
   value: T | null
   error: Error | null
} => {
   const [value, setValue] = useState<T | null>(null)
   const [error, setError] = useState<Error | null>(null)
   useEffect(() => {
      promise?.()?.then(setValue).catch(setError)
   }, deps)
   return { value, error }
}
