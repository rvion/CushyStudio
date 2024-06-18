import Color from 'colorjs.io'

import { OKLCH } from './OKLCH'

export function getLCHFromString(str: string): OKLCH {
    try {
        const color = new Color(str)
        const [l, c, h] = color.oklch
        return new OKLCH(l!, c!, isNaN(h!) ? 0 : h!)
    } catch (e) {
        console.error(`[🔴] getLCHFromString FAILURE (string is: "${str}")`)
        return new OKLCH(0.5, 0.1, 0)
    }
}
