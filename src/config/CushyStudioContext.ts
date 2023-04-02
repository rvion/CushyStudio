import { createContext, useContext } from 'react'
import { CushyStudio } from './CushyStudio'

export const CSContext = createContext<CushyStudio | null>(null)

export const useCushyStudio = () => {
    const st = useContext(CSContext)
    if (st == null) throw new Error('no st in context')
    return st
}
