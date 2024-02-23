import type { TreeView } from './TreeView'

import { createContext, useContext } from 'react'

export const TreeViewCtx = createContext<TreeView | null>(null)
export const useTreeView = (): TreeView => {
    const val = useContext(TreeViewCtx)
    if (val == null) throw new Error('missing editor in current widget react contexts')
    return val
}
