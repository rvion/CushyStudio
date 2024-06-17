import { Apcach, apcach } from './apcach'
import { clipChroma } from '../utils/misc'

export function setChroma(
    //
    apc: Apcach,
    c: number | ((chroma: number) => number),
): Apcach {
    let newChroma: number
    if (typeof c === 'number') {
        newChroma = clipChroma(c)
    } else if (typeof c === 'function') {
        let newRawChroma = c(apc.chroma)
        newChroma = clipChroma(newRawChroma)
    } else {
        throw new Error('Invalid format of chroma value')
    }

    return apcach(
        //
        apc.contrastConfig,
        newChroma,
        apc.hue,
        apc.alpha,
        apc.colorSpace,
    )
}
