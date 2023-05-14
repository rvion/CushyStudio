import React from 'react'
import { FormState } from './AskState'

export const askContext = React.createContext<FormState | null>(null)

export const useAsk = (): FormState => {
    const st = React.useContext(askContext)
    if (st == null) throw new Error('stContext not provided')
    return st
}
