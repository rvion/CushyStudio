import type { Tint } from '../kolor/Tint'

import { createContext } from 'react'

import { Kolor } from '../kolor/Kolor'

/** the react-side theming context that travels with every widget,
 * so we always know the surrounding lightness / chroma / hue.
 * 2024-06-03 rvion: I wish it could be done at the CSS level, but haven't
 * found a way to do it yet.
 */
export type CurrentStyle = {
    base: Kolor
    // baseH: OKLCH
    text: Tint
    noColorStuff?: boolean
    dir?: 1 | -1
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
}

export const defaultTextTint: Tint = {
    contrast: 1,
    chromaBlend: 0,
    hueShift: 0,
}

export const CurrentStyleCtx = createContext<CurrentStyle>({
    base: new Kolor(0.1, 0.05, 0),
    text: defaultTextTint,
    dir: 1,
    /**
     * if we want to handle that though CSS, it HAS to always be present
     * so we can seamlessly switch to it, when any part of the tree becomes hovered;
     *
     * potential problems
     * 🔶 it may not handle properly Reveals:
     *       => 2024-06-03 rvion: I think we should be good to go to force override
     *          the revealed content context to the base non-hovered color in every
     *          situation; should be the safest option to assumem hover must be
     *          computed from the last DOM root only
     */
})

// 💬 2024-06-03 rvion:
// those are not required to travel in the context, as they're not inherited
// only the base is since all computation are not derived from it.
// | text: { type: 'absolute', lightness: 0, chroma: 0.5, hue: 180, },
// | shadow: null,
// | border: null,
