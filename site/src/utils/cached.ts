import { observable, runInAction } from 'mobx'

export const cached = <T>(key: string, fn: () => T): (() => T) => {
    return () => cache(key, fn)
}

export const cache = <T>(key: string, fn: () => T): T => {
    const global = window as any
    if (global[key]) return global[key]
    const val = fn()
    global[key] = val
    return val
}

export const cachedPromise = <T>(key: string, fn: () => Promise<T>): (() => { current: T | null }) => {
    return () => cachePromise(key, fn)
}

export const cachePromise = <T>(key: string, fn: () => Promise<T>): { current: T | null } => {
    const global = window as any
    if (global[key]) return global[key]
    const val = fn()
    const ref = observable({ current: null })
    global[key] = ref
    val.then((v) => runInAction(() => (ref.current = v)))
    return ref
}
