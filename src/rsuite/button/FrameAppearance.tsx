import { FrameProps } from './Frame'

// HIGH LEVEL THEME-DEFINED BOX STYLES
export type FrameAppearanceFlags = {
    look?: FrameAppearance
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
    return p.look ?? 'headless'
}
