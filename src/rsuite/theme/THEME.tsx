import type { Box } from '../box/Box'

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
    labelText?: Kolor
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    shiftDirection?: 1 | -1
    primary: Box
    // -------------
    // high-level theme concepts
    // subtle: Box
    // default: Box
    // strong: Box
    // -------------------
    // ghost: Box
    // secondary: Box
}
