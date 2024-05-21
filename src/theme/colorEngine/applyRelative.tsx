import type { AbsoluteStyle, RelativeStyle } from './AbsoluteStyle'

import { clamp } from '../../controls/widgets/list/clamp'

export const applyRelative = (a: AbsoluteStyle, b: RelativeStyle): AbsoluteStyle => {
    // oklch(lightness chroma hue);
    const xxx = autoContrast(a.lightness, b.contrast)
    const lightness = xxx /* a.lightness */
    const chroma = clamp(b.chroma ?? a.chroma * (b.chromaBlend ?? 1), 0, 0.4)

    const hue = b.hue ?? a.hue + (b.hueShift ?? 0)
    return { type: 'absolute', lightness, chroma, hue }
}

export function autoContrast(
    //
    lightness: number,
    contrast: number,
) {
    /* This slightly favors using the darker color by adding a small float to ensure we always have -1/1 from Math.sign */
    const start = lightness
    const end = Math.round(lightness) - Math.sign(lightness - 0.5 + 0.00001)
    return start * (1 - contrast) + end * contrast
}
