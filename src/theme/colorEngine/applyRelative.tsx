import { clamp } from 'three/src/math/MathUtils'

import { AbsoluteStyle, RelativeStyle } from './AbsoluteStyle'
import { autoContrast } from './autoContrast'

export const applyRelative = (a: AbsoluteStyle, b: RelativeStyle): AbsoluteStyle => {
    // oklch(lightness chroma hue);
    const xxx = autoContrast(a.lightness, b.contrast)
    const lightness = xxx /* a.lightness */
    const chroma = clamp(a.chroma * (b.chromaBlend ?? 1), 0, 0.4)

    const hue = a.hue + (b.hueShift ?? 0)
    return { type: 'absolute', lightness, chroma, hue }
}
