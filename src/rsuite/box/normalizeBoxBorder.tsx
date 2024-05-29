import type { Kolor } from '../kolor/Kolor'

import { clamp } from '../../controls/widgets/list/clamp'
import { getLCHFromString } from '../kolor/getLCHFromString'

export function normalizeBoxBorder(border: Kolor | string | number | boolean | undefined): Kolor | null {
    if (border == null) return null
    if (typeof border === 'boolean') return { contrast: 0.2 }
    if (typeof border === 'number') return { contrast: clamp(border / 10, 0, 1) }
    if (typeof border === 'string') return getLCHFromString(border)
    return border
}
