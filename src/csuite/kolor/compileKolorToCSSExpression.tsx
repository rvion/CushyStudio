import type { Kolor } from './Kolor'

export const compileKolorToCSSExpression = (
    //
    from: string,
    kolor: Kolor,
) => {
    const l =
        kolor.lightness != null //
            ? kolor.lightness
            : kolor.contrast
              ? `calc(l + ${kolor.contrast} * var(--DIR))`
              : 'l'

    const c =
        kolor.chroma != null //
            ? kolor.chroma
            : kolor.chromaBlend
              ? `calc(c * ${kolor.chromaBlend})`
              : 'c'

    const h =
        kolor.hue != null //
            ? kolor.hue
            : kolor.hueShift
              ? `calc(l + ${kolor.hueShift})`
              : 'h'
    return `oklch(from var(--${from}) ${l} ${c} ${h})`
}
