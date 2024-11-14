import type { IsEqual } from '../../types/Misc'

import * as v from 'valibot'

export type LiteGraphLinkID = Branded<number, { LiteGraphLinkID: true }>

export function asLiteGraphLinkID(id: number): LiteGraphLinkID {
   return id as LiteGraphLinkID
}

export const LiteGraphLinkID_valibot = v.custom<LiteGraphLinkID>(
   (v) => typeof v === 'number' && !isNaN(v) && v >= 0,
   'LiteGraphLinkID',
)

const _: IsEqual<LiteGraphLinkID, v.InferInput<typeof LiteGraphLinkID_valibot>> = true
