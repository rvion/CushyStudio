import type { TreeApp } from './nodes/TreeApp'
import type { TreeDraft } from './nodes/TreeDraft'
import type { TreeError } from './nodes/TreeError'
import type { TreeFavorite } from './nodes/TreeFavorites'
import type { TreeFile } from './nodes/TreeFile'
import type { TreeFolder } from './nodes/TreeFolder'
// import type { TreeRoot } from './nodes/TreeRoot'

import type { ReactNode } from 'react'
import type { TreeNode } from './xxx/TreeNode'

export type TreeItemID = string

// prettier-ignore
export type TreeEntry =
    | TreeFolder
    | TreeFile
    | TreeDraft
    | TreeApp
    // | TreeRoot
    | TreeFavorite
    | TreeError

export type TreeEntryAction = {
    name: string
    mode: 'small' | 'full'
    icon: string
    onClick: (node: TreeNode) => void
    className?: string
}

// index: TreeItemIndex;
// children?: Array<TreeItemIndex>;
// isFolder?: boolean;
// canMove?: boolean;
// canRename?: boolean;
// data: T;

export interface ITreeEntry {
    id: string
    children?: () => string[]
    //
    name: string
    icon?: Maybe<string | ReactNode>
    iconExpanded?: Maybe<string | ReactNode>
    //
    isOpened?: boolean

    // entry: Promise<TreeItem<TreeEntry>>
    onPrimaryAction?: (n: TreeNode) => void
    onFocusItem?: (n: TreeNode) => void
    onExpand?: (n: TreeNode) => void

    actions?: TreeEntryAction[]
    extra?: () => ReactNode
}
