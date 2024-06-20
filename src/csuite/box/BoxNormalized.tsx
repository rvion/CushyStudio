import type { Tint } from '../kolor/Tint'
import type { Box } from './Box'

import { Kolor } from '../kolor/Kolor'
import { clamp } from '../utils/clamp'

export type BoxNormalized = {
    base?: Tint //       BASE              (relative to its parent's BASE)
    hover?: Tint //      BASE when hovered (relative to its parent's BASE)
    text?: Tint //       relative to BASE
    shock?: Tint //      relative to BASE
    border?: Tint //     relative to BASE
    textShadow?: Tint // relative to BASE
    shadow?: Tint //     relative to BASE
}

export function normalizeBox(box: Box): BoxNormalized {
    const out: BoxNormalized = {}
    if (box.base != null) out.base = _normalizeTint(box.base)
    if (box.hover != null) out.hover = _normalizeTint(box.hover)
    if (box.shock != null) out.shock = _normalizeTint(box.shock)
    if (box.text != null) out.text = _normalizeTint(box.text)
    if (box.textShadow != null) out.textShadow = _normalizeTint(box.textShadow)
    if (box.shadow != null) out.shadow = _normalizeTint(box.shadow)
    if (box.border != null) out.border = _normalizeTint(box.border)
    return out
}

function _normalizeTint(
    //
    tint: Tint | string | number | boolean,
): Tint {
    if (typeof tint === 'boolean') return { contrast: tint ? /* 0.2 */ 0.03 : 0 }
    if (typeof tint === 'number') return { contrast: clamp(tint / 100, 0, 1) }
    if (typeof tint === 'string') return Kolor.fromString(tint)
    return tint
}
