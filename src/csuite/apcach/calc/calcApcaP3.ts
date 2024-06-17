import type { RGB_or_P3 } from '../types'

import { APCAcontrast, displayP3toY } from 'apca-w3'
import { ASSERT_NUMBER } from '../utils/assert'

/**
 * return the `Lc` (lightness contrast)
 * as a numeric value within ± 127
 */
export function calcApcaP3(
    //
    fgP3: RGB_or_P3,
    bgP3: RGB_or_P3,
): number {
    // Calculate Y
    let fgY = displayP3toY([
        //
        Math.max(fgP3.r, 0),
        Math.max(fgP3.g, 0),
        Math.max(fgP3.b, 0),
    ])

    let bgY = displayP3toY([
        //
        Math.max(bgP3.r, 0),
        Math.max(bgP3.g, 0),
        Math.max(bgP3.b, 0),
    ])

    return ASSERT_NUMBER(APCAcontrast(fgY, bgY))
}
