import { exhaust } from '../../utils/misc/exhaust'
import { FrameAppearance } from './FrameAppearance'

export function getBorderContrast(appearance: Maybe<FrameAppearance>) {
    if (appearance === 'headless') return undefined
    if (appearance === 'primary') return 0.3
    if (appearance === 'secondary') return 0.3
    if (appearance === 'ghost') return 0
    if (appearance === 'default') return 0
    if (appearance === 'subtle') return 0.05
    if (appearance == null) return 0
    exhaust(appearance)
    return 1
}
