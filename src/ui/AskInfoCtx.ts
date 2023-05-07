import React from 'react'
import { AskState } from './AskState'

export const askContext = React.createContext<AskState | null>(null)

export const useAsk = (): AskState => {
    const st = React.useContext(askContext)
    if (st == null) throw new Error('stContext not provided')
    return st
}
