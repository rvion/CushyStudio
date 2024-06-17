import type { Color, P3, Rgb } from 'culori'
import type { ColorSpace, ContrastModel } from '../types'

import { convertToP3, convertToRgb } from './culoriUtils'
import { log } from '../utils/log'

export function colorToComps(
    //
    color: Color,
    contrastModel: ContrastModel,
    colorSpace: ColorSpace,
): P3 | Rgb {
    if (
        contrastModel === 'apca' && //
        colorSpace === 'p3'
    ) {
        log('culori > convertToP3 /// colorToComps')
        return convertToP3(color)
    } else {
        log('culori > convertToRgb /// colorToComps')
        return convertToRgb(color)
    }
}
