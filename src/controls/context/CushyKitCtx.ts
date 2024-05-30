import type { CushyKit } from './CushyKit'

import { createContext, useContext } from 'react'

export const CushyKitCtx = createContext<CushyKit | null>(null)

export const useCushyKit = (): CushyKit => {
    const val = useContext(CushyKitCtx)
    if (val == null) throw new Error('missing CushyKit in current context')
    return val
}

export const useCushyKitOrNull = (): Maybe<CushyKit> => {
    return useContext(CushyKitCtx)
}
