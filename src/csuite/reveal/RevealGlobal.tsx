import type { RevealStateLazy } from './RevealStateLazy'

import { useEffectAction } from '../utils/useEffectAction'

export const globalRevealStack: RevealStateLazy[] = []

export const useEffectToRegisterInGlobalRevealStack = (rs: RevealStateLazy): void => {
   useEffectAction(() => {
      globalRevealStack.push(rs)
      return (): void => removeFromGlobalRevealStack(rs)
   }, [])
}

export const getLastGlobalRevealStack = (): RevealStateLazy | undefined => {
   return globalRevealStack[globalRevealStack.length - 1]
}

export const removeFromGlobalRevealStack = (rs: RevealStateLazy): void => {
   const index = globalRevealStack.indexOf(rs)

   if (index >= 0) globalRevealStack.splice(globalRevealStack.indexOf(rs), 1)
}
