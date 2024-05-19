export function autoContrast(
    //
    lightness: number,
    contrast: number,
) {
    /* This slightly favors using the darker color by adding a small float to ensure we always have -1/1 from Math.sign */
    const start = lightness
    const end = Math.round(lightness) - Math.sign(lightness - 0.5 + 0.00001)
    return start * (1 - contrast) + end * contrast
}
