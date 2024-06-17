import type { ColorSpace, ColorInCSSFormat, ContrastModel, RGB_or_P3 } from '../types'
import type { Color, P3, Rgb } from 'culori'

import { calcContrastFromPreparedColors } from '../calc/calcContrastFromPreparedColors'
import { clampColorToSpace } from '../clamp/clampColorToSpace'
import { blendCompColors } from '../utils/misc'
import { colorToComps } from '../culori-utils/colorToComps'

export function calcContrast(
    fgColor: Color,
    bgColor: Color,
    contrastModel: ContrastModel = 'apca',
    colorSpace: ColorSpace = 'p3',
) {
    // Background color
    let bgColorClamped: Color = clampColorToSpace(bgColor, colorSpace)
    let bgColorComps: P3 | Rgb = colorToComps(bgColorClamped, contrastModel, colorSpace)

    // Foreground color
    let fgColorClamped: Color = clampColorToSpace(fgColor, colorSpace)
    let fgColorComps: RGB_or_P3 = colorToComps(fgColorClamped, contrastModel, colorSpace)
    fgColorComps = blendCompColors(fgColorComps, bgColorComps)

    // Caclulate contrast
    const contrast = calcContrastFromPreparedColors(
        //
        fgColorComps,
        bgColorComps,
        contrastModel,
        colorSpace,
    )

    return Math.abs(contrast)
}
