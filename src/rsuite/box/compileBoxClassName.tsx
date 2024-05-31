import type { Kolor } from '../kolor/Kolor'
import type { CurrentStyle } from './CurrentStyleCtx'

import { nanoid } from 'nanoid'

import { applyKolorToOKLCH } from '../kolor/applyRelative'
import { overrideKolor } from '../kolor/overrideKolor'
import { setRule } from '../tinyCSS/compileOrRetrieveClassName'
import { type BoxNormalized } from './BoxNormalized'

export const applyBoxToCtx = (ctx: CurrentStyle, box: BoxNormalized): CurrentStyle => {
    const lightness = ctx.base.lightness
    return {
        dir:
            ctx.dir === 1 && lightness > 0.7 //
                ? -1
                : ctx.dir === -1 && lightness < 0.3
                  ? 1
                  : ctx.dir,
        base: applyKolorToOKLCH(ctx.base, box.base),
        text: overrideKolor(box.text, ctx.text)!,
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

const hashBoxNormalized = (b: BoxNormalized) => {
    let out: string[] = []
    if (b.base) out.push(`bg${hashKolor(b.base)}`)
    if (b.text) out.push(`t${hashKolor(b.text)}`)
    if (b.border) out.push(`b${hashKolor(b.border)}`)
    if (b.textShadow) out.push(`ts${hashKolor(b.textShadow)}`)
    if (b.shadow) out.push(`s${hashKolor(b.shadow)}`)
    if (b.hover) out.push(`h${hashKolor(b.hover)}`)
    return `[${out.join(',')}]`
}
export const compileBoxClassName = (
    /** how the box wants to be displayed, mix of "absolute" and "relative" instructions */
    box: BoxNormalized,
) => {
    // the idea is to merge make the whole instruction compiled to some stable CSS
    // className that will remain stable no matter what the context is
    // const raw = JSON.stringify(box)
    const className = hashBoxNormalized(box)
    const x =
        cache.get(className) ??
        (() => {
            // const className = `B${nanoid(5)}`
            const cssLines: string[] = []
            // const rule = (selector: string, lines: string[]) => cssLines.push(`${selector} {\n${lines.join('')}}`)

            // --------------------------------------------------------
            const lines: string[] = []
            const p = (key: string, value: string) => lines.push(`    ${key}: ${value};\n`)
            if (box.base) p(`background`, `var(--KLR)`)
            if (box.text) p(`color`, compileKolorToCSSExpression('KLR', box.text))
            if (box.border) p(`border`, `1px solid ${compileKolorToCSSExpression('KLR', box.border)}`)
            setRule(`.${CSS.escape(className)}`, lines.join(''))
            console.log(`[🤠] rvion .${className}      `, hashBoxNormalized(box))

            // --------------------------------------------------------
            // if (box.hover) {
            //     const linesH: string[] = []
            //     const ph = (key: string, value: string) => lines.push(`${key}: ${value};`)
            //     if (box.text) p(`color`, compileKolorToCSSExpression('KLR', box.text))
            //     if (box.border) p(`border`, `1px solid ${compileKolorToCSSExpression('KLR', box.border)}`)
            //     rule(`.${className}:hover`, linesH)
            //     console.log(`[🤠] rvion .${className}:hover`, hashBoxNormalized(box))
            // }

            const css = cssLines.join('\n')
            const entry = { className, css }

            cache.set(className, entry)
            return entry
        })()
    return x
}

const cache = new Map<
    string,
    {
        className: string
        css: string
        variables?: Record<string, string>
    }
>()

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

// const renderOKLCH = (oklch: OKLCH) => {
//     return `oklch(${oklch.lightness.toFixed(2)} ${oklch.chroma.toFixed(2)} ${oklch.hue.toFixed(1)})`
// }
