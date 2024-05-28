import { FrameProps } from './Frame'

// HIGH LEVEL THEME-DEFINED BOX STYLES
export type FrameAppearanceFlags = {
    appearance?: FrameAppearance
    /** no visual distinction; equivalent to appearance='headless' */
    headless?: boolean
    /** no border, very low contrast; equivalent to appearance='subtle' */
    subtle?: boolean
    /** small border, low contrast; equivalent to appearance='default' */
    default?: boolean
    /** a.k.a. outline: border but no contrast; equivalent to appearance='ghost' */
    ghost?: boolean
    /** panel or modal primary action; usually more chroma, more contrast; equivalent to appearance='primary' */
    primary?: boolean
    /** panel or modal secondary action; equivalent to appearance='secondary' */
    secondary?: boolean
}

export type FrameAppearance =
    /** no visual distinction */
    | 'headless'

    /** no border, very low contrast */
    | 'subtle'

    /** low contrast border, low contrast background */
    | 'default'

    /** a.k.a. outline: border but no contrast */
    | 'ghost'

    /** panel or modal primary action; usually more chroma, more contrast */
    | 'primary'

    /** panel or modal secondary action */
    | 'secondary'

export function getAppearance(p: FrameProps): FrameAppearance {
    // boolean props
    if (p.headless) return 'headless'
    if (p.subtle) return 'subtle'
    if (p.default) return 'default'
    if (p.ghost) return 'ghost'
    if (p.primary) return 'primary'
    if (p.secondary) return 'secondary'

    // generic prop
    if (p.appearance) return p.appearance

    // default
    return 'default'
}
