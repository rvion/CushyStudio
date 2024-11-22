import type { IsEqual } from '../../types/Misc'

import * as v from 'valibot'

import { type LiteGraphLinkID, LiteGraphLinkID_valibot } from './LiteGraphLinkID'

// prettier-ignore
export type LiteGraphLink = [
   linkId: LiteGraphLinkID,  // 9,      - linkId
   fromNodeId: number,       // 8,      - fromNodeId
   fromNodeOutputIx: number, // 0,      - fromNodeOutputIx
   toNodeId: number,         // 9,      - toNodeId
   toNodeInputIx: number,    // 0,      - toNodeInputIx
   linkType: string          // "IMAGE"  - type
]

export const LiteGraphLink_valibot = v.tuple([
   LiteGraphLinkID_valibot,
   v.number(),
   v.number(),
   v.number(),
   v.number(),
   v.string(),
])

const _: IsEqual<LiteGraphLink, v.InferInput<typeof LiteGraphLink_valibot>> = true
