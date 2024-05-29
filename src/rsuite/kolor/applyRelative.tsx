import type { Kolor } from './Kolor'
import type { OKLCH } from './OKLCH'

import { clamp } from '../../controls/widgets/list/clamp'
import { getLCHFromString } from './getLCHFromString'

export const applyKolorToOKLCH = (a: OKLCH, b: Kolor): OKLCH => {
    const lightness = b.lightness ?? _autoContrast(a.lightness, b.contrast ?? 0)
    const chroma = clamp(b.chroma ?? a.chroma * (b.chromaBlend ?? 1), 0, 0.4)
    const hue = b.hue //
        ? typeof b.hue === 'string'
            ? getLCHFromString(b.hue).hue
            : b.hue
        : a.hue + (b.hueShift ?? 0)
    return { /* type: 'absolute', */ lightness: lightness, chroma: chroma, hue: hue }
}

function _autoContrast(
    //
    lightness: number,
    contrast: number,
) {
    /*
     * This slightly favors using the darker color by adding a small
     * float to ensure we always have -1/1 from Math.sign
     */
    const start = lightness
    const dir = Math.sign(0.5 - lightness - 0.00001)
    const final = start + dir * contrast
    return clamp(final, 0, 1)
}

// function _autoContrast_v1(
//     //
//     lightness: number,
//     contrast: number,
// ) {
//     const start = lightness
//     const end = Math.round(lightness) - Math.sign(lightness - 0.5 + 0.00001)
//     return start * (1 - contrast) + end * contrast
// }
