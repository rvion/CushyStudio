import type { AbsoluteStyle } from './AbsoluteStyle'

import { clamp } from '../../controls/widgets/list/clamp'

export function formatColor(col: AbsoluteStyle) {
    return `oklch(${clamp(col.lightness, 0.0001, 0.9999).toFixed(2)} ${col.chroma.toFixed(2)} ${col.hue.toFixed(2)})`
}
