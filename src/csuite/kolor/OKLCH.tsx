export type OKLCH = {
    /** 0 to 1 */
    lightness: number
    /** 0 to 1 */
    chroma: number
    /** 0 to 360 or -180 to 180 */
    hue: number
}

export const isSameOKLCH = (a: OKLCH, b: OKLCH) => {
    if (a.lightness !== b.lightness) return false
    if (a.chroma !== b.chroma) return false
    if (a.hue !== b.hue) return false
    return true
}
