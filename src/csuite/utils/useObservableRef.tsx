import { observable } from 'mobx'
import { DependencyList, type RefObject, useMemo } from 'react'

export const useObservableRef = <T extends any>(
    //
    value: Maybe<T> = null,
    deps: DependencyList = [],
): RefObject<T> => {
    return useMemo<RefObject<T>>(() => {
        return observable({ current: value }, { current: observable.ref })
    }, deps)
}