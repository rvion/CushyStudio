export class Kolor {
    // lightness: number
    // chroma: number
    // hue: number
    constructor(
        /** 0 to 1 */
        public lightness: number,
        /** 0 to 1 */
        public chroma: number,
        /** 0 to 360 or -180 to 180 */
        public hue: number,
    ) {}

    /** true if strictly same values */
    isSame = (b: Kolor): boolean => {
        if (this.lightness !== b.lightness) return false
        if (this.chroma !== b.chroma) return false
        if (this.hue !== b.hue) return false
        return true
    }
}
