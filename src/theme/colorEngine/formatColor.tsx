import { clamp } from 'three/src/math/MathUtils'

import { AbsoluteStyle } from './AbsoluteStyle'

export function formatColor(col: AbsoluteStyle) {
    return `oklch(${clamp(col.lightness, 0.0001, 0.9999)} ${col.chroma} ${col.hue})`
}
