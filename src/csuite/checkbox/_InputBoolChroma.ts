export const getInputBoolChroma = (isActive: boolean) => {
    // TODO: make that behind a theme color
    return isActive ? 0.04 : 0.01
}

export const getInputBoolContrast = (isActive: boolean) => {
    return isActive ? 0.1 : 0.01
}
