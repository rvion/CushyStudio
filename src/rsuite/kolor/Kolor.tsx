import type { NumberVar } from '../theme/CSSVar'

// prettier-ignore
export type Kolor = {
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
export type KolorExt =
    /** absolute color */
    | string

    /** contrast: number%, chromaBlend: 1, hueShift: 0  */
    | number

    /** contrast: 20%, chromaBlend: 1, hueShift: 0 */
    | boolean

    /** extended color where every prop can ben a CSSVars */
    |  Kolor
// {
//     /**
//      * -1 to 1
//      * eg. 0 for background from parent bg
//      * eg. 1 for text to it's background
//      * */
//     contrast?:     number | CSSVar
//     lightness?:    number | CSSVar

//     /**
//      * 0 to 1
//      * multiplier for chroma (saturation)
//      * how much colorfulness to retain from the background
//      */
//     chromaBlend?:  number | CSSVar
//     chroma?:       number | CSSVar

//     /** 0 to 360 */
//     hueShift?:     number | CSSVar
//     hue?:          number | CSSVar

//     /** TBD */
//     opacity?:      number | CSSVar
//     opacityBlend?: number | CSSVar
// }
