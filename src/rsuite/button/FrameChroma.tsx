import { FrameAppearance } from './FrameAppearance'

export function getChroma(p: {
    //
    active: Maybe<boolean>
    isDisabled: Maybe<boolean>
    primary: Maybe<boolean>
    appearance: Maybe<FrameAppearance>
}) {
    if (p.active) return 0.1
    if (p.isDisabled) return // 0.001
    if (p.primary || p.appearance === 'primary') return 0.1
    return
    // if (appearance === 'none') return undefined
    // if (appearance === 'ghost') return 0
    // if (appearance === 'link') return 0
    // if (appearance === 'default') return 0.1
    // if (appearance === 'subtle') return 0
    // if (appearance == null) return 0.05
    // exhaust(appearance)
    // return 0.1
}
