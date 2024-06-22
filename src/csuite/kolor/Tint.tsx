import type { NumberVar } from '../tinyCSS/CSSVar'

import { clamp } from '../utils/clamp'
import { Kolor } from './Kolor'

// prettier-ignore
export type Tint = {
    /**
     * -1 to 1
     * eg. 0 for background from parent bg
     * eg. 1 for text to it's background
     * */
    contrast?:     number | NumberVar
    lightness?:    number | NumberVar

    /**
     * 0 to 1
     * multiplier for chroma (saturation)
     * how much colorfulness to retain from the background
     */
    chromaBlend?:  number | NumberVar
    chroma?:       number | NumberVar

    /** 0 to 360 */
    hueShift?:     number | NumberVar
    hue?:          number | NumberVar

    /** TBD */
    opacity?:      number | NumberVar
    opacityBlend?: number | NumberVar
}

// prettier-ignore
export type TintExt =
    /** absolute color */
    | string

    /** contrast: number%, chromaBlend: 1, hueShift: 0  */
    | number

    /** contrast: 20%, chromaBlend: 1, hueShift: 0 */
    | boolean

    /** extended color where every prop can ben a CSSVars */
    |  Tint

    | null
    | undefined

export function normalizeTint(tint: TintExt): Tint {
    if (tint == null) return {}
    if (typeof tint === 'boolean') return { contrast: tint ? /* 0.2 */ 0.08 : 0 }
    if (typeof tint === 'number') return { contrast: clamp(tint / 100, 0, 1) }
    if (typeof tint === 'string') return Kolor.fromString(tint)
    return tint
}
