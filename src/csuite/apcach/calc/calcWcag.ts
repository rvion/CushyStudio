import type { RGB_or_P3 } from '../types'

import { rgb, type RGBColor } from 'wcag-contrast'
import { rgb1to256 } from '../utils/rgb1to256'

/**
 * Get a score for the contrast between two PreparedColor
 */
export function calcWcag(
    //
    fgRgb: RGB_or_P3,
    bgRgb: RGB_or_P3,
) {
    // Compose arrays
    const fgArray: RGBColor = [
        //
        rgb1to256(fgRgb.r),
        rgb1to256(fgRgb.g),
        rgb1to256(fgRgb.b),
    ] as const

    const bgArray: RGBColor = [
        //
        rgb1to256(bgRgb.r),
        rgb1to256(bgRgb.g),
        rgb1to256(bgRgb.b),
    ] as const

    return rgb(fgArray, bgArray)
}
