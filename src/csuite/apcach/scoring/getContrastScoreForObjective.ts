import type { ContrastConfig_PREPARED } from '../contrast/contrastConfig'
import { calcContrastFromPreparedColors } from '../calc/calcContrastFromPreparedColors'
import { ColorSpace, type RGB_or_P3 } from '../types'
import { blendCompColors } from '../utils/misc'

export function getContrastScoreForObjective(
    /** color you want to s core */
    color: RGB_or_P3,

    /** target objective */
    contrastConfig: ContrastConfig_PREPARED,

    colorSpace: ColorSpace,
) {
    // Deside the position of the color
    let fgColor: RGB_or_P3
    let bgColor: RGB_or_P3

    if (contrastConfig.apcachIsOnFg) {
        bgColor = contrastConfig.colorAntagonist
        fgColor = blendCompColors(color, bgColor)
    } else {
        fgColor = contrastConfig.colorAntagonist
        bgColor = color
    }

    // Caclulate contrast
    const contrast = calcContrastFromPreparedColors(
        fgColor,
        bgColor,
        contrastConfig.contrastModel,
        colorSpace,
    )

    return Math.abs(contrast)
}
