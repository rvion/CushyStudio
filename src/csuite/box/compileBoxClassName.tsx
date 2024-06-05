import type { Kolor } from '../kolor/Kolor'
import type { BoxNormalized } from './BoxNormalized'
import type { CurrentStyle } from './CurrentStyleCtx'

import { applyKolorToOKLCH } from '../kolor/applyRelative'
import { overrideKolor } from '../kolor/overrideKolor'

export const applyBoxToCtx = (
    //
    ctx: CurrentStyle,
    box: BoxNormalized,
): CurrentStyle => {
    const nextBase = applyKolorToOKLCH(ctx.base, box.base)
    const nextBaseH = applyKolorToOKLCH(nextBase, box.hover)
    const nextLightness = nextBase.lightness
    const nextext = overrideKolor(ctx.text, box.text)!
    const nextDir =
        ctx.dir === 1 && nextLightness > 0.7 // too dark
            ? -1
            : ctx.dir === -1 && nextLightness < 0.45 // too light
              ? 1
              : ctx.dir
    return {
        dir: nextDir,
        base: nextBase,
        baseH: nextBaseH,
        text: nextext,
    }
}

export const hashKolor = (
    //
    k: Kolor,
    dir: -1 | 1,
): string => {
    let out: string[] = []
    const sign = dir === 1 ? 'p' : 'm'
    // l
    if (k.lightness) out.push(`l${k.lightness}`)
    else if (k.contrast) out.push(`l${sign}${k.contrast}`)
    // c
    if (k.chroma) out.push(`c${k.chroma}`)
    else if (k.chromaBlend) out.push(`c${sign}${k.chromaBlend}`)
    // h
    if (k.hue) out.push(`h${k.hue}`)
    else if (k.hueShift) out.push(`h${sign}${k.hueShift}`)
    return `${out.join('_')}`
}
