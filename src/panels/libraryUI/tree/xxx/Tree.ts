import { makeAutoObservable, action } from 'mobx'
import { STATE } from 'src/state/state'
import { TreeNode, NodeData, NodeId, NodeKey, NodeSlot, getId } from './TreeNode'
import { FAIL, VIOLATION } from './utils'
import { buildTreeItem } from '../nodes/buildTreeItem'
import { TreeItemID } from '../TreeEntry'

export class Tree {
    topLevelNodes: TreeNode[] = []
    constructor(
        //
        public st: STATE,
        rootNodes: TreeItemID[],
    ) {
        for (let uid of rootNodes) {
            const nd = buildTreeItem(st, uid)
            this.topLevelNodes.push(new TreeNode(this, nd, null))
        }
        makeAutoObservable(this, { indexNode: action })
    }

    get nodes(): TreeNode[] {
        return Array.from(this.nodeById.values())
    }

    // INDEXES ------------------------------------------------------
    /** get node by id */
    private nodeById = new Map<NodeId, TreeNode>()
    private nodeBySlot = new Map<NodeSlot, TreeNode>()
    // private nodesByParentId = new Map<NodeId | undefined, Node[]>()

    // get topLevelNodes(): Node[] { return this.getChildrenOf(undefined) } // prettier-ignore

    getNodeById = (nodeId: NodeId): TreeNode | undefined => this.nodeById.get(nodeId)

    // getChildrenOf = (pid: NodeId | undefined): Node[] => {
    //     let arr = this.nodesByParentId.get(pid)
    //     if (arr) return arr
    //     arr = observable([], { deep: false })
    //     this.nodesByParentId.set(pid, arr)
    //     return arr
    // }

    getNodeBySlot = (parent: TreeNode | NodeId | undefined, key: string): TreeNode | undefined => {
        const parentID = parent == null ? 'undefined' : getId(parent)
        const slot: NodeSlot = `${parentID}.${key}`
        return this.nodeBySlot.get(slot)
    }

    // changeNodeParent = (n: Node, parent: Node | NodeId | undefined, opts: { onConflict: MoveConflictResolution }) => {
    //     this.deindexNode_bySlot(n)
    //     this.deindexNode_byParent(n)

    //     n.data.parentId = parent ? getId(parent) : undefined

    //     const futureParentID = parent ? getId(parent) : undefined
    //     const futureSiblings = this.getChildrenOf(futureParentID)
    //     const possibleKeyConflicts = futureSiblings.map((i) => i.parentKey)
    //     const hasConflict = possibleKeyConflicts.includes(n.parentKey)
    //     if (hasConflict) {
    //         if (opts.onConflict === 'disambiguate') n.data.parentKey += `_${genUID()}`
    //         else if (opts.onConflict === 'fail') {
    //             throw new Error('changeNodeParent: conflict; pre-exiting key: ' + n.parentKey)
    //         } else if (opts.onConflict === 'overwrite') {
    //             const existing = this.getNodeBySlot(n.parent, n.parentKey)
    //             if (existing) this.deleteNode(existing)
    //         } else {
    //             exhaust(opts.onConflict)
    //         }
    //     }

    //     this.indexNode_bySlot(n)
    //     this.indexNode_byParent(n)
    // }

    changeNodeKey = (n: TreeNode, parentKey: NodeKey) => {
        // if (!n.isProxy) FAIL('changeNodeParent must receive a proxified node, not a naked one')
        this.deindexNode_bySlot(n)
        n.parentKey = parentKey
        this.indexNode_bySlot(n)
    }

    /** every node created must call this function to register itself properly */
    indexNode = (n: TreeNode) => {
        // if (!n.isProxy) FAIL('indexNode must receive a proxified node, not a naked one')
        this.indexNode_byId(n)
        this.indexNode_byParent(n)
        this.indexNode_bySlot(n)
    }

