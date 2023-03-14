import { INode } from 'react-accessible-treeview'
import { IconUI } from '../ui/IconUI'
import { exhaust } from './ComfyUtils'

export type INodeExt = INode & { type: ITreeNodeType }

export type ITreeNodeType = 'client' | 'graph' | 'node' | 'project' | 'script' | 'root' | 'folder' | 'config' | 'code'

export interface ITreeNode {
    type: ITreeNodeType
    name: string
    children?: ITreeNode[]
}

export const flattenTreeExt = function (tree: ITreeNode): INodeExt[] {
    let count = 0
    const flattenedTree: INodeExt[] = []
    const flattenTreeHelper = function (tree: ITreeNode, parent: number | null) {
        const node: INodeExt = {
            ...tree,
            id: count,
            children: [],
            parent,
            // name: tree.name,
            // @ts-ignore
            // data: tree.data,
        }
        flattenedTree[count] = node
        count += 1
        if (tree.children == null || tree.children.length === 0) return
        for (const child of tree.children) {
            flattenTreeHelper(child, node.id)
        }
        node.children = flattenedTree.filter((x) => x.parent === node.id).map((x: INode) => x.id)
    }

    flattenTreeHelper(tree, null)
    return flattenedTree
}

export const TreeNodeIconUI = (p: { node: ITreeNodeType }) => {
    const { icon, color } = treeNodeIcon(p.node)
    return <IconUI icon={icon} color={color} />
}

export const treeNodeIcon = (node: ITreeNodeType, isOpen?: boolean): { icon: string; color?: string } => {
    if (node === 'client') return { icon: 'workspaces' } // group-work
    if (node === 'graph') return { icon: 'account_tree' }
    if (node === 'node') return { icon: 'fiber_manual_record' }
    if (node === 'project') return { icon: 'folder' }
    if (node === 'script') return { icon: 'video_library' }
    if (node === 'config') return { icon: 'settings' }
    if (node === 'folder' && isOpen) return { icon: 'folder_open', color: 'e8a87c' }
    if (node === 'folder') return { icon: 'folder', color: 'e8a87c' }
    if (node === 'root') return { icon: 'folder', color: 'e8a87c' }
    if (node === 'code') return { icon: 'terminal', color: 'e8a87c' }
    return exhaust(node)
}
