import type { IsEqual } from '../../types/Misc'

import * as v from 'valibot'

import { type LiteGraphLinkID, LiteGraphLinkID_valibot } from './LiteGraphLinkID'

export type LiteGraphNodeInput = {
   name: string // 'clip'
   type: string // 'CLIP'
   link: LiteGraphLinkID | null // 5
   shape?: number // '2D'
   widget?: {
      name: string // 'select'
      config: any // 🔴
   }
}

export const LiteGraphNodeInput_valibot = v.strictObject({
   name: v.string(),
   type: v.string(),
   link: v.nullable(LiteGraphLinkID_valibot),
   shape: v.optional(v.number()),
   widget: v.optional(
      v.strictObject({
         name: v.string(),
         config: v.any(),
      }),
   ),
})

const check: IsEqual<LiteGraphNodeInput, v.InferInput<typeof LiteGraphNodeInput_valibot>> = true
