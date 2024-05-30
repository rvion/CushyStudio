import type { Kolor } from '../kolor/Kolor'
import type { THEME } from '../theme/THEME'

import { FrameAppearance } from './FrameAppearance'

export function getChroma(p: {
    theme: THEME
    active: Maybe<boolean>
    isDisabled: Maybe<boolean>
    appearance: Maybe<FrameAppearance>
}): Kolor['chroma'] {
    if (p.isDisabled) return undefined
    if (p.active) return 0.1
    if (p.appearance === 'primary')
        return typeof p.theme.primary.base === 'object' //
            ? p.theme.primary.base.chroma /* 🔴 WIP TODO rvion 2024-05-30 */
            : 0.2
    if (p.appearance === 'secondary') return 0.1
    return
}
