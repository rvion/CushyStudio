import type { IsEqual } from '../../types/Misc'

import * as v from 'valibot'

export type LiteGraphSlotIndex = Branded<number, { LiteGraphSlotIndex: true }>

export function asLiteGraphSlotIndex(id: number): LiteGraphSlotIndex {
   return id as LiteGraphSlotIndex
}

export const LiteGraphSlotIndex_valibot = v.custom<LiteGraphSlotIndex>(
   (v) => typeof v === 'number' && !isNaN(v) && v >= 0,
   (v): string => {
      if (typeof v.received !== 'number') return `LiteGraphSlotIndex is not a number (${JSON.stringify(v.received, null, 3)})` // prettier-ignore
      if (isNaN(v.received)) return 'LiteGraphSlotIndex is NaN'
      if (v.received < 0) return 'LiteGraphSlotIndex is negative'
      return '?'
   },
)

const _: IsEqual<LiteGraphSlotIndex, v.InferInput<typeof LiteGraphSlotIndex_valibot>> = true
