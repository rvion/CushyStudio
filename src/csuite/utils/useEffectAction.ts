import { runInAction } from 'mobx'
import { type DependencyList, useEffect } from 'react'

export function useEffectAction(effect: () => void | (() => void), deps: DependencyList): void {
   useEffect(() => runInAction(() => effect()), deps)
}
