// @ts-ignore 🔴
import { inGamut } from 'culori'

import { Apcach } from '../apcach/apcach'
import { convertToOklch_orThrow } from './culoriUtils'
import { log } from '../utils/log'
import { isValidApcach } from '../apcach/isValidApcach'
import { apcachToCss } from '../convert/apcachToCss'

export function inColorSpace(
    //
    color: string | Apcach,
    colorSpace = 'p3',
) {
    colorSpace = colorSpace === 'srgb' ? 'rgb' : colorSpace
    if (isValidApcach(color)) {
        let colorCopy = Object.assign({}, color)
        colorCopy.lightness = colorCopy.lightness === 1 ? 0.9999999 : colorCopy.lightness // Fixes wrons inGumut calculation
        let cssColor = apcachToCss(colorCopy, 'oklch')
        return inGamut(colorSpace)(cssColor)
    } else {
        let oklch = convertToOklch_orThrow(color)
        log('culori > convertToOklch /// 307')
        oklch.l = oklch.l === 1 ? 0.9999999 : oklch.l // Fixes wrons inGumut calculation

        return inGamut(colorSpace)(oklch)
    }
}
