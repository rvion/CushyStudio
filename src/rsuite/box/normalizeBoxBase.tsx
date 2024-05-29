import type { Kolor } from '../kolor/Kolor'

import { clamp } from '../../controls/widgets/list/clamp'
import { getLCHFromString } from '../kolor/getLCHFromString'

export function normalizeBoxBase(base: Kolor | string | number | undefined): Kolor | null {
    if (base == null) return null
    if (typeof base === 'number') return { contrast: clamp(base / 100, 0, 1) }
    if (typeof base === 'string') return getLCHFromString(base)
    return base
}
