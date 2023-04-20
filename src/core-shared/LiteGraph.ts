import type { Branded } from '../utils/types'
import type { Graph } from './Graph'
import type { ComfyNode } from './Node'

export type LiteGraphJSON = {
    last_node_id: number
    last_link_id: number
    nodes: LiteGraphNode[]
    links: LiteGraphLink[]
    groups: []
    config: {}
    extra: {}
    version: 0.4
}

export type LiteGraphLink = [
    linkId: LiteGraphLinkID, //     9, // linkId
    fromNodeId: number, //     8, // fromNodeId
    fromNodeOutputIx: number, //     0, // fromNodeOutputIx
    toNodeId: number, //     9, // toNodeId
    toNodeInputIx: number, //     0, // toNodeInputIx
    linkType: string, //     "IMAGE" // type
]

export type LiteGraphLinkID = Branded<number, 'LiteGraphLinkID'>
const asLiteGraphLinkID = (id: number): LiteGraphLinkID => id as LiteGraphLinkID

export type LiteGraphSlotIndex = Branded<number, 'LiteGraphSlotIndex'>
export const asLiteGraphSlotIndex = (id: number): LiteGraphSlotIndex => id as LiteGraphSlotIndex

export type LiteGraphNodeInput = {
    name: string // 'clip'
    type: string // 'CLIP'
    link: LiteGraphLinkID // 5
}

export type LiteGraphNodeOutput = {
    name: string // 'CONDITIONING'
    type: string // 'CONDITIONING'
    links: LiteGraphLinkID[]
    slot_index: LiteGraphSlotIndex
}

export type LiteGraphNode = {
    id: number //5
    type: string // 'CLIPTextEncode'
    pos: [number, number]
    size: { '0': number; '1': number }
    flags?: {}
    order?: number
    mode?: number
    inputs: LiteGraphNodeInput[]
    outputs: LiteGraphNodeOutput[]

    properties?: {}
    widgets_values: any[]
}

export const convertFlowToLiteGraphJSON = (graph: Graph): LiteGraphJSON => {
    //

    const ctx = new LiteGraphCtx(graph)
    const last_node_id = Math.max(...graph.nodes.map((n) => n.uidNumber))
    const xxx = graph.nodes.map((n) => convertNodeToLiteGraphNode(ctx, n))
    const nodes = xxx.map((n) => n.node)
    for (const n of nodes) {
        for (const o of n.outputs) {
            o.links = ctx.links.filter((l) => l[3] === n.id && l[4] === o.slot_index).map((l) => l[0])
        }
    }
    return {
        last_node_id,
        last_link_id: ctx.nextLinkId,
        nodes: xxx.map((n) => n.node),
        links: ctx.links,
        config: {},
        extra: {},
        groups: [],
        version: 0.4,
    }
}

const convertNodeToLiteGraphNode = (
    ctx: LiteGraphCtx,
    node: ComfyNode<any>,
): { node: LiteGraphNode; incomingLinks: LiteGraphLink[] } => {
    const inputs: LiteGraphNodeInput[] = []
    const widgets_values: any[] = []
    const incomingLinks: LiteGraphLink[] = []
    for (const ipt of node.$schema.inputs) {
        // if for adding the randomisation is: is it an INT and is it called seed or noise_seed
        const raw = node.serializeValue(ipt.name, node.json.inputs[ipt.name])
        const isLink = _isLink(raw)
        if (isLink) {
            inputs.push({
                name: ipt.name,
                type: ipt.type,
                link: ctx.allocateLink(parseInt(raw[0], 10), raw[1], node.uidNumber, asLiteGraphSlotIndex(ipt.index), ipt.type),
            })
            // incomingLinks.push(link)
        } else {
            widgets_values.push(raw)
        }
        // add the fake noise_seed field
        const isSeed = ipt.type === 'INT' && (ipt.name === 'seed' || ipt.name === 'noise_seed')
        if (isSeed) widgets_values.push(false)
    }
    const outputs = node.$schema.outputs.map(
        (i, ix): LiteGraphNodeOutput => ({
            name: i.name,
            type: i.type,
            links: [], // empty links by default 🔴
            slot_index: asLiteGraphSlotIndex(ix),
        }),
    )
    return {
        incomingLinks,
        node: {
            type: node.$schema.nameInComfy,
            id: node.uidNumber,
            inputs,
            outputs,
            pos: [0, 0],
            size: [200, Object.keys(node.inputs).length * 20 + 20],
            widgets_values,
        },
    }
}

const _isLink = (v: any): v is [string, number] => {
    if (Array.isArray(v)) return true // 🔴
    return false
}

export class LiteGraphCtx {
    constructor(public graph: Graph) {}
    nextLinkId = 0
    links: LiteGraphLink[] = []
    allocateLink = (
        fromNodeId: number,
        fromNodeOutputIx: number,
        toNodeId: number,
        toNodeInputIx: number,
        linkType: string,
    ): LiteGraphLinkID => {
        const linkId = asLiteGraphLinkID(++this.nextLinkId)
        this.links.push([linkId, fromNodeId, fromNodeOutputIx, toNodeId, toNodeInputIx, linkType])
        return linkId
    }
}
