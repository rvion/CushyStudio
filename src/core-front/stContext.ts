import React from 'react'
import { FrontState } from './FrontState'

export const stContext = React.createContext<FrontState | null>(null)

export const useSt = () => {
    const st = React.useContext(stContext)
    if (st == null) throw new Error('stContext not provided')
    return st
}
