import { DependencyList, useMemo } from 'react'
import { ManualPromise } from '../utils/ManualPromise'

export const usePromise = (fn: () => Promise<any>, deps: DependencyList) => {
    return useMemo(() => {
        const p = new ManualPromise()
        fn().then(p.resolve).catch(p.reject)
        return p
    }, deps)
}
