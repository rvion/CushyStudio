import type { AbsoluteStyle } from './AbsoluteStyle'

import { clamp } from '../../controls/widgets/list/clamp'

export function formatColor(col: AbsoluteStyle) {
    return `oklch(${clamp(col.lightness, 0.0001, 0.9999)} ${col.chroma} ${col.hue})`
}
