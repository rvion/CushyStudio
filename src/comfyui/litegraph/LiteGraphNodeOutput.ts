import type { IsEqual } from '../../types/Misc'

import * as v from 'valibot'

import { type LiteGraphLinkID, LiteGraphLinkID_valibot } from './LiteGraphLinkID'
import { type LiteGraphSlotIndex, LiteGraphSlotIndex_valibot } from './LiteGraphSlotIndex'

export type LiteGraphNodeOutput = {
   // ❌9 name: string // 'CONDITIONING'
   name: string
   type: string // 'CONDITIONING'
   links: LiteGraphLinkID[] | null
   shape?: number // '2D'
   slot_index?: LiteGraphSlotIndex
}

export const LiteGraphNodeOutput_valibot = v.strictObject({
   name: v.string(),
   type: v.string(),
   links: v.nullable(v.array(LiteGraphLinkID_valibot)),
   shape: v.optional(v.number()),
   slot_index: v.optional(LiteGraphSlotIndex_valibot),
})

const _: IsEqual<LiteGraphNodeOutput, v.InferInput<typeof LiteGraphNodeOutput_valibot>> = true
