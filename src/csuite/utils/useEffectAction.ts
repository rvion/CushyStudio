import type { DependencyList } from 'react'

import { runInAction } from 'mobx'
import { useEffect } from 'react'

export function useEffectAction(effect: () => void | (() => void), deps: DependencyList): void {
   useEffect(() => runInAction(() => effect()), deps)
}
