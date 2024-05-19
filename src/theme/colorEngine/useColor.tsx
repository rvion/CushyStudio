import type { BoxProps } from './Box'

import Color from 'colorjs.io'
import { useContext } from 'react'

import { clamp } from '../../controls/widgets/list/clamp'
import { type AbsoluteStyle, type RelativeStyle, ThemeCtx } from './AbsoluteStyle'
import { applyRelative } from './applyRelative'

export const useColor = (
    p: BoxProps,
): {
    background: AbsoluteStyle
    text: AbsoluteStyle
    textForCtx: AbsoluteStyle | RelativeStyle
    border: AbsoluteStyle | null
} => {
    const ctx = useContext(ThemeCtx)
    const background: AbsoluteStyle = (() => {
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
    const text: AbsoluteStyle = (() => {
        if (p.text) {
            if (typeof p.text === 'string') {
                const color = new Color(p.text)
                const [l, c, h] = color.oklch
                return { type: 'absolute', lightness: l!, chroma: c!, hue: h! }
            }
            return applyRelative(background, p.text)
        } else {
            if (ctx.text.type === 'absolute') return ctx.text
            return applyRelative(background, ctx.text) // realtive strategy applied here
        }
    })()

    // const relativeText: RelativeStyle | AbsoluteStyle = p.text ?? ctx.text
    const border: AbsoluteStyle | null = (() => {
        if (p.border) {
            if (typeof p.border === 'number') {
                return applyRelative(background, { contrast: clamp(p.border / 10, 0, 1) })
            }
            if (typeof p.border === 'string') {
                const color = new Color(p.border)
                const [l, c, h] = color.oklch
                return { type: 'absolute', lightness: l!, chroma: c!, hue: h! }
            }
            return applyRelative(background, p.border)
        }
        return null
    })()

    const textForCtx = typeof p.text === 'object' ? p.text : ctx.text
    return {
        background,
        text,
        textForCtx,
        border,
    }
}
