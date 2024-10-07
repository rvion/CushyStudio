import { runInAction } from 'mobx'
import { type DependencyList, useMemo } from 'react'

export function useMemoAction<T>(factory: () => T, deps: DependencyList): T {
    return useMemo(() => runInAction(() => factory()), deps)
}
