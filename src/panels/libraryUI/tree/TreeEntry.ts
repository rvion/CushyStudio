import type { TreeApp } from './nodes/TreeApp'
import type { TreeDraft } from './nodes/TreeDraft'
import type { TreeError } from './nodes/TreeError'
import type { TreeFavoriteApps } from './nodes/TreeFavorites'
import type { TreeFile } from './nodes/TreeFile'
import type { TreeFolder } from './nodes/TreeFolder'
import type { TreeNode } from './xxx/TreeNode'
// import type { TreeRoot } from './nodes/TreeRoot'
import type { ReactNode } from 'react'
import type { STATE } from 'src/state/state'

export type TreeItemID = string

// prettier-ignore
export type TreeEntry =
    | TreeFolder
    | TreeFile
    | TreeDraft
    | TreeApp
    // | TreeRoot
    | TreeFavoriteApps
    | TreeError

export type TreeEntryAction = {
    name: string
    mode: 'small' | 'full'
    icon: string
    onClick: (node: TreeNode) => void
    className?: string
}

export const treeElement = <P>(e: ITreeElement<P>): ITreeElement<P> => e

export type ITreeElement<P = any> = {
    key: string
    ctor: { new (st: STATE, p: P): ITreeEntry } | ((st: STATE, p: P) => ITreeEntry)
    props: P
}

export interface ITreeEntry<P = any> {
    // id: string
    children?: () => ITreeElement[]
    //
    name: string
    icon?: Maybe<string | ReactNode>
    iconExpanded?: Maybe<string | ReactNode>
    //
    isOpened?: boolean

    /**
     * if implemented, will allow user to delete entry via backspace or delete
     * function must return true if deletion succeeded
     * function must return false if deletion fail
     */
    delete?: (n: TreeNode) => boolean

    // entry: Promise<TreeItem<TreeEntry>>
    onPrimaryAction?: (n: TreeNode) => void
    onFocusItem?: (n: TreeNode) => void
    onExpand?: (n: TreeNode) => void

    actions?: TreeEntryAction[]
    extra?: () => ReactNode
}
