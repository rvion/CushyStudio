import type { Tree } from './Tree'

import { makeAutoObservable } from 'mobx'

import { FAIL, genUID } from './utils'
import { bang } from 'src/utils/misc/bang'
import { buildTreeItem } from '../nodes/buildTreeItem'
import { ITreeEntry, TreeEntry } from '../TreeEntry'
import { TreeEntryL } from 'src/models/TreeEntry'
import { asTreeEntryID } from 'src/db/TYPES.gen'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'

export type NodeId = string
export type NodeKey = string
export type NodeKeyKind = 'Property' | 'ArrayIndex' | 'unknown'

export type NodeSlot = `${NodeId}.${NodeKey}`
export type MoveConflictResolution = 'disambiguate' | 'overwrite' | 'fail'
export type NodeData = ITreeEntry

type IArrayLike = { [x: number]: TreeNode }

export const getId = (node: TreeNode | NodeId) => {
    if (typeof node === 'string') return node
    return node.id
}

/** nested array that looks like [child, [parent..]]
 * i.e. ["0",["Foo",["3",["D",["A"]]]]] */
type NodePath = [NodeKey] | [NodeKey, NodePath]

const renderNodePath = (path: NodePath): string => {
    if (path.length === 1) return `/${path[0]}`
    return `${renderNodePath(path[1])}/${path[0]}`
}

export interface TreeNode extends IArrayLike {}
export class TreeNode {
    get opened() {
        return this.entryL.data.isExpanded ?? false
    }
    open() {
        this.data.onExpand?.(this)
        this.entryL.update({ isExpanded: SQLITE_true })
    }
    close() {
        this.entryL.update({ isExpanded: SQLITE_false })
    }
    toggle() {
        if (this.opened) this.close()
        else this.open()
    }

    // select = () => {
    //     this.tree.view
    // }

    onPrimaryAction = () => this.data.onPrimaryAction?.(this)
    onFocusItem = () => this.data.onFocusItem?.(this)

    parentKey: string
    entryL: TreeEntryL
    constructor(
        //
        public tree: Tree,
        public data: ITreeEntry,
        public parentId: NodeId | null,
    ) {
        this.parentKey = this.data.id
        this.entryL = this.tree.st.db.tree_entries.upsert({
            id: asTreeEntryID(this.data.id),
        })!
        this.tree.indexNode(this)
        makeAutoObservable(this)
    }

    get id() { return this.data.id } // prettier-ignore
    get valid() {
        return true
        // if (this.typeName === 'any') return true
        // return false // TODO
    }
    get hasChildren(): boolean {
        return this.children.length > 0
    }

    get children(): TreeNode[] {
        // return []
        const ids = this.data.children?.() ?? []
        const out: TreeNode[] = []
        for (const id of ids) {
            const node =
                this.tree.getNodeById(id) ??
                new TreeNode(
                    this.tree,
                    buildTreeItem(this.tree.st, id),
                    this.id,
                    // {
                    //     id,
                    //     parentId: this.id,
                    //     parentKey: id,
                    // }
                )
            out.push(node)
        }
        return out
        // return this.tree.getChildrenOf(this.data.id)
    }

    get parent(): TreeNode | undefined {
        if (this.parentId == null) return
        return this.tree.getNodeById(this.parentId)
    }

    get path(): NodePath {
        if (this.parentId == null) return [this.parentKey]
        return [this.parentKey, this.parent?.path!]
    }

    get pathStr(): string {
        return renderNodePath(this.path)
    }

    get depth(): number {
        if (this.parent == null) return 0
        return 1 + this.parent.depth
    }

    /** remove node from module */
    delete = () => {
        this.tree.deleteNode(this)
    }

    get siblingsIncludingSelf() {
        if (this.parent == null) return this.tree.topLevelNodes
        return this.parent.children
        // ❌ return this.tree.getChildrenOf(this.parentId)
    }

    get siblingsExcludingSelf() {
        return this.siblingsIncludingSelf.filter((i) => i !== this)
        // ❌ return this.tree.getChildrenOf(this.parentId).filter((i) => i !== this)
    }

    get nextSibling(): TreeNode | undefined {
        let siblings = this.siblingsIncludingSelf
        if (siblings.length === 0) FAIL('IMPOSSIBLE 1')
        if (siblings[siblings.length - 1] === this) return // last of the fratry
        for (let i = 0; i < siblings.length - 1; i++) {
            if (siblings[i] === this) return siblings[i + 1]
        }
        return
    }

    get prevSibling(): TreeNode | undefined {
        let siblings = this.siblingsIncludingSelf
        let self = this
        if (siblings.length === 0) FAIL('IMPOSSIBLE 2')
        if (siblings[0] === self) return // first of the fratry
        for (let i = siblings.length - 1; i > 0; i--) {
            if (siblings[i] === self) return siblings[i - 1]
        }
        return
    }

    /** return the first child of a given node
     * or undefined if node has no child */
    get firstChild(): TreeNode | undefined {
        const children = this.children
        if (children.length === 0) return
        return children[0]
    }

    get_descendant_and_self(mode: 'dfs' | 'bfs') {
        const stack: TreeNode[] = [this]
        let ix: number = 0
        let at: TreeNode | undefined
        while ((at = stack[ix++])) {
            if (mode === 'bfs') stack.push(...at.children)
            else stack.splice(ix, 0, ...at.children)
        }
        return stack
    }

