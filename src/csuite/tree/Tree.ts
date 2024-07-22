import type { ITreeElement } from './TreeEntry'

import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

import { type SQLITE_boolean_, SQLITE_true } from '../types/SQLITE_boolean'
import { TreeNode } from './TreeNode'

// ------------------------------------------------------------------------
export type ITreeNodeState = {
    isExpanded?: Maybe<SQLITE_boolean_>
    isSelected?: Maybe<SQLITE_boolean_>
}
export type INodeStore = {
    data: ITreeNodeState
    update: (data: Partial<ITreeNodeState>) => void
}

export type TreeStorageConfig = {
    /**
     * @since 2024-05-21
     * called once at construction time to get a
     * hold on some persistent storage object, in case you want to persist the tree state
     * easilly
     * */
    getNodeState: (node: TreeNode) => INodeStore
    /**
     */
    updateAll?: (data: { isExpanded: SQLITE_boolean_ | null }) => void
}

export const defaultTreeStorage = (node: TreeNode): INodeStore => {
    const data: ITreeNodeState = observable({
        isExpanded: SQLITE_true,
        isSelected: SQLITE_true,
    })
    return observable({
        data,
        update: (next) => Object.assign(data, next),
    })
}
// ------------------------------------------------------------------------

export class Tree {
    topLevelNodes: TreeNode[] = []
    KeyboardNavigableDomNodeID = nanoid()

    constructor(
        //
        rootNodes: ITreeElement[],
        public config: TreeStorageConfig = { getNodeState: defaultTreeStorage },
    ) {
        for (const uid of rootNodes) {
            const node = new TreeNode(this, uid, undefined)
            this.topLevelNodes.push(node)
        }
        makeAutoObservable(this, {
            // indexNode: action
        })
    }
}

// ⏸️    get nodes(): TreeNode[] {
// ⏸️        return Array.from(this.nodeById.values())
// ⏸️    }
// ⏸️
// ⏸️    // INDEXES ------------------------------------------------------
// ⏸️    /** get node by id */
// ⏸️    private nodeById = new Map<NodeId, TreeNode>()
// ⏸️
// ⏸️    getNodeById = (nodeId: NodeId): TreeNode | undefined => this.nodeById.get(nodeId)
// ⏸️
// ⏸️    /** every node created must call this function to register itself properly */
// ⏸️    indexNode = (n: TreeNode) => {
// ⏸️        this.indexNode_byId(n)
// ⏸️    }
// ⏸️
// ⏸️    deleteNode = (n: TreeNode) => {
// ⏸️        const toDelete = n.get_descendant_and_self('bfs').reverse()
// ⏸️        for (const c of toDelete) this.deindexNode_byId(c)
// ⏸️    }
// ⏸️
// ⏸️    // =============================================================================================
// ⏸️    // BY ID ---------------------------------------------
// ⏸️    private indexNode_byId = (n: TreeNode) => {
// ⏸️        const prevNodeById = this.nodeById.get(n.id)
// ⏸️        if (prevNodeById && prevNodeById !== n) FAIL(`different node pre-existing for this id: ${n.id}`)
// ⏸️        this.nodeById.set(n.id, n)
// ⏸️    }
// ⏸️
// ⏸️    private deindexNode_byId = (n: TreeNode) => {
// ⏸️        const prevNodeById = this.nodeById.get(n.id)
// ⏸️        if (prevNodeById == null) VIOLATION('node was not properly indexed')
// ⏸️        if (prevNodeById !== n) VIOLATION('another node was indexed at this id')
// ⏸️        this.nodeById.delete(n.id)
// ⏸️    }
