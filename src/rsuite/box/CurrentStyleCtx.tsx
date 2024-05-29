import { createContext } from 'react'

import { Kolor } from '../kolor/Kolor'
import { OKLCH } from '../kolor/OKLCH'

export type CurrentStyle = {
    background: OKLCH
    text: Kolor
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    shiftDirection?: 'pos' | 'neg'
}

export const CurrentStyleCtx = createContext<CurrentStyle>({
    background: { lightness: 0.1, chroma: 0.05, hue: 0 },
    text: { contrast: 1, chromaBlend: 0, hueShift: 0 },
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
