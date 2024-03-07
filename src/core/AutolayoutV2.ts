import type { ComfyWorkflowL } from '../models/ComfyWorkflow'

import ELK, { type ElkExtendedEdge, type ElkNode } from 'elkjs'

import { bang } from '../utils/misc/bang'
import { ComfyNode } from './ComfyNode'

const elk = new ELK()

/**
 * partial type of cytoscape json output
 * include the subset needed to get positions post layout
 */
export const runAutolayout = async (
    graph: ComfyWorkflowL,
    p?: {
        width?: (node: ComfyNode<any, any>) => number
        height?: (node: ComfyNode<any, any>) => number
    },
): Promise<ElkNode> => {
    const nodes: ElkNode[] = []
    const edges: ElkExtendedEdge[] = []
    console.log(`[👙] runAutoLayout with ${graph.nodes.length} nodes`)
    for (const node of graph.nodes) {
        console.log(`[🤠] elk[build] node(id=${node.uid} | ${node.uidNumber})`)
        nodes.push({
            id: node.uid,
            width: p?.width?.(node) ?? node.width * 1.2,
            height: p?.height?.(node) ?? node.height * 1.2,
        })
        for (const edge of node._incomingEdges()) {
            const from = bang(graph.nodes.find((n) => n.uid === edge.from)?.uid)
            const to = node.uid
            edges.push({
                id: `${from}-${edge.inputName}->${to}`,
                sources: [edge.from],
                targets: [node.uid],
            })
        }
    }
    const json: ElkNode = {
        id: 'root',
        layoutOptions: { 'elk.algorithm': 'layered' },
        children: nodes,
        edges: edges,
    }

    const res = await elk.layout(json)
    console.log('elk runAutoLaoyt result: 🟢', res)
    return res
}
