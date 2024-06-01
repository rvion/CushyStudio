import type { Kolor } from './Kolor'
import type { OKLCH } from './OKLCH'

import { clamp } from '../../controls/utils/clamp'
import { getNum, type NumberVar } from '../theme/CSSVar'

// prettier-ignore
export const applyKolorToOKLCH = (a: OKLCH, b?: Maybe<Kolor>): OKLCH => {
    if (b == null) return a
    const lightness = getNum(b.lightness) ?? _autoContrast(a.lightness, getNum(b.contrast, 0))
    const chroma    = getNum(b.chroma)    ?? a.chroma * getNum(b.chromaBlend, 1)
    const hue       = getNum(b.hue)       ?? a.hue    + getNum(b.hueShift, 0)
    return { lightness: lightness, chroma: clamp(chroma, 0, 0.4), hue: hue }
}

/*
 * This slightly favors using the darker color by adding a small
 * float to ensure we always have -1/1 from Math.sign
 */
function _autoContrast(lightness: number, contrast: number): number {
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
