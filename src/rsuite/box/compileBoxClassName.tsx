import type { Kolor } from '../kolor/Kolor'
import type { BoxNormalized } from './BoxNormalized'
import type { CurrentStyle } from './CurrentStyleCtx'

import { applyKolorToOKLCH } from '../kolor/applyRelative'
import { overrideKolor } from '../kolor/overrideKolor'

export const applyBoxToCtx = (ctx: CurrentStyle, box: BoxNormalized): CurrentStyle => {
    const nextBase = applyKolorToOKLCH(ctx.base, box.base)
    const lightness = nextBase.lightness
    return {
        dir:
            ctx.dir === 1 && lightness > 0.7 //
                ? -1
                : ctx.dir === -1 && lightness < 0.45
                  ? 1
                  : ctx.dir,
        base: nextBase,
        text: overrideKolor(ctx.text, box.text)!,
    }
}

export const hashKolor = (k: Kolor): string => {
    let out: string[] = []
    // l
    if (k.lightness) out.push(`l=${k.lightness}`)
    else if (k.contrast) out.push(`l->${k.contrast}`)
    // c
    if (k.chroma) out.push(`c=${k.chroma}`)
    else if (k.chromaBlend) out.push(`c*${k.chromaBlend}`)
    // h
    if (k.hue) out.push(`h=${k.hue}`)
    else if (k.hueShift) out.push(`h->${k.hueShift}`)
    return `(${out.join(',')})`
}
