import type { Tree } from './Tree'
import type { TreeNode, TreeScrollOptions } from './TreeNode'
import type { KeyEv } from './TreeShortcuts'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { createRef } from 'react'

import { Trigger } from '../trigger/Trigger'
import { onKeyDownHandlers } from './TreeShortcuts'

export class TreeView {
   /** treeview id; only for debugging purpose */
   id: string = nanoid(4)

   constructor(
      public tree: Tree,
      public conf: {
         /** focus is when you use arrow to navigate, or mouse to click on entries.  */
         onFocusChange?: (node: TreeNode | undefined) => void
         onSelectionChange?: (
            /** node that have just been selected  */
            newlySelectedNode: TreeNode[],
            /** node that have just been UN-selected  */
            newlyUnselectedNode: TreeNode[],
            /** all remaining selected node  */
            allSelectedNodes: TreeNode[],
         ) => void
         selectable?: boolean
      } = {},
   ) {
      // this.resetCaretPos()
      makeAutoObservable(this, { filterRef: false, id: false })
   }

   /**
    * @deprecated
    * UNUSED / BROKEN
    */
   filterRef = createRef<HTMLInputElement>()

   /**
    * @deprecated
    * UNUSED / BROKEN
    */

   filter: string | undefined

   /**
    * @deprecated
    * UNUSED / BROKEN
    */

   updateFilter = (xPath: string): void => {
      this.filter = xPath
   }

   /**
    * @deprecated
    * UNUSED / BROKEN
    */

   focusFilter = (): void => {
      const curr = this.filterRef.current
      if (!(curr instanceof HTMLElement)) return
      curr.focus()
   }

   get nodes(): TreeNode[] {
      return this.tree.topLevelNodes
   }

   revealAndFocusAtPath = (path_v2: string[]): Maybe<TreeNode> => {
      const [k, ...rest] = path_v2

      // root
      let at: TreeNode | undefined = this.tree.topLevelNodes.find((i) => i.elem.key === k)
      if (at == null) {
         console.log(`[❌] no top level node matching first key "${k}"`)
         return
      }
      at.open()

      for (const x of rest) {
         // childs
         const children: TreeNode[] = at.children
         at = children.find((i) => i.elem.key === x)
         if (at == null) {
            console.log(
               `[❌] no child node matching key "${x}" (available: ${children.map((i) => i.elem.key).join(', ')})`,
            )
            return
         }
         at.open()
      }

      this.setFocusAt(at, { block: 'nearest' })
      return at
   }

   // cursor
   at: TreeNode | undefined

   get cursorInfos(): Maybe<{
      nodeAboveInTreeview: string | undefined
      nodeBelowInTreeview: string | undefined
      lastDescendant: string | undefined
      lastChild: string | undefined
      descendant_bfs: string[]
      descendant_dfs: string[]
      depth: number
      parent: string | undefined
      pathStr: string
      siblingsIncludingSelf: string[]
      siblingsExcludingSelf: string[]
      nextSibling: string | undefined
      prevSibling: string | undefined
      firstChild: string | undefined
   }> {
      const at = this.at
      if (at == null) return null
      return {
         nodeAboveInTreeview: at.nodeAboveInView?.id,
         nodeBelowInTreeview: at.nodeBelowInView?.id,
         lastDescendant: at.lastDescendant?.id,
         lastChild: at.lastChild?.id,
         descendant_bfs: at.descendantBFS.map((i) => i.id),
         descendant_dfs: at.descendantDFS.map((i) => i.id),
         depth: at.depth,
         parent: at.parent?.id,
         pathStr: at.id,
         siblingsIncludingSelf: at.siblingsIncludingSelf.map((i) => i.id),
         siblingsExcludingSelf: at.siblingsExcludingSelf.map((i) => i.id),
         nextSibling: at.nextSibling?.id,
         prevSibling: at.prevSibling?.id,
         firstChild: at.firstChild?.id,
      }
   }
   setFocusAt = (at: TreeNode | undefined, p?: TreeScrollOptions): Trigger => {
      this.at = at
      this.at?.scrollIntoView(p)
      this.conf.onFocusChange?.(at)
      return Trigger.Success
   }

   onKeyDown = (ev: KeyEv): void => {
      const handler = this.onKeyDownHandlers(ev)
      if (handler) {
         ev.stopPropagation()
         ev.preventDefault()
         return handler()
      }

      console.log('key-pressed:', ev.key)
   }

   private onKeyDownHandlers = (ev: KeyEv): Maybe<() => void> => {
      return onKeyDownHandlers(ev, this)
   }

   deleteNodeAndFocusNodeAbove = (): Trigger => {
      if (this.at == null) return this.resetCaretPos()
      const parent = this.at.nodeAboveInView
      this.at.delete()
      this.setFocusAt(parent)
      return Trigger.Success
   }

   deleteNodeAndFocusNodeBelow = (): Trigger => {
      if (this.at == null) return this.resetCaretPos()
      /** node below may be deleted, so we first store the node above
       * then after the deletion, retrieve the node below */
      const parent = this.at.nodeAboveInView
      this.at.delete()
      this.setFocusAt(parent?.nodeBelowInView ?? parent)
      return Trigger.Success
   }

   resetCaretPos = (): Trigger => {
      this.setFocusAt(this.tree.topLevelNodes[0])
      return Trigger.Success
   }

   moveUp = (): Trigger => {
      if (this.at == null) return this.resetCaretPos()
      const nextAt = this.at.nodeAboveInView
      if (nextAt) return this.setFocusAt(nextAt)
      else return Trigger.UNMATCHED
   }

   movePageUp = (): Trigger => {
      return this.resetCaretPos()
   }

   movePageDown = (): Trigger => {
      if (this.at == null) return this.resetCaretPos()
      let ptr: Maybe<TreeNode> = this.at
      let max = 100
      let final: TreeNode = this.at
      while ((ptr = ptr.nodeBelowInView) && max-- > 0) {
         final = ptr
      }
      this.setFocusAt(final)
      return Trigger.Success // 🔶 should return UNMATCHED if last item is already selected
   }

   moveDown = (): Trigger => {
      if (this.at == null) return this.resetCaretPos()
      const nextAt = this.at.nodeBelowInView
      if (nextAt) {
         this.setFocusAt(nextAt)
         return Trigger.Success
      } else {
         return Trigger.UNMATCHED
      }
   }

   moveRight = (): Trigger => {
      if (this.at == null) return this.resetCaretPos()
      const children = this.at.children
      if (children.length > 0) {
         if (this.at.isOpen) return this.setFocusAt(children[0])
         else return this.at.open()
      }
      return this.moveDown()
   }

   moveLeft = (): Trigger => {
      if (this.at == null) return this.resetCaretPos()
      if (this.at.isOpen) return this.at.close()
      if (this.at.parent) {
         this.at = this.at.parent
         return Trigger.Success
      }
      return Trigger.UNMATCHED
   }
}
