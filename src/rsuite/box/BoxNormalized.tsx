import type { Kolor } from '../kolor/Kolor'
import type { Box } from './Box'

import { clamp } from '../../controls/utils/clamp'
import { getLCHFromString } from '../kolor/getLCHFromString'

export type BoxNormalized = {
    base: Kolor | null //       BASE              (relative to its parent's BASE)
    hover: Kolor | null //      BASE when hovered (relative to its parent's BASE)

    text: Kolor | null //       relative to BASE
    border: Kolor | null //     relative to BASE
    textShadow: Kolor | null // relative to BASE
    shadow: Kolor | null //     relative to BASE
}

export function extractNormalizeBox(box: Box): BoxNormalized {
    return {
        base: normalizeBoxKolor(box.base),
        hover: normalizeBoxKolor(box.hover),
        // ----------
        text: normalizeBoxKolor(box.text),
        textShadow: normalizeBoxKolor(box.textShadow),
        shadow: normalizeBoxKolor(box.shadow),
        border: normalizeBoxKolor(box.border),
    }
}

export function normalizeBoxKolor(
    //
    kolor: Kolor | string | number | boolean | undefined,
): Kolor | null {
    if (kolor == null) return null
    if (typeof kolor === 'boolean') return { contrast: kolor ? /* 0.2 */ 0.03 : 0 }
    if (typeof kolor === 'number') return { contrast: clamp(kolor / 100, 0, 1) }
    if (typeof kolor === 'string') return getLCHFromString(kolor)
    return kolor
}
