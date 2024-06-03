import type { Kolor } from '../kolor/Kolor'
import type { OKLCH } from '../kolor/OKLCH'

import { createContext } from 'react'

export type CurrentStyle = {
    base: OKLCH
    text: Kolor
    dir: 1 | -1
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
}

export const CurrentStyleCtx = createContext<CurrentStyle>({
    base: { lightness: 0.1, chroma: 0.05, hue: 0 },
    text: { contrast: 1, chromaBlend: 0, hueShift: 0 },
    dir: 1,
    // text: { type: 'absolute', lightness: 0, chroma: 0.5, hue: 180, },
    // shadow: null,
    // border: null,
})

// export type Appearance = {
//     background: RelativeStyle | AbsoluteStyle
//     text: RelativeStyle | AbsoluteStyle
//     shadow: Maybe<RelativeStyle | AbsoluteStyle>
//     border: Maybe<RelativeStyle | AbsoluteStyle>
// }
