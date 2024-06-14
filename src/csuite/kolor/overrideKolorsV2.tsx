import type { Kolor } from './Kolor'

export const overrideKolorsV2 = (
    ...kolors: Maybe<Kolor | boolean>[]
) => {

    const out: Kolor = {}
    for (const kolor of kolors) {
        if (typeof kolor === 'boolean') continue
        if (kolor == null) continue
        // L
        if (kolor.lightness != null) {
            out.lightness = kolor.lightness
            delete out.contrast
        } else if (kolor.contrast != null) {
            out.contrast = kolor.contrast
            delete out.lightness
        }
        // C
        if (kolor.chroma != null) {
            out.chroma = kolor.chroma
            delete out.chromaBlend
        } else if (kolor.chromaBlend != null) {
            out.chromaBlend = kolor.chromaBlend
            delete out.chroma
        }
        // H
        if (kolor.hue != null) {
            out.hue = kolor.hue
            delete out.hueShift
        } else if (kolor.hueShift != null) {
            out.hueShift = kolor.hueShift
            delete out.hue
        }
    }
    return out
}
