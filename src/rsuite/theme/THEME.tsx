import type { BoxProps } from '../box/BoxProps'

import { Kolor } from '../kolor/Kolor'
import { OKLCH } from '../kolor/OKLCH'

/**
 * this object holds the whole theme for the whole system
 * */
export type THEME = {
    // -----------
    // base colors
    base: OKLCH
    // accent1: Kolor
    // accent2: Kolor
    // ---------
    text: Kolor
    // ----------
    // misc:
    labelText: Kolor
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    shiftDirection?: 'pos' | 'neg'
    // -------------
    // high-level theme concepts
    subtle: BoxProps
    default: BoxProps
    strong: BoxProps
    // -------------------
    ghost: BoxProps
    primary: BoxProps
    secondary: BoxProps
}
