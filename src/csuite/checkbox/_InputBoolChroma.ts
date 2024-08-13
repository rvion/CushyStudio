import type { Tint } from '../kolor/Tint'

export const getInputBoolChroma = (isActive: boolean): number => {
    // TODO: make that behind a theme color
    return isActive ? 0.06 : 0.03
}

export const getInputBoolContrast = (isActive: boolean): number => {
    return isActive ? 0.3 : 0.05
}

export const getBaseColor = (isActive: boolean): Tint => {
    if (isActive) return { contrast: 0.1, chroma: 0.04 }
    return { contrast: 0.01, chroma: 0.01 }
}
