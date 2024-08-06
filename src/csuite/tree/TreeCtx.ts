import type { TreeView } from './TreeView'

import { createContext, useContext } from 'react'

import { CommandContext } from '../commands/Command'
import { regionMonitor } from '../regions/RegionMonitor'
import { Trigger } from '../trigger/Trigger'

export const TreeViewCtx = createContext<TreeView | null>(null)

export const useTreeView = (): TreeView => {
    const val = useContext(TreeViewCtx)
    if (val == null) throw new Error('missing editor in current widget react contexts')
    return val
}

export const ctx_TreeUI = new CommandContext<TreeView>(
    //
    'TreeUI',
    () => regionMonitor.isOver(TreeViewCtx) ?? Trigger.UNMATCHED,
)
