import type { Kolor } from '../kolor/Kolor'

import { getLCHFromString } from '../kolor/getLCHFromString'

export function normalizeBoxText(text: Kolor | string | undefined | null): Kolor | null {
    if (text == null) return null
    if (typeof text === 'string') return getLCHFromString(text)
    return text
}
