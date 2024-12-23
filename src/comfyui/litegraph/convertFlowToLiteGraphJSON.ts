import type { ComfyWorkflowL } from '../../models/ComfyWorkflow'
import type { ComfyNode } from '../livegraph/ComfyNode'
import type { LiteGraphJSON } from './LiteGraphJSON'
import type { LiteGraphLink } from './LiteGraphLink'
import type { LiteGraphNode } from './LiteGraphNode'
import type { LiteGraphNodeInput } from './LiteGraphNodeInput'
import type { LiteGraphNodeOutput } from './LiteGraphNodeOutput'

import { toJS } from 'mobx'

import { bang } from '../../csuite/utils/bang'
import { asLiteGraphLinkID, type LiteGraphLinkID } from './LiteGraphLinkID'
import { asLiteGraphSlotIndex } from './LiteGraphSlotIndex'

export const convertFlowToLiteGraphJSON = (graph: ComfyWorkflowL): LiteGraphJSON => {
   const ctx = new LiteGraphCtx(graph)
   const last_node_id = Math.max(...graph.nodes.map((n) => n.uidNumber))
   // const last_node_id = graph.nodes[graph.nodes.length - 1].uid
   console.groupCollapsed('convertNodeToLiteGraphNode')
   const xxx = graph.nodes.map((comfyNode) => ({
      liteGraphNode: convertNodeToLiteGraphNode(ctx, comfyNode),
      comfyNode,
   }))
   console.groupEnd()
   for (const xx of xxx) {
      const n = xx.liteGraphNode
      n.pos[0] = bang(xx.comfyNode.x)
      n.pos[1] = bang(xx.comfyNode.y)
      for (const o of n.outputs) {
         o.links = ctx.links.filter((l) => l[3] === n.id && l[4] === o.slot_index).map((l) => l[0])
      }
   }
   return {
      last_node_id,
      last_link_id: ctx.nextLinkId,
      nodes: xxx.map((n) => n.liteGraphNode),
      links: ctx.links,
      config: {},
      extra: {},
      groups: [],
      version: 0.4,
   }
}

const convertNodeToLiteGraphNode = (ctx: LiteGraphCtx, node: ComfyNode<any>): LiteGraphNode => {
   const inputs: LiteGraphNodeInput[] = []
   const widgets_values: any[] = []
   for (const ipt of node.$schema.inputs) {
      // if for adding the randomisation is: is it an INT and is it called seed or noise_seed
      const raw = node.serializeValue(ipt.nameInComfy, node.json.inputs[ipt.nameInComfy])
      const isLink = _isLink(raw)
      if (isLink) {
         console.log('><><>', toJS(raw))
         const nodeUidNumber = bang(ctx.graph.nodes.find((n) => n.uid === raw[0])?.uidNumber)
         inputs.push({
            name: ipt.nameInComfy,
            type: ipt.typeName,
            link: ctx.allocateLink(
               nodeUidNumber,
               raw[1],
               node.uidNumber,
               asLiteGraphSlotIndex(ipt.index),
               ipt.typeName,
            ),
         })
      } else {
         widgets_values.push(raw)
      }
      // add the fake noise_seed field
      const isSeed =
         ipt.typeName === 'INT' && (ipt.nameInComfy === 'seed' || ipt.nameInComfy === 'noise_seed')
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
      type: node.$schema.nameInComfy,
      id: node.uidNumber,
      inputs,
      outputs,
      pos: [0, 0],
      size: [node.width, node.height],
      widgets_values,
   }
}

const _isLink = (v: any): v is [string, number] => {
   if (Array.isArray(v)) return true // 🔴
   return false
}

export class LiteGraphCtx {
   constructor(public graph: ComfyWorkflowL) {}
   nextLinkId: number = 0
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
