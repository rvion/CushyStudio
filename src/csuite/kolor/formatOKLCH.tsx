import type { OKLCH } from './OKLCH'

import { clamp } from '../../controls/utils/clamp'

/** `oklch(${l} ${c} ${h})` */
export function formatOKLCH(col: OKLCH) {
    const l = clamp(col.lightness, 0.0001, 0.9999).toFixed(3)
    const c = col.chroma.toFixed(3)
    const h = col.hue.toFixed(3)
    return `oklch(${l} ${c} ${h})`
}
