import { createRef } from 'react'

import { makeAutoObservable } from 'mobx'

import { Tree } from './Tree'
import { TreeNode } from './TreeNode'
import { KeyEv, onKeyDownHandlers } from './TreeShortcuts'
import { nanoid } from 'nanoid'

export class TreeView {
    id = nanoid(4)
    constructor(public tree: Tree) {
        this.resetCaretPos()
        makeAutoObservable(this)
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
        // if (this.filter) {
        //     const res = this.module.getNodeAtXPath(this.filter)
        //     if (Array.isArray(res)) return res
        //     return [res]
        // }
        return this.tree.topLevelNodes
    }

    // cursor
    at: TreeNode | undefined

    get cursorInfos() {
        const at = this.at
        if (at == null) return null
        return {
            slot: at.slot,
            nodeAboveInTreeview: at.nodeAboveInView?.id,
            nodeBelowInTreeview: at.nodeBelowInView?.id,
            lastDescendant: at.lastDescendant?.id,
            lastChild: at.lastChild?.id,
            descendant_bfs: at.descendantBFS.map((i) => i.id),
            descendant_dfs: at.descendantDFS.map((i) => i.id),
            depth: at.depth,
            parent: at.parentId,
            path: at.path,
            pathStr: at.pathStr,
            siblingsIncludingSelf: at.siblingsIncludingSelf.map((i) => i.id),
            siblingsExcludingSelf: at.siblingsExcludingSelf.map((i) => i.id),
            nextSibling: at.nextSibling?.id,
            prevSibling: at.prevSibling?.id,
            firstChild: at.firstChild?.id,
        }
    }
    focus = (at: TreeNode) => {
        this.at = at
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

    changeKey = () => {
        if (this.at == null) return this.resetCaretPos()
        const res = window.prompt('new key', this.at.parentKey)
        if (res != null) this.at.changeKey(res)
    }

    deleteNodeAndFocusNodeAbove = () => {
        if (this.at == null) return this.resetCaretPos()
        const parent = this.at.nodeAboveInView
        this.at.delete()
        this.at = parent
    }

    deleteNodeAndFocusNodeBelow = () => {
        if (this.at == null) return this.resetCaretPos()
        /** node below may be deleted, so we first store the node above
         * then after the deletion, retrieve the node below */
        let parent = this.at.nodeAboveInView
        this.at.delete()
        this.at = parent?.nodeBelowInView ?? parent
    }

    addChild = (): TreeNode | undefined => {
        if (this.at == null) return this.resetCaretPos()
        console.log(`[👙] TODO`)
    }

    addChildAndFocus = () => {
        this.at = this.addChild()
    }

    resetCaretPos = (): undefined => {
        this.at = this.tree.topLevelNodes[0]
        return
    }

    moveUp = () => {
        if (this.at == null) return this.resetCaretPos()
        const nextAt = this.at.nodeAboveInView
        if (nextAt) this.at = nextAt
        // console.log(`[👙] ${this.id}.at=`, nextAt?.id, this.at.id)
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
        this.at = final
    }

    moveDown = () => {
        if (this.at == null) return this.resetCaretPos()
        const nextAt = this.at.nodeBelowInView
        if (nextAt) this.at = nextAt
        // console.log(`[👙] ${this.id}.at=`, nextAt?.id, this.at.id)
    }

    moveRight = () => {
        if (this.at == null) return this.resetCaretPos()
        const children = this.at.children
        if (children.length > 0) {
            if (this.at.opened) return (this.at = children[0])
            else return this.at.open()
        }
        return this.moveDown()
    }

    moveLeft = () => {
        if (this.at == null) return this.resetCaretPos()
        if (this.at.opened) return this.at.close()
        if (this.at.parent) return (this.at = this.at.parent)
    }
}

// addSibling = () => {
//     if (this.at == null) return this.resetCaretPos()
//     const parent = this.at.parent
//     if (parent == null) return
//     const res = window.prompt('new key', this.at.parentKey)
//     if (res != null) parent.addChildAt(res)
// }

// changeValue = () => {
//     if (this.at == null) return this.resetCaretPos()
//     const res = window.prompt('new value', this.at.rawPrimValue)
//     if (res != null) this.at.changeValue(res)
// }

// hoistNodeUp = () => {
//     if (this.at == null) return this.resetCaretPos()
//     this.at.hoistUp()
// }

// const res = window.prompt('parentKey', 'a')
// if (res == null) return
// if (res.length === 0) return
// const key = res[0].toUpperCase() + res.slice(1)
// if (this.at.value != null) {
//     this.at.addChildAt('Value_', { rawPrimValue: this.at.value })
//     this.at.data.rawPrimValue = undefined
// }
// return this.at.addChildAt(key)
