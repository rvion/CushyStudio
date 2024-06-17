import type { Color } from 'culori'

import { inP3, toP3 } from '../culori-utils/culoriUtils'
import { log } from '../utils/log'

export function clampColorToP3(
    //
    color: Color, // | ColorInCSSFormat,
): Color {
    log('culori > inP3 /// clampColorToSpace')

    // if already in p3, return it as-is
    // 🔶 can return color in `ColorInCSSFormat `
    if (inP3(color)) return color

    // otherwise, convert to oklch, then to p3
    // ⏸️let oklch
    // ⏸️if (colorInCssFormat.slice(4) === 'oklch') {
    // ⏸️    oklch = colorInCssFormat
    // ⏸️} else {
    // ⏸️    oklch = convertToOklch_orThrow(colorInCssFormat)
    // ⏸️    log('culori > convertToOklch /// 394')
    // ⏸️    oklch = healOklch(oklch)
    // ⏸️}
    // Clamp color to p3 gamut
    log('culori > toGamut(p3)')
    return toP3(color)
}
