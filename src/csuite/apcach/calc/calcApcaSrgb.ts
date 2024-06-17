import { APCAcontrast, sRGBtoY } from 'apca-w3'
import type { RGB_or_P3 } from '../types'
import { ASSERT_NUMBER } from '../utils/assert'

/**
 * return the `Lc` (lightness contrast)
 * as a numeric value within ± 127
 */
export function calcApcaSrgb(
    //
    fgRgb: RGB_or_P3,
    bgGrb: RGB_or_P3,
): number {
    // Calculate Y
    let fgY = sRGBtoY([
        Math.round(Math.max(fgRgb.r * 255, 0)),
        Math.round(Math.max(fgRgb.g * 255, 0)),
        Math.round(Math.max(fgRgb.b * 255, 0)),
    ])

    let bgY = sRGBtoY([
        Math.round(Math.max(bgGrb.r * 255, 0)),
        Math.round(Math.max(bgGrb.g * 255, 0)),
        Math.round(Math.max(bgGrb.b * 255, 0)),
    ])

    return ASSERT_NUMBER(APCAcontrast(fgY, bgY))
}
