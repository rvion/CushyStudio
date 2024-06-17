import type { ContrastConfig, ContrastConfig_Ext } from '../contrast/contrastConfig'
import type { ColorSpace } from '../types'
import type { MaxChromaFn } from './maxChroma'

import { contrastToConfig } from '../contrast/contrastToConfig'
import { isValidContrast } from '../contrast/isValidContrast'
import { prepareContrastConfig } from '../contrast/prepareContrastConfig'
import { lightnessFromAntagonist } from '../light/lightnessFromAntagonist'
import { calcLightness } from '../scoring/calcLightness'

export type Apcach = {
    lightness: number
    chroma: number
    hue: number
    alpha: number
    contrastConfig: ContrastConfig
    colorSpace: ColorSpace
}

export function apcach(
    //
    contrast: ContrastConfig_Ext,
    chroma: number | MaxChromaFn,
    /** 0 to 100 */
    hue: number | string = 0,
    alpha: number = 100,
    colorSpace: ColorSpace = 'p3',
): Apcach {
    // normalize for hue
    hue = typeof hue === 'number' ? hue : parseFloat(hue)

    // Compose contrast config
    const contrastConfig: ContrastConfig = contrastToConfig(contrast)

    // CASE A. Max chroma case
    // maxChroma() has been passed instead of a static value
    // we need finding the most saturated color with given hue and contrast ratio
    if (typeof chroma === 'function') return chroma(contrastConfig, hue, alpha, colorSpace)

    // CASE B. Constant chroma case
    // APCA has a cut off at the value about 8, wcag has a cut off at 1
    const validContrast = isValidContrast(contrastConfig.cr, contrastConfig.contrastModel)
    const lightness = validContrast
        ? calcLightness(prepareContrastConfig(contrastConfig, colorSpace), chroma, hue, colorSpace)
        : lightnessFromAntagonist(contrastConfig)
    return { lightness, chroma, hue, alpha, colorSpace, contrastConfig }
}
