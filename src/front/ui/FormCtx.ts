import React from 'react'
import { FormState } from './FormState'

export const formContext = React.createContext<FormState | null>(null)

export const useForm = (): FormState => {
    const st = React.useContext(formContext)
    if (st == null) throw new Error('stContext not provided')
    return st
}