    get lastChild(): TreeNode | undefined {
        if (this.children.length === 0) return
        return this.children[this.children.length - 1]
    }

    /** return the last descendant
     * [a[b,c],x[y,z]] => z */
    get lastDescendant(): TreeNode | undefined {
        let at: TreeNode | undefined = this
        let out: TreeNode | undefined
        while ((at = at.lastChild)) out = at
        return out
    }

    get isRoot(): boolean {
        return this.parentId == null
    }

    get root(): TreeNode | undefined {
        let at: TreeNode | undefined = this
        while (at.parent) {
            at = at.parent
        }
        return at
    }

    get rootOrSelf(): TreeNode {
        return this.root ?? this
    }

    get lastOpenedDescendant(): TreeNode | undefined {
        let at: TreeNode | undefined = this
        let out: TreeNode | undefined
        if (!at.opened) return
        while ((at = at.lastChild)) {
            out = at
            if (!at.opened) break
        }
        return out
    }

    get_descendant(mode: 'dfs' | 'bfs') {
        return this.get_descendant_and_self(mode).slice(1)
    }

    get descendantBFS() {
        return this.get_descendant('bfs')
    }

    get descendantDFS() {
        return this.get_descendant('dfs')
    }

    get nodeAboveInView(): TreeNode | undefined {
        return this.prevSibling?.lastOpenedDescendant ?? this.prevSibling ?? this.parent
    }

    get nodeBelowInView(): TreeNode | undefined {
        if (this.opened && this.firstChild) return this.firstChild
        if (this.nextSibling) return this.nextSibling
        let at: TreeNode | undefined = this
        while ((at = at.parent)) if (at.nextSibling) return at.nextSibling
    }

    get slot(): NodeSlot {
        return `${this.parentId}.${this.parentKey}`
    }

    getChildAt = (key: NodeKey) => this.tree.getNodeBySlot(this.id, key)

    // hoistUp = () => this.changeParent(this.parent?.parent, { onConflict: 'disambiguate' })

    // GENERIC ACTIONS
    // changeParent = (nextParent: Node | NodeId | undefined, opts: { onConflict: MoveConflictResolution }) => {
    //     this.tree.changeNodeParent(this, nextParent, opts)
    // }

    changeKey = (nextParentKey: NodeKey) => {
        this.tree.changeNodeKey(this, nextParentKey)
    }

    // changeValue = (nextRawPrimValue: string) => {
    //     this.data.rawPrimValue = nextRawPrimValue
    // }

    detach = (): this => {
        this.parentKey = this.id
        this.parentId = null
        return this
    }

    // addChildAt = (key: string, data: Partial<NodeData> = {}) =>
    //     new Node(this.tree, {
    //         id: genUID(),
    //         parentKey: key,
    //         parentId: this.data.id,
    //         ...data,
    //     })
}

// VIEWS
// toJSON = () => this.json1
// get json1(): object | null | string {
//     if (this.rawPrimValue) return this.rawPrimValue
//     const cs = this.children
//     if (cs.length === 0) return {}
//     const c0 = cs[0]
//     const kind = keyKind(c0.parentKey)
//     if (kind === 'ArrayIndex') return cs.map((i) => i.json1)
//     if (kind === 'Property') {
//         let out: any = {}
//         for (let i of cs) out[i.parentKey] = i.json1
//         return out
//     }
//     return null
// }

// export type INode2 = NodeData & {
//     children: Node[]
// } & IArrayLike

// const AProxy: ProxyHandler<Node> = {
//     get(self: Node, p: string) {
//         if (p === 'isProxy') return true
//         if (p in self) return (self as any)[p]
//         // methods
//         // if (p === "json") return self.nodeToJSON1(this)
//         // if (p === "children") return self.module.instancesOf.get(self.id)

//         // prroperty item
//         // A=65, Z=90, 0=48, 9=57
//         const code = p.charCodeAt(0)
//         if (code >= c_A && code <= c_Z) return self.tree.getNodeBySlot(self.id, p)
//         if (code >= c_0 && code <= c_9) return self.tree.getNodeBySlot(self.id, p)
//     },
// }

// const c_A = 65,
//     c_Z = 90,
//     c_0 = 48,
//     c_9 = 57,
//     c_Sharp = 36,
//     c_Dollar = 36

// const keyKind = (key: string): NodeKeyKind => {
//     const code = key.charCodeAt(0)
//     if (code >= c_A && code <= c_Z) return 'Property'
//     if (code >= c_0 && code <= c_9) return 'ArrayIndex'
//     return 'unknown'
// }

// static
// static ASSERT_VALID_KEY = (key: string) => {
//     return true
//     // const code = key.charCodeAt(0)
//     // if (code === c_Sharp) return true
//     // if (code === c_Dollar) return true
//     // if (code >= c_A && code <= c_Z) return true
//     // if (code >= c_0 && code <= c_9) return true
//     // throw new Error('invalid node key: ' + key + ' ' + code)
// }

// get parentKeyKind(): NodeKeyKind {
//     const code = this.parentKey.charCodeAt(0)
//     if (code === c_Sharp) return 'Property'
//     if (code === c_Dollar) return 'Property'
//     if (code >= c_A && code <= c_Z) return 'Property'
//     if (code >= c_0 && code <= c_9) return 'ArrayIndex'
//     throw new Error('invalid node key: ' + this.parentKey)
//     // return "unknown"
// }
