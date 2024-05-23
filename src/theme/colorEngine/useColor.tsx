import type { AbsoluteStyle, RelativeStyle } from './AbsoluteStyle'
import type { BoxProps } from './Box'

import Color from 'colorjs.io'
import { createHash } from 'crypto'
import { type CSSProperties, useContext } from 'react'

import { clamp } from '../../controls/widgets/list/clamp'
import { ThemeCtx } from './AbsoluteStyle'
import { applyRelative } from './applyRelative'

type BoxAppearance = {
    background: AbsoluteStyle
    text: AbsoluteStyle
    textShadow: AbsoluteStyle | null
    border: AbsoluteStyle | null
    // for ctx
    textForCtx: AbsoluteStyle | RelativeStyle
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
    const ctx = useContext(ThemeCtx)
    const baseStyle: AbsoluteStyle = (() => {
        // if the box have a new background
        if (p.base) {
            if (typeof p.base === 'number') {
                return applyRelative(ctx.background, { contrast: clamp(p.base / 100, 0, 1) })
            }
            // if it's absolute, use it as-is
            if (typeof p.base === 'string') {
                const color = new Color(p.base)
                const [l, c, h] = color.oklch
                // console.log(`[🌈] lch`, p.base, l, c, h)
                // console.log(`[🌈] lch`, color)
                // console.log(`[🌈] lch`, color.oklch)
                return { type: 'absolute', lightness: l!, chroma: c!, hue: isNaN(h!) ? 0 : h! }
            }
            // if it's relative (should be the most common case)
            return applyRelative(ctx.background, p.base)
        }
        return ctx.background
    })()

    // const relativeText: RelativeStyle | AbsoluteStyle = p.text ?? ctx.text
    const textStyle: AbsoluteStyle = (() => {
        if (p.text) {
            if (typeof p.text === 'string') {
                const color = new Color(p.text)
                const [l, c, h] = color.oklch
                return { type: 'absolute', lightness: l!, chroma: c!, hue: h! }
            }
            return applyRelative(baseStyle, p.text)
        } else {
            if (ctx.text.type === 'absolute') return ctx.text
            return applyRelative(baseStyle, ctx.text) // realtive strategy applied here
        }
    })()

    const textShadow: AbsoluteStyle | null = (() => {
        if (p.textShadow) {
            if (typeof p.textShadow === 'string') {
                const color = new Color(p.textShadow)
                const [l, c, h] = color.oklch
                return { type: 'absolute', lightness: l!, chroma: c!, hue: h! }
            }
            return applyRelative(textStyle, p.textShadow)
        }
        return null
    })()

    // const relativeText: RelativeStyle | AbsoluteStyle = p.text ?? ctx.text
    const borderStyle: AbsoluteStyle | null = (() => {
        if (p.border) {
            if (typeof p.border === 'boolean') {
                return applyRelative(baseStyle, { contrast: 0.2 })
            }
            if (typeof p.border === 'number') {
                return applyRelative(baseStyle, { contrast: clamp(p.border / 10, 0, 1) })
            }
            if (typeof p.border === 'string') {
                const color = new Color(p.border)
                const [l, c, h] = color.oklch
                return { type: 'absolute', lightness: l!, chroma: c!, hue: h! }
            }
            return applyRelative(baseStyle, p.border)
        }
        return null
    })()

    const textForCtx = typeof p.text === 'object' ? p.text : ctx.text

    // css values
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
        textShadow,
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

export function formatColor(col: AbsoluteStyle) {
    const l = clamp(col.lightness, 0.0001, 0.9999).toFixed(4)
    const c = col.chroma.toFixed(4)
    const h = col.hue.toFixed(4)
    return `oklch(${l} ${c} ${h})`
}
