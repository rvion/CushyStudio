import type { Kolor } from '../kolor/Kolor'

export const getInputBoolChroma = (isActive: boolean) => {
    // TODO: make that behind a theme color
    return isActive ? 0.08 : 0.01
}

export const getInputBoolContrast = (isActive: boolean) => {
    return isActive ? 0.3 : 0.03
}

export const getBaseColor = (isActive: boolean): Kolor => {
    if (isActive) return { contrast: 0.1, chroma: 0.04 }
    return { contrast: 0.01, chroma: 0.01 }
}
