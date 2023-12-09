import type { TreeItem } from 'react-complex-tree'
import type { TreeApp } from './TreeApp'
import type { TreeDraft } from './TreeDraft'
import type { TreeError } from './TreeError'
import type { TreeFavorite } from './TreeFavorites'
import type { TreeFile } from './TreeFile'
import type { TreeFolder } from './TreeFolder'
import type { TreeRoot } from './TreeRoot'

import { ReactNode } from 'react'

// prettier-ignore
export type TreeEntry =
    | TreeFolder
    | TreeFile
    | TreeDraft
    | TreeApp
    | TreeRoot
    | TreeFavorite
    | TreeError

export type TreeEntryAction = {
    name: string
    mode: 'small' | 'full'
    icon: string
    onClick: () => void
}

export interface ITreeEntry {
    name: string
    icon?: Maybe<string | ReactNode>
    iconExpanded?: Maybe<string | ReactNode>
    entry: Promise<TreeItem<TreeEntry>>
    onSelect?: () => void
    actions?: TreeEntryAction[]
}
