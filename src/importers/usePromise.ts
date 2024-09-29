import { observable } from 'mobx'
import { DependencyList, useMemo } from 'react'

import { ManualPromise } from '../csuite/utils/ManualPromise'

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export const usePromise = <T>(
    //
    fn: () => T | Promise<T>,
    deps: DependencyList = [],
): ManualPromise<UnwrapPromise<T>> => {
    return useMemo(() => {
        // create manual promise
        const p = new ManualPromise()

        // start it (will complete sometime later)
        void (async (): Promise<void> => {
            try {
                const res = await fn()
                p.resolve(res)
            } catch (e) {
                p.reject(e)
            }
        })

        // return it synchronously (before it's done)
        return p
    }, deps)
}

// 🔴 meh abstraction; should live inside the manualPromise instead
export const useAsyncAction = <T>(
    fn: () => Maybe<Promise<T>>,
    deps: DependencyList,
): {
    p: ManualPromise<T>
    isRunning: boolean
    startedOnce: boolean
    start: () => void
} => {
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
