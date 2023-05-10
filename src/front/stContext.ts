import type { FrontState } from './FrontState'

import React from 'react'

export const stContext = React.createContext<FrontState | null>(null)

export const useSt = (): FrontState => {
    const st = React.useContext(stContext)
    if (st == null) throw new Error('stContext not provided')
    return st
}
