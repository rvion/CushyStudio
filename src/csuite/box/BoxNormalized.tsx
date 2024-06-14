import type { Kolor } from '../kolor/Kolor'
import type { Box } from './Box'

import { clamp } from '../../controls/utils/clamp'
import { getLCHFromString } from '../kolor/getLCHFromString'

export type BoxNormalized = {
    base?: Kolor //       BASE              (relative to its parent's BASE)
    hover?: Kolor //      BASE when hovered (relative to its parent's BASE)
    text?: Kolor //       relative to BASE
    shock?: Kolor //      relative to BASE
    border?: Kolor //     relative to BASE
    textShadow?: Kolor // relative to BASE
    shadow?: Kolor //     relative to BASE
}

export function normalizeBox(box: Box): BoxNormalized {
    const out: BoxNormalized = {}
    if (box.base != null) out.base = _normalizeKolor(box.base)
    if (box.hover != null) out.hover = _normalizeKolor(box.hover)
    if (box.shock != null) out.shock = _normalizeKolor(box.shock)
    if (box.text != null) out.text = _normalizeKolor(box.text)
    if (box.textShadow != null) out.textShadow = _normalizeKolor(box.textShadow)
    if (box.shadow != null) out.shadow = _normalizeKolor(box.shadow)
    if (box.border != null) out.border = _normalizeKolor(box.border)
    return out
}

function _normalizeKolor(
    //
    kolor: Kolor | string | number | boolean,
): Kolor {
    if (typeof kolor === 'boolean') return { contrast: kolor ? /* 0.2 */ 0.03 : 0 }
    if (typeof kolor === 'number') return { contrast: clamp(kolor / 100, 0, 1) }
    if (typeof kolor === 'string') return getLCHFromString(kolor)
    return kolor
}
