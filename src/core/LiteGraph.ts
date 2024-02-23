import type { ComfyWorkflowL } from '../models/ComfyWorkflow'
import type { CytoJSON } from './AutolayoutV2'
import type { ComfyNode } from './ComfyNode'

import { toJS } from 'mobx'

import { bang } from '../utils/misc/bang'

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
    linkId: LiteGraphLinkID, //  9, // linkId
    fromNodeId: number, //       8, // fromNodeId
    fromNodeOutputIx: number, // 0, // fromNodeOutputIx
    toNodeId: number, //         9, // toNodeId
    toNodeInputIx: number, //    0, // toNodeInputIx
    linkType: string, //         "IMAGE" // type
]

export type LiteGraphLinkID = Branded<number, { LiteGraphLinkID: true }>
const asLiteGraphLinkID = (id: number): LiteGraphLinkID => id as LiteGraphLinkID

export type LiteGraphSlotIndex = Branded<number, { LiteGraphSlotIndex: true }>
export const asLiteGraphSlotIndex = (id: number): LiteGraphSlotIndex => id as LiteGraphSlotIndex

export type LiteGraphNodeInput = {
    name: string // 'clip'
    type: string // 'CLIP'
    link: LiteGraphLinkID | null // 5
    widget?: {
        name: string // 'select'
        config: any // 🔴
    }
}

export type LiteGraphNodeOutput = {
    // ❌9 name: string // 'CONDITIONING'
    type: string // 'CONDITIONING'
    links: LiteGraphLinkID[]
    slot_index: LiteGraphSlotIndex
    name: string
}

export type LiteGraphNode = {
    id: number //5
    type: string // 'CLIPTextEncode'
    pos: [number, number]
    size: { '0': number; '1': number }
    flags?: {}
    order?: number
    /**
     * 1 = ?????
     * 2 = muted
     * */
    mode?: number
    inputs?: LiteGraphNodeInput[]
    outputs: LiteGraphNodeOutput[]

    isVirtualNode?: boolean // frontend only
    properties?: {}
    widgets_values: any[]
}

export const convertFlowToLiteGraphJSON = (graph: ComfyWorkflowL, cytoJSON?: CytoJSON): LiteGraphJSON => {
    const ctx = new LiteGraphCtx(graph)
    const last_node_id = Math.max(...graph.nodes.map((n) => n.uidNumber))
    // const last_node_id = graph.nodes[graph.nodes.length - 1].uid
    console.groupCollapsed('convertNodeToLiteGraphNode')
    const xxx = graph.nodes.map((n) => convertNodeToLiteGraphNode(ctx, n))
    console.groupEnd()
    const nodes = xxx.map((n) => n.node)
    // console.log('🐙 1', nodes)
    // console.log( '🐙 2', cytoJSON!.elements.nodes.map((a) => a.data), )
    for (const n of nodes) {
        if (cytoJSON) {
            const pos = cytoJSON.elements.nodes.find((a) => parseInt(a.data.id, 10) === n.id)
            if (pos) {
                n.pos[0] = pos.position.x
                n.pos[1] = pos.position.y
            } else {
                console.log('❌ no pos', n)
            }
        }
        for (const o of n.outputs) {
            o.links = ctx.links.filter((l) => l[3] === n.id && l[4] === o.slot_index).map((l) => l[0])
        }
    }
    return {
        last_node_id,
        last_link_id: ctx.nextLinkId,
        nodes, // : xxx.map((n) => n.node),
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
        const raw = node.serializeValue(ipt.nameInComfy, node.json.inputs[ipt.nameInComfy])
        const isLink = _isLink(raw)
        if (isLink) {
            console.log('><><>', toJS(raw))
            const nodeUidNumber = bang(ctx.graph.nodes.find((n) => n.uid === raw[0])?.uidNumber)
            inputs.push({
                name: ipt.nameInComfy,
                type: ipt.type,
                link: ctx.allocateLink(
                    //
                    // parseInt(raw[0], 10),
                    nodeUidNumber,
                    raw[1],
                    node.uidNumber,
                    asLiteGraphSlotIndex(ipt.index),
                    ipt.type,
                ),
            })
            // incomingLinks.push(link)
        } else {
            widgets_values.push(raw)
        }
        // add the fake noise_seed field
        const isSeed = ipt.type === 'INT' && (ipt.nameInComfy === 'seed' || ipt.nameInComfy === 'noise_seed')
        if (isSeed) widgets_values.push(false)
    }
    const outputs = node.$schema.outputs.map(
        (i, ix): LiteGraphNodeOutput => ({
            // ❌9 name: i.nameInComfy,
            type: i.typeName,
            links: [], // empty links by default 🔴
            slot_index: asLiteGraphSlotIndex(ix),
            name: i.nameInCushy,
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
            size: [node.width, node.height],
            widgets_values,
        },
    }
}

const _isLink = (v: any): v is [string, number] => {
    if (Array.isArray(v)) return true // 🔴
    return false
}

export class LiteGraphCtx {
    constructor(public graph: ComfyWorkflowL) {}
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
