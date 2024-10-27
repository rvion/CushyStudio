import { runInAction } from 'mobx'
import { type DependencyList, useMemo } from 'react'

const noDeps: DependencyList = []
export function useMemoAction<T>(factory: () => T, deps: DependencyList = noDeps): T {
   return useMemo(() => runInAction(() => factory()), deps)
}
