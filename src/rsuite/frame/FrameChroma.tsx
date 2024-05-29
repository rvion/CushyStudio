import { FrameAppearance } from './FrameAppearance'

export function getChroma(p: {
    //
    active: Maybe<boolean>
    isDisabled: Maybe<boolean>
    appearance: Maybe<FrameAppearance>
}) {
    if (p.isDisabled) return undefined
    if (p.active) return 0.1
    if (p.appearance === 'primary') return 0.2
    if (p.appearance === 'secondary') return 0.1
    return
}
