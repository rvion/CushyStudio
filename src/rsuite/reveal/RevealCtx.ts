import type { RevealStateLazy } from './RevealState'

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

/** use this to get the current reveal stack, or throw if none yet */
export const useReveal = (): RevealStack => {
    const val = useContext(RevealCtx)
    if (val == null) throw new Error('missing editor in current widget react contexts')
    return val
}
