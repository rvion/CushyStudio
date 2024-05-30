import type { Kolor } from '../kolor/Kolor'
import type { OKLCH } from '../kolor/OKLCH'
import type { Box } from './Box'

import { type CSSProperties, useContext } from 'react'

import { clamp } from '../../controls/utils/clamp'
import { applyKolorToOKLCH } from '../kolor/applyRelative'
import { compileOrRetrieveClassName } from '../tinyCSS/compileOrRetrieveClassName'
import { CurrentStyleCtx } from './CurrentStyleCtx'
import { normalizeBoxBase } from './normalizeBoxBase'
import { normalizeBoxBorder } from './normalizeBoxBorder'
import { normalizeBoxText } from './normalizeBoxText'

type BoxAppearance = {
    background: OKLCH
    text: OKLCH
    textShadow: OKLCH | null
    border: OKLCH | null
    // for ctx
    textForCtx: OKLCH | Kolor
}

export const useColor = (
    p: Box = {},
): BoxAppearance & {
    /** auto-generated from BoxAppearance */
    className?: string
    /** in case you prefer BoxAppearance as css object */
    styles: Readonly<CSSProperties>
    /** in case you prefer BoxAppearance as css variables */
    variables: Record<string, any>
} => {
    const ctx = useContext(CurrentStyleCtx)

    // ---------------------------------------------------------------------------------------------------
    // background
    const baseInstr: Kolor | null = normalizeBoxBase(p.base)
    const baseStyle: OKLCH = baseInstr ? applyKolorToOKLCH(ctx.background, baseInstr) : ctx.background

    // text
    const textInstr: Kolor | null = normalizeBoxText(p.text) ?? ctx.text
    const textStyle: OKLCH = applyKolorToOKLCH(baseStyle, textInstr)

    const textShadowInstr: Kolor | null = normalizeBoxText(p.textShadow)
    const textShadowStyle: OKLCH | null = textShadowInstr ? applyKolorToOKLCH(baseStyle, textShadowInstr) : null

    // const relativeText: RelativeStyle | AbsoluteStyle = p.text ?? ctx.text
    const borderInstr = normalizeBoxBorder(p.border)
    const borderStyle: OKLCH | null = borderInstr ? applyKolorToOKLCH(ctx.background, borderInstr) : null

    const textForCtx = typeof p.text === 'object' ? p.text : ctx.text

    // css values ------------------------------------------------------------------------------------
    const border = borderStyle ? `1px solid ${formatOKLCH(borderStyle)}` : undefined
    const color = formatOKLCH(textStyle)
    const background =
        p.base != null // when base is null, let's just inherit the parent's background
            ? formatOKLCH(baseStyle)
            : undefined

    // for hover
    let baseHover: string | undefined // = 'initial'
    let textHover: string | undefined // = 'initial'
    let borderHover: string | undefined // = 'initial'
    if (p.hover) {
        const amount = typeof p.hover === 'number' ? p.hover : 0.05
        const baseHoverStyle = applyKolorToOKLCH(baseStyle, { contrast: amount })
        baseHover = formatOKLCH(baseHoverStyle)

        if (borderStyle) {
            const borderHoverStyle = applyKolorToOKLCH(borderStyle, { contrast: amount })
            borderHover = `1px solid ${formatOKLCH(borderHoverStyle)}`
        }

        const textHoverStyle = applyKolorToOKLCH(baseHoverStyle, { contrast: 0.9, chromaBlend: 2 })
        textHover = formatOKLCH(textHoverStyle)
    }

    // styles object
    const styles: CSSProperties = {
        border: border,
        background: background,
        color: color,
    }

    // as css variables
    const variables = {
        // non hover
        '--box-base': styles.background, // ?? 'initial',
        '--box-text': styles.color, // ?? 'initial',
        '--box-text-shadow': styles.textShadow, // ?? 'initial',
        '--box-border': styles.border ?? 'initial',
        // hover --------
        '--box-hover-base': baseHover ?? background, // ?? 'initial',
        '--box-hover-text': textHover ?? color, // ?? 'initial',
        '--box-hover-text-shadow': styles.textShadow, // ?? 'initial',
        '--box-hover-border': borderHover ?? border ?? 'initial',
    }

    return {
        background: baseStyle,
        text: textStyle,
        textShadow: textShadowStyle,
        textForCtx,
        border: borderStyle,
        get className() {
            return compileOrRetrieveClassName(styles)
        },
        styles,
        variables,
    }
}

export function formatOKLCH(col: OKLCH) {
    const l = clamp(col.lightness, 0.0001, 0.9999).toFixed(4)
    const c = col.chroma.toFixed(4)
    const h = col.hue.toFixed(4)
    return `oklch(${l} ${c} ${h})`
}