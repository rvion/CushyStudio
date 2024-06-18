import type { Tint } from './Tint'

// bad lib; todo: rewrite it
import Color from 'colorjs.io'

import { clamp } from '../../controls/utils/clamp'
import { getNum } from '../tinyCSS/CSSVar'

export class Kolor implements Tint {
    static fromString = (str: string): Kolor => {
        try {
            const color = new Color(str)
            const [l, c, h] = color.oklch
            return new Kolor(l!, c!, isNaN(h!) ? 0 : h!)
        } catch (e) {
            console.error(`[🔴] getLCHFromString FAILURE (string is: "${str}")`)
            return new Kolor(0.5, 0.1, 0)
        }
    }

    constructor(
        /** 0 to 1 */
        public lightness: number,
        /** 0 to 1 */
        public chroma: number,
        /** 0 to 360 or -180 to 180 */
        public hue: number,
        /** 0 to 1 */
        public opacity = 1,
    ) {}

    toOKLCH = (): string => {
        const l = clamp(this.lightness, 0.0001, 0.9999).toFixed(3)
        const c = this.chroma.toFixed(3)
        const h = this.hue.toFixed(3)
        return `oklch(${l} ${c} ${h})`
    }

    /** true if strictly same values */
    isSame = (b: Kolor): boolean => {
        if (this.lightness !== b.lightness) return false
        if (this.chroma !== b.chroma) return false
        if (this.hue !== b.hue) return false
        return true
    }

    tint = (b?: Maybe<Tint>): Kolor => {
        if (b == null) return this
        const lightness = getNum(b.lightness) ?? this._autoContrast(this.lightness, getNum(b.contrast, 0))
        const chroma = getNum(b.chroma) ?? this.chroma * getNum(b.chromaBlend, 1)
        const hue = getNum(b.hue) ?? this.hue + getNum(b.hueShift, 0)
        return new Kolor(lightness, clamp(chroma, 0, 0.4), hue)
    }

    /*
     * 🔴 WAY TOO NAIVE => rewrite later
     * This slightly favors using the darker color by adding a small
     * float to ensure we always have -1/1 from Math.sign
     */
    private _autoContrast(lightness: number, contrast: number): number {
        const start = lightness
        const dir = Math.sign(0.5 - lightness - 0.00001)
        const final = start + dir * contrast
        return clamp(final, 0, 1)
    }
}
