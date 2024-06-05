import type { Box } from '../box/Box'

import { Kolor } from '../kolor/Kolor'
import { OKLCH } from '../kolor/OKLCH'
import { type NumberVar } from './CSSVar'

/**
 * this object holds the whole theme for the whole system
 * */
export type THEME = {
    inputBorder: NumberVar<'input-border'>
    // -----------
    // base colors
    base: OKLCH
    text: Kolor
    // misc:
    labelText?: Kolor
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    shiftDirection?: 1 | -1
    primary: Box
}
