import type { IsEqual } from '../../types/Misc'
import type { LiteGraphLinkID } from './LiteGraphLinkID'

import * as v from 'valibot'

import { type LiteGraphGroup, LiteGraphGroup_valibot } from './LiteGraphGroup'
import { type LiteGraphLink, LiteGraphLink_valibot } from './LiteGraphLink'
import { type LiteGraphNode, LiteGraphNode_valibot } from './LiteGraphNode'

/** comfy workflows are simply LiteGraphs workflows */
export type ComfyWorkflowJSON = LiteGraphJSON

/** litegraph workflow are stored... in a very unpractical format */
export type LiteGraphJSON = {
   last_node_id: number
   last_link_id: number
   nodes: LiteGraphNode[]
   links: LiteGraphLink[]
   groups: LiteGraphGroup[]
   config: {}
   extra: {
      ds?: {
         scale: number
         offset: { 0: number; 1: number }
      }
   }
   version: 0.4
}

export const LiteGraphJSON_valibot = v.strictObject({
   last_node_id: v.number(),
   last_link_id: v.number(),
   nodes: v.array(LiteGraphNode_valibot),
   links: v.array(LiteGraphLink_valibot),
   groups: v.array(LiteGraphGroup_valibot),
   config: v.strictObject({}),
   extra: v.strictObject({
      ds: v.optional(
         v.strictObject({
            scale: v.number(),
            offset: v.strictObject({ '0': v.number(), '1': v.number() }),
         }),
      ),
   }),
   version: v.literal(0.4),
})

const _: IsEqual<LiteGraphJSON, v.InferInput<typeof LiteGraphJSON_valibot>> = true
