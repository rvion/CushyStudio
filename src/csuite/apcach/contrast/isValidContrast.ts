import type { ContrastModel, ContrastRatio } from '../types'

export function isValidContrast(
    //
    cr: ContrastRatio,
    contrastModel: ContrastModel,
): boolean {
    return (
        (Math.abs(cr) >= 8 && contrastModel === 'apca') || //
        (Math.abs(cr) >= 1 && contrastModel === 'wcag')
    )
}