    deleteNode = (n: TreeNode) => {
        const toDelete = n.get_descendant_and_self('bfs').reverse()
        for (const c of toDelete) {
            this.deindexNode_byParent(c)
            this.deindexNode_bySlot(c)
            this.deindexNode_byId(c)
        }
    }
    // =============================================================================================
    // BY ID ---------------------------------------------
    private indexNode_byId = (n: TreeNode) => {
        const prevNodeById = this.nodeById.get(n.id)
        if (prevNodeById && prevNodeById !== n) FAIL('different node pre-existing for this id')
        this.nodeById.set(n.id, n)
    }
    private deindexNode_byId = (n: TreeNode) => {
        const prevNodeById = this.nodeById.get(n.id)
        if (prevNodeById == null) VIOLATION('node was not properly indexed')
        if (prevNodeById !== n) VIOLATION('another node was indexed at this id')
        this.nodeById.delete(n.id)
    }
    // BY PARENT ---------------------------------------------
    private indexNode_byParent = (n: TreeNode) => {
        // const siblings = this.getChildrenOf(n.parentId)
        // if (siblings.includes(n)) VIOLATION('already listed as child of parent')
        // siblings.push(n)
    }
    private deindexNode_byParent = (n: TreeNode) => {
        // const siblings = this.getChildrenOf(n.parentId)
        // const index = siblings.indexOf(n)
        // if (!(index > -1)) VIOLATION('was not listed as children of given parent')
        // siblings.splice(index, 1)
    }
    // BY SLOT ---------------------------------------------
    private indexNode_bySlot = (n: TreeNode) => {
        const slot: NodeSlot = `${n.parentId}.${n.parentKey}`
        const prevNodeBySlot = this.nodeBySlot.get(slot)
        if (prevNodeBySlot === n) VIOLATION('already indexed at same slot')
        if (prevNodeBySlot) VIOLATION('different node pre-existing for this slot')
        this.nodeBySlot.set(slot, n)
    }
    private deindexNode_bySlot = (n: TreeNode) => {
        const slot: NodeSlot = `${n.parentId}.${n.parentKey}`
        const prevNodeBySlot = this.nodeBySlot.get(slot)
        if (prevNodeBySlot == null) VIOLATION("node wasn't properly indexed at slot")
        if (prevNodeBySlot !== n) VIOLATION('a different node was indexed here')
        this.nodeBySlot.delete(slot)
    }
    // =============================================================================================

    // indexNode_UNSAFE = (n: Node) => {
    //     this.nodeById.set(n.id, n)
    //     this.getChildrenOf(n.parentId).push(n)
    //     const slot: NodeSlot = `${n.parentId}.${n.parentKey}`
    //     this.nodeBySlot.set(slot, n)
    // }

    // JSON ------------------------------------------------------
    get json2(): NodeData[] {
        return this.nodes.map((n) => n.data)
    }
    get json2Txt(): string {
        return '{\n' + this.nodes.map((n) => '    ' + JSON.stringify(n.data)).join('\n') + '\n}'
    }
    // get json3Txt(): string {
    //     const keys = NodeDataKeys
    //     return '{\n' + this.nodes.map((n) => '    ' + JSON.stringify(keys.map((k) => n.data[k]))).join('\n') + '\n}'
    // }

    // addRoot = (key: string, data: Partial<NodeData> = {}) => {
    //     const d: NodeData = { id: genUID(), parentKey: key, ...data }
    //     return new Node(this, d)
    // }

    // PATH ------------------------------------------------------
    getNodeAtPath = (path: string): TreeNode => {
        const segments = path.split('/')
        let pid: NodeId | undefined
        let at: TreeNode | undefined
        for (let key of segments) {
            const slot: NodeSlot = `${pid}.${key}`
            at = this.nodeBySlot.get(slot)
            if (at == null) throw new Error('🔴 1')
            pid = at.id
        }
        if (at == null) throw new Error('🔴 2')
        return at
    }

    // XPATH ------------------------------------------------------
    // getNodeAtXPath = (
    //     path: string, // either ralative or absolute path
    //     // where we want to start from, used when
    //     from: NodeId | Node | undefined = undefined,
    // ): Node[] => {
    //     const segments = path.split('/')
    //     let pid: NodeId | undefined
    //     let at: Node | undefined

    //     // ABS or relative start
    //     if (path[0] === '/') {
    //         segments.shift()
    //         pid = undefined
    //     } else if (from != null) {
    //         // console.log({ from })
    //         if (typeof from === 'string') {
    //             pid = from
    //             at = this.nodeById.get(pid)!
    //         } else {
    //             at = from
    //             pid = from.id
    //         }
    //     }
    //     if (path === '') return at as any

    //     let ix = 0
    //     for (let key_ of segments) {
    //         if (key_ === '') continue
    //         // camecasing
    //         const key = key_[0].toUpperCase() + key_.slice(1)

    //         if (key === '*') {
    //             const children = this.getChildrenOf(pid)
    //             const sub = segments.slice(ix + 1).join('/')
    //             // console.log({ sub })
    //             // @ts-ignore
    //             return children.flatMap((c) => this.getNodeAtXPath(sub, c))
    //         } else {
    //             const slot: NodeSlot = `${pid}.${key}`
    //             at = this.nodeBySlot.get(slot)
    //             if (at == null) return []
    //             pid = at.id
    //         }
    //         ix++
    //     }
    //     if (at == null) throw new Error('🔴 2')
    //     return [at]
    // }
}

// get json1() {
//     let out: any = {}
//     const roots = this.nodesByParentId.get(undefined)
//     if (roots == null) return out
//     for (let i of roots) out[i.parentKey] = i.json1
//     return out
// }

// setAt = (path: string, key: string, raw?: string, typeName?: string): Node => {
//     const node = this.getNodeAtPath(path)
//     return new Node(this, {
//         id: genUID(),
//         parentKey: key,
//         parentId: node.id,
//         // rawPrimValue: raw,
//         typeName,
//     })
// }
