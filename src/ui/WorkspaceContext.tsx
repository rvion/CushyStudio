import { createContext, useContext } from 'react'
import { ServerState } from '../back/ServerState'

export const workspaceContext = createContext<ServerState | null>(null)

export const useWorkspace = () => {
    const st = useContext(workspaceContext)
    if (st == null) throw new Error('no st in context')
    return st
}
