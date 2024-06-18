import Color from 'colorjs.io'

import { Kolor } from './OKLCH'

export function getLCHFromString(str: string): Kolor {
    try {
        const color = new Color(str)
        const [l, c, h] = color.oklch
        return new Kolor(l!, c!, isNaN(h!) ? 0 : h!)
    } catch (e) {
        console.error(`[🔴] getLCHFromString FAILURE (string is: "${str}")`)
        return new Kolor(0.5, 0.1, 0)
    }
}
