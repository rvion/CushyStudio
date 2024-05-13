import type { TreeNode } from './xxx/TreeNode'
import type { ReactNode } from 'react'

export type TreeItemID = string

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
    ctor: { new (p: P): ITreeEntry } | ((p: P) => ITreeEntry)
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
