import { createContext } from 'react'

/** oklch */

// TODO: rename oklch
export type CompiledStyle = {
    /** 0 to 1 */
    lightness: number
    /** 0 to 1 */
    chroma: number
    /** 0 to 360 or -180 to 180 */
    hue: number
}

/** contrast+accent bleed + hue shift */
export type RelativeStyle = {
    /**
     * -1 to 1
     * eg. 0 for background from parent bg
     * eg. 1 for text to it's background
     * */
    contrast?: number
    lightness?: number

    /**
     * 0 to 1
     * multiplier for chroma (saturation)
     * how much colorfulness to retain from the background
     */
    chromaBlend?: number
    chroma?: number

    /** 0 to 360 */
    hueShift?: number
    hue?: number

    /** TBD */
    opacity?: number
    opacityBlend?: number
}

// export type Appearance = {
//     background: RelativeStyle | AbsoluteStyle
//     text: RelativeStyle | AbsoluteStyle
//     shadow: Maybe<RelativeStyle | AbsoluteStyle>
//     border: Maybe<RelativeStyle | AbsoluteStyle>
// }

export const ThemeCtx = createContext<{
    background: CompiledStyle
    text: RelativeStyle // | CompiledStyle
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    shiftDirection?: 'pos' | 'neg'
}>({
    background: {
        // type: 'absolute',
        lightness: 0.1,
        chroma: 0.05,
        hue: 0,
    },
    text: {
        contrast: 1,
        chromaBlend: 0,
        hueShift: 0,
    },
    // text: { type: 'absolute', lightness: 0, chroma: 0.5, hue: 180, },
    // shadow: null,
    // border: null,
})
