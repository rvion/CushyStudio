/** return any color in oklch notation */

import { Color_ } from './Color_'

export function getLCHFromStringAsString(str: string): string {
    try {
        const color = new Color_(str)
        const [l, c, h_] = color.oklch
        const h = isNaN(h_!) ? 0 : h_
        return `lch(${fmtNum1(l! * 100)}% ${fmtNum2(c!)} ${fmtNum1(h!)})`
    } catch (e) {
        console.error(`[🔴] getLCHFromStringAsString FAILURE (string is: "${str}")`)
        return `lch(.5 1 0)`
    }
}

/** toFixed(2), but without the uncesseray leading 0 */
const fmtNum2 = (n: number) => {
    const s = n.toFixed(2)
    return s.endsWith('.00') //
        ? s.slice(0, -3)
        : s.endsWith('0')
        ? s.slice(0, -1)
        : s
}

/** toFixed(1), but without the uncesseray leading 0 */
const fmtNum1 = (n: number) => {
    const s = n.toFixed(1)
    return s.endsWith('.0') //
        ? s.slice(0, -2)
        : s
}
