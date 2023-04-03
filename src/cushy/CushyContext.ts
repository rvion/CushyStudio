import { createContext, useContext } from 'react'
import { Cushy } from './Cushy'

export const CSContext = createContext<Cushy | null>(null)

export const useCushyStudio = () => {
    const st = useContext(CSContext)
    if (st == null) throw new Error('no st in context')
    return st
}
