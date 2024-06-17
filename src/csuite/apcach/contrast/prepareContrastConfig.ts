import type { Color, Oklch, P3, Rgb } from 'culori'
import { TO_FIND, type ContrastConfig, type ContrastConfig_PREPARED } from './contrastConfig'

import { ColorSpace } from '../types'
import { clampColorToSpace } from '../clamp/clampColorToSpace'
import { colorToComps } from '../culori-utils/colorToComps'

// TODO: finish cleaning this function
export function prepareContrastConfig(
    contrastConfig: ContrastConfig,
    colorSpace: ColorSpace,
): ContrastConfig_PREPARED {
    const { bgColor, fgColor, contrastModel, searchDirection } = contrastConfig
    const apcachIsOnFg: boolean = fgColor === TO_FIND

    const colorAntagonistOriginal: Oklch = apcachIsOnFg //
        ? (bgColor as Oklch)
        : (fgColor as Oklch)

    const colorAntagonistClamped: Color = clampColorToSpace(colorAntagonistOriginal, colorSpace)
    const colorAntagonist: P3 | Rgb = colorToComps(colorAntagonistClamped, contrastModel, colorSpace)

    // Drop alpha if antagonist is on bg
    if (apcachIsOnFg) colorAntagonist.alpha = 1

    const config: ContrastConfig_PREPARED = {
        cr: contrastConfig.cr,
        contrastModel,
        searchDirection,
        apcachIsOnFg,
        colorAntagonist,
    }

    // 💬 2024-06-17 rvion: patching is a bit dangerous
    // we should probably return an other object here
    return config
}
