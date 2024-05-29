import type { Kolor } from './Kolor'

/**
 * 🔴 unfinished
 * This function aims to "merge" two Kolor objects by
 * overriding the properties of `a` with the properties of `b`.
 */
export const overrideKolor = (
    //
    a: Kolor | null,
    b: Kolor | null,
): Kolor | undefined => {
    if (a == null && b == null) return
    if (a == null) return b!
    if (b == null) return a
    return { ...a, ...b }
}
