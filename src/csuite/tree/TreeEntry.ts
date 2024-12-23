import type { IconName } from '../icons/icons'
import type { TreeNode } from './TreeNode'
import type { ReactNode } from 'react'

export type TreeItemID = string

// LEVEL 1
// tree root are Tree Element (free structures; simple way to add laziness)
export const treeElement = <P>(e: ITreeElement<P>): ITreeElement<P> => e
export type ITreeElement<P = any> = {
   key: string
   ctor: { new (p: P): ITreeEntry } | ((p: P) => ITreeEntry)
   props: P
}

// LEVEL 2
// Tree Element => Tree Entry
// entries are lazilly loaded when needed
export interface ITreeEntry<P = any> {
   // id: string
   children?: () => ITreeElement[] // children are element themselves
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
export type TreeEntryAction = {
   name: string
   mode: 'small' | 'full'
   icon: IconName
   onClick: (node: TreeNode) => void
   className?: string
}
