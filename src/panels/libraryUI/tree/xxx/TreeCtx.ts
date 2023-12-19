import { createContext, useContext } from 'react'
import type { TreeView } from './TreeView'

export const TreeViewCtx = createContext<TreeView | null>(null)
export const useTreeView = (): TreeView => {
    const val = useContext(TreeViewCtx)
    if (val == null) throw new Error('missing editor in current widget react contexts')
    return val
}
