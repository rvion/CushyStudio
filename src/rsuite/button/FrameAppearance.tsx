import { FrameProps } from './Frame'

export type FrameAppearance =
    /** no visual distinction */
    | 'headless'

    /** no border, very low contrast */
    | 'subtle'

    /** low contrast border, low contrast background */
    | 'default'

    /** a.k.a. outline: border but no contrast */
    | 'ghost'

    /** for readonly stuff */
    | 'link'

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
    if (p.link) return 'link'
    if (p.primary) return 'primary'
    if (p.secondary) return 'secondary'

    // generic prop
    if (p.appearance) return p.appearance

    // default
    return 'default'
}
