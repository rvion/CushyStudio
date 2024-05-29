/** contrast+accent bleed + hue shift */

export type Kolor = {
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
    // when hue is string => extract its hue via new Color(str).olkch.hue
    hue?: number | string

    /** TBD */
    opacity?: number
    opacityBlend?: number
}
