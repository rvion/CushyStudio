import { observable } from 'mobx'
import { DependencyList, useMemo } from 'react'

import { ManualPromise } from '../csuite/utils/ManualPromise'

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export const usePromise = <T>(
    //
    fn: () => Promise<T>,
    deps: DependencyList = [],
): ManualPromise<UnwrapPromise<T>> => {
    return useMemo(() => {
        const p = new ManualPromise()
        fn().then(p.resolve).catch(p.reject)
        return p
    }, deps)
}

// 🔴 meh abstraction; should live inside the manualPromise instead
export const useAsyncAction = (fn: () => Maybe<Promise<any>>, deps: DependencyList) => {
    return useMemo(() => {
        const p = new ManualPromise()
        const uist = observable({
            p,
            isRunning: false,
            startedOnce: false,
            start: () => {
                if (uist.isRunning) return
                uist.startedOnce = true
                uist.isRunning = true
                fn()
                    ?.then((v) => p.resolve(v))
                    .catch((e) => p.reject(e))
                uist.isRunning = false
            },
        })
        return uist
    }, deps)
}
