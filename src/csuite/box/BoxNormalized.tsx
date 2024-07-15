import type { Box } from './Box'

import { normalizeTint, type Tint, type TintExt } from '../kolor/Tint'

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
    if (box.base != null) out.base = normalizeTint(box.base)
    if (box.hover != null) out.hover = normalizeTint(box.hover)
    if (box.shock != null) out.shock = normalizeTint(box.shock)
    if (box.text != null) out.text = normalizeTint(box.text)
    if (box.textShadow != null) out.textShadow = normalizeTint(box.textShadow)
    if (box.shadow != null) out.shadow = normalizeTint(box.shadow)
    if (box.border != null) out.border = normalizeTint(box.border)
    return out
}
