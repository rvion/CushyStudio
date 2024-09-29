import type { RevealState } from './RevealState'
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

export const useTopReveal = (): Maybe<RevealState> => {
    const val = useRevealOrNull()
    if (val == null) return null
    const last = val.tower[val.tower.length - 1]
    if (last == null) return null
    return last.getRevealState()
}
