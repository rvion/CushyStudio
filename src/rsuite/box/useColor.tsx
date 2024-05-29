import type { Kolor } from '../kolor/Kolor'
import type { OKLCH } from '../kolor/OKLCH'
import type { BoxProps } from './BoxProps'

import { createHash } from 'crypto'
import { type CSSProperties, useContext } from 'react'

import { clamp } from '../../controls/widgets/list/clamp'
import { applyRelative } from '../kolor/applyRelative'
import { getLCHFromString } from '../kolor/getLCHFromString'
import { CurrentStyleCtx } from './CurrentStyleCtx'

type BoxAppearance = {
    background: OKLCH
    text: OKLCH
    textShadow: OKLCH | null
    border: OKLCH | null
    // for ctx
    textForCtx: OKLCH | Kolor
}

export const useColor = (
    p: BoxProps = {},
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
    const baseInstr: Kolor | null = normalizeBase(p.base)
    const baseStyle: OKLCH = baseInstr ? applyRelative(ctx.background, baseInstr) : ctx.background

    // text
    const textInstr: Kolor | null = normalizeText(p.text) ?? ctx.text
    const textStyle: OKLCH = applyRelative(baseStyle, textInstr)

    const textShadowInstr: Kolor | null = normalizeText(p.textShadow)
    const textShadowStyle: OKLCH | null = textShadowInstr ? applyRelative(baseStyle, textShadowInstr) : null

    // const relativeText: RelativeStyle | AbsoluteStyle = p.text ?? ctx.text
    const borderInstr = normalizeBorder(p.border)
    const borderStyle: OKLCH | null = borderInstr ? applyRelative(ctx.background, borderInstr) : null

    const textForCtx = typeof p.text === 'object' ? p.text : ctx.text

    // css values ------------------------------------------------------------------------------------
    const border = borderStyle ? `1px solid ${formatColor(borderStyle)}` : undefined
    const color = formatColor(textStyle)
    const background =
        p.base != null // when base is null, let's just inherit the parent's background
            ? formatColor(baseStyle)
            : undefined

    // for hover
    let baseHover: string | undefined // = 'initial'
    let textHover: string | undefined // = 'initial'
    let borderHover: string | undefined // = 'initial'
    if (p.hover) {
        const amount = typeof p.hover === 'number' ? p.hover : 0.05
        const baseHoverStyle = applyRelative(baseStyle, { contrast: amount })
        baseHover = formatColor(baseHoverStyle)

        if (borderStyle) {
            const borderHoverStyle = applyRelative(borderStyle, { contrast: amount })
            borderHover = `1px solid ${formatColor(borderHoverStyle)}`
        }

        const textHoverStyle = applyRelative(baseHoverStyle, { contrast: 0.9, chromaBlend: 2 })
        textHover = formatColor(textHoverStyle)
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

const cache: Record<string, string> = {}
const compileOrRetrieveClassName = (appearance: CSSProperties): string => {
    const vals = JSON.stringify(appearance)
    const hash = 'col-' + createHash('md5').update(vals).digest('hex')
    if (hash in cache) return cache[hash]!
    // console.log(`[🌈] `, `.${hash}`, appearance)
    const cssBlock = Object.entries(appearance)
        .map(([key, val]) => {
            // console.log(`[🌈] ---`, key, val)
            if (val == null) return ''
            return `${key}: ${val};`
        })
        .join('\n')
    setRule(`.${hash}`, cssBlock)
    cache[hash] = hash
    return hash
}

let styleElement: HTMLStyleElement | null = null
function getStyleElement(): HTMLStyleElement {
    if (styleElement != null) return styleElement
    // let styleElement = document.querySelector('[title="dynamic-theme-css"]') as HTMLStyleElement
    if (styleElement) {
        styleElement = styleElement
    } else {
        styleElement = styleElement ?? document.createElement('style')
        styleElement.title = 'dynamic-theme-css'
        document.head.appendChild(styleElement)
    }
    return styleElement!
}

function setRule(selector: string, block: string = ''): CSSStyleRule {
    const styleSheet = getStyleElement().sheet as CSSStyleSheet
    // ensure rules
    const rules = styleSheet.cssRules //  || styleSheet.rules
    if (rules == null) throw new Error('❌ no rules')
    // find or create rule
    const rule = Array.from(rules).find((r) => (r as CSSStyleRule).selectorText === selector) as CSSStyleRule | undefined
    if (rule == null) {
        const index = styleSheet.insertRule(`${selector} {${block}}`, styleSheet.cssRules.length)
        return styleSheet.cssRules[index] as CSSStyleRule
    } else {
        rule.style.cssText = block
        return rule
    }
}

export function formatColor(col: OKLCH) {
    const l = clamp(col.lightness, 0.0001, 0.9999).toFixed(4)
    const c = col.chroma.toFixed(4)
    const h = col.hue.toFixed(4)
    return `oklch(${l} ${c} ${h})`
}

export function normalizeBase(base: Kolor | string | number | undefined | null): Kolor | null {
    if (base == null) return null
    if (typeof base === 'number') return { contrast: clamp(base / 100, 0, 1) }
    if (typeof base === 'string') return getLCHFromString(base)
    return base
}

export function normalizeBorder(border: Kolor | string | number | boolean | undefined | null): Kolor | null {
    if (border == null) return null
    if (typeof border === 'boolean') return { contrast: 0.2 }
    if (typeof border === 'number') return { contrast: clamp(border / 10, 0, 1) }
    if (typeof border === 'string') return getLCHFromString(border)
    return border
}

export function normalizeText(text: Kolor | string | undefined | null): Kolor | null {
    if (text == null) return null
    if (typeof text === 'string') return getLCHFromString(text)
    return text
}
