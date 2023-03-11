import { createContext, useContext } from 'react'
import { ComfyClient } from '../core/ComfyClient'

export const stContext = createContext<ComfyClient | null>(null)

export const useSt = () => {
    const st = useContext(stContext)
    if (st == null) throw new Error('no st in context')
    return st
}
export const useProject = () => {
    const st = useContext(stContext)
    if (st == null) throw new Error('no st in context')
    return st.project
}
