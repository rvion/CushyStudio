import type { RevealStateLazy } from './RevealStateLazy'

import { useEffectAction } from '../utils/useEffectAction'

export const globalRevealStack: RevealStateLazy[] = []

// type T2 = RevealState

export const useEffectToRegisterInGlobalRevealStack = (rs: RevealStateLazy): void => {
   useEffectAction(() => {
      globalRevealStack.push(rs)
      return (): void => {
         globalRevealStack.splice(globalRevealStack.indexOf(rs), 1)
      }
   }, [])
}

export const getLastGlobalRevealStack = (): RevealStateLazy | undefined => {
   return globalRevealStack[globalRevealStack.length - 1]
}
