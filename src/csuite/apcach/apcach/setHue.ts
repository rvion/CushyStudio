import { Apcach, apcach } from './apcach'
import { HueExpr } from '../types'
import { clipHue } from '../utils/misc'

export function setHue(
    //
    colorInApcach: Apcach,
    h: HueExpr,
): Apcach {
    let newHue: number
    if (typeof h === 'number') {
        newHue = clipHue(h)
    } else if (typeof h === 'function') {
        let newRawHue = h(colorInApcach.hue)
        newHue = clipHue(newRawHue)
    } else {
        throw new Error('Invalid format of hue value')
    }
    return apcach(
        colorInApcach.contrastConfig,
        colorInApcach.chroma,
        newHue,
        colorInApcach.alpha,
        colorInApcach.colorSpace,
    )
}
