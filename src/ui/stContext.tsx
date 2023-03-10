import { createContext, useContext } from 'react'
import { ComfyManager } from '../core/ComfyManager'

export const stContext = createContext<ComfyManager | null>(null)

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
