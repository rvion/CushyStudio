import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { createRef } from 'react'

import { Tree } from './Tree'
import { TreeNode, TreeScrollOptions } from './TreeNode'
import { KeyEv, onKeyDownHandlers } from './TreeShortcuts'

export class TreeView {
    id = nanoid(4)
    isFolded: boolean = false
    constructor(
        //
        public tree: Tree,
        public conf: { onSelectionChange?: (node: TreeNode | undefined) => void } = {},
    ) {
        this.resetCaretPos()
        makeAutoObservable(this, { filterRef: false, id: false })
    }

    filterRef = createRef<HTMLInputElement>()
    filter: string | undefined
    updateFilter = (xPath: string) => (this.filter = xPath)
    focusFilter = () => {
        const curr = this.filterRef.current
        if (!(curr instanceof HTMLElement)) return
        curr.focus()
    }

    get nodes() {
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
                console.log(`[❌] no child node matching key "${x}" (available: ${children.map((i) => i.elem.key).join(', ')})`)
                return
            }
            at.open()
        }

        this.setAt(at, { block: 'nearest' })
        return at
    }

    // cursor
    at: TreeNode | undefined

    get cursorInfos() {
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
    setAt = (at: TreeNode | undefined, p?: TreeScrollOptions) => {
        this.at = at
        this.at?.scrollIntoView(p)
        this.conf.onSelectionChange?.(at)
    }

    onKeyDown = (ev: KeyEv) => {
        const handler = this.onKeyDownHandlers(ev)
        if (handler) {
            ev.stopPropagation()
            ev.preventDefault()
            return handler()
        }

        console.log('key-pressed:', ev.key)
    }

    private onKeyDownHandlers = (ev: KeyEv) => onKeyDownHandlers(ev, this)

    deleteNodeAndFocusNodeAbove = () => {
        if (this.at == null) return this.resetCaretPos()
        const parent = this.at.nodeAboveInView
        this.at.delete()
        this.setAt(parent)
    }

    deleteNodeAndFocusNodeBelow = () => {
        if (this.at == null) return this.resetCaretPos()
        /** node below may be deleted, so we first store the node above
         * then after the deletion, retrieve the node below */
        let parent = this.at.nodeAboveInView
        this.at.delete()
        this.setAt(parent?.nodeBelowInView ?? parent)
    }

    resetCaretPos = (): undefined => {
        this.setAt(this.tree.topLevelNodes[0])
    }

    moveUp = () => {
        if (this.at == null) return this.resetCaretPos()
        const nextAt = this.at.nodeAboveInView
        if (nextAt) this.setAt(nextAt)
    }

    movePageUp = () => {
        return this.resetCaretPos()
    }

    movePageDown = () => {
        if (this.at == null) return this.resetCaretPos()
        let ptr: Maybe<TreeNode> = this.at
        let max = 100
        let final: TreeNode = this.at
        while ((ptr = ptr.nodeBelowInView) && max-- > 0) {
            final = ptr
        }
        this.setAt(final)
    }

    moveDown = () => {
        if (this.at == null) return this.resetCaretPos()
        const nextAt = this.at.nodeBelowInView
        if (nextAt) this.setAt(nextAt)
    }

    moveRight = () => {
        if (this.at == null) return this.resetCaretPos()
        const children = this.at.children
        if (children.length > 0) {
            if (this.at.isOpen) return this.setAt(children[0])
            else return this.at.open()
        }
        return this.moveDown()
    }

    moveLeft = () => {
        if (this.at == null) return this.resetCaretPos()
        if (this.at.isOpen) return this.at.close()
        if (this.at.parent) return (this.at = this.at.parent)
    }
}
