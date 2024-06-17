import { clampChroma, type Color } from 'culori'
import { convertToOklch_orThrow, inSrgb, toSrgb } from '../culori-utils/culoriUtils'
import { log } from '../utils/log'

export function clampColorToSRGB(
    //
    color: Color, // ColorInCSSFormat,
): Color /* | ColorInCSSFormat */ {
    log('culori > inSrgb /// clampColorToSpace')
    if (inSrgb(color)) return color

    return toSrgb(color)
    // ⏸️ return clampChroma(colorInCssFormat, 'rgb')

    // ⏸️ let oklch = convertToOklch_orThrow(colorInCssFormat)
    // ⏸️ log('culori > convertToOklch /// 407')
    // ⏸️
    // ⏸️ oklch = clampChroma(oklch, 'oklch')
    // ⏸️ log('culori > clampChroma /// 409')
    // ⏸️ return oklch
}
