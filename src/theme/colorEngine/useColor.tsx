import type { BoxProps } from './Box'

import Color from 'colorjs.io'
import { createHash } from 'crypto'
import { type CSSProperties, useContext } from 'react'

import { clamp } from '../../controls/widgets/list/clamp'
import { hashJSONObject, hashString } from '../../panels/router/hash'
import { type AbsoluteStyle, type RelativeStyle, ThemeCtx } from './AbsoluteStyle'
import { applyRelative } from './applyRelative'
import { formatColor } from './formatColor'

type BoxAppearance = {
    background: AbsoluteStyle
    text: AbsoluteStyle
    textForCtx: AbsoluteStyle | RelativeStyle
    border: AbsoluteStyle | null
}

export const useColor = (
    p: BoxProps = {},
): BoxAppearance & {
    /** auto-generated from BoxAppearance */
    className?: string
    /** in case you prefer BoxAppearance as css object */
    styles: Readonly<CSSProperties>
} => {
    const ctx = useContext(ThemeCtx)
    const backgroundStyle: AbsoluteStyle = (() => {
        // if the box have a new background
        if (p.base) {
            if (typeof p.base === 'number') {
                return applyRelative(ctx.background, { contrast: clamp(p.base / 100, 0, 1) })
            }
            // if it's absolute, use it as-is
            if (typeof p.base === 'string') {
                const color = new Color(p.base)
                const [l, c, h] = color.oklch
                return { type: 'absolute', lightness: l!, chroma: c!, hue: h! }
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
            return applyRelative(backgroundStyle, p.text)
        } else {
            if (ctx.text.type === 'absolute') return ctx.text
            return applyRelative(backgroundStyle, ctx.text) // realtive strategy applied here
        }
    })()

    // const relativeText: RelativeStyle | AbsoluteStyle = p.text ?? ctx.text
    const borderStyle: AbsoluteStyle | null = (() => {
        if (p.border) {
            if (typeof p.border === 'boolean') {
                return applyRelative(backgroundStyle, { contrast: 0.2 })
            }
            if (typeof p.border === 'number') {
                return applyRelative(backgroundStyle, { contrast: clamp(p.border / 10, 0, 1) })
            }
            if (typeof p.border === 'string') {
                const color = new Color(p.border)
                const [l, c, h] = color.oklch
                return { type: 'absolute', lightness: l!, chroma: c!, hue: h! }
            }
            return applyRelative(backgroundStyle, p.border)
        }
        return null
    })()

    const textForCtx = typeof p.text === 'object' ? p.text : ctx.text
    const appearance: BoxAppearance = { background: backgroundStyle, text: textStyle, textForCtx, border: borderStyle }
    const styles: CSSProperties = {
        border: borderStyle ? `1px solid ${formatColor(borderStyle)}` : undefined,
        background:
            p.base != null // when base is null, let's just inherit the parent's background
                ? formatColor(backgroundStyle)
                : undefined,
        color: formatColor(textStyle),
    }
    return {
        background: backgroundStyle,
        text: textStyle,
        textForCtx,
        border: borderStyle,
        get className() {
            return compileOrRetrieveClassName(styles)
        },
        styles,
    }
}

const cache: Record<string, string> = {}
const compileOrRetrieveClassName = (appearance: CSSProperties): string => {
    const vals = JSON.stringify(appearance)
    const hash = 'col-' + createHash('md5').update(vals).digest('hex')
    if (hash in cache) return cache[hash]!
    console.log(`[🌈] `, `.${hash}`, appearance)
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
