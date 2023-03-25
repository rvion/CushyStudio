import { createContext, useContext } from 'react'
import { CSClient } from '../core/CSClient'

export const stContext = createContext<CSClient | null>(null)

export const useSt = () => {
    const st = useContext(stContext)
    if (st == null) throw new Error('no st in context')
    return st
}
export const useProject = () => {
    const st = useContext(stContext)
    if (st == null) throw new Error('no st in context')
    return st.script
}
