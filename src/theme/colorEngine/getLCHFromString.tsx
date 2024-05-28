import type { CompiledStyle } from './AbsoluteStyle'

import Color from 'colorjs.io'

export function getLCHFromString(str: string): CompiledStyle {
    const color = new Color(str)
    const [l, c, h] = color.oklch
    return {
        lightness: l!,
        chroma: c!,
        hue: isNaN(h!) ? 0 : h!,
    }
}
