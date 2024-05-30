import type { OKLCH } from './OKLCH'

import Color from 'colorjs.io'

export function getLCHFromString(str: string): OKLCH {
    const color = new Color(str)
    const [l, c, h] = color.oklch
    return {
        lightness: l!,
        chroma: c!,
        hue: isNaN(h!) ? 0 : h!,
    }
}