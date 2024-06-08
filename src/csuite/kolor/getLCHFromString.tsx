import type { OKLCH } from './OKLCH'

import Color from 'colorjs.io'

export function getLCHFromString(str: string): OKLCH {
    try {
        const color = new Color(str)
        const [l, c, h] = color.oklch
        return {
            lightness: l!,
            chroma: c!,
            hue: isNaN(h!) ? 0 : h!,
        }
    } catch (e) {
        console.error(`[🔴] getLCHFromString FAILURE (string is: "${str}")`)
        return { lightness: 0.5, chroma: 0.1, hue: 0 }
    }
}
