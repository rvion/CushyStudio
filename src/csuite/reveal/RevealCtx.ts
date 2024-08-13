import type { RevealStateLazy } from './RevealStateLazy'

import { createContext, useContext } from 'react'

export type RevealStack = {
    tower: RevealStateLazy[]
}

export const RevealCtx = createContext<RevealStack | null>(null)

/** use this to get the current reveal stack, or null if none yet */
export const useRevealOrNull = (): Maybe<RevealStack> => {
    const val = useContext(RevealCtx)
    return val
}
