import Color from 'colorjs.io'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { clamp } from 'three/src/math/MathUtils'

import { AbsoluteStyle, type RelativeStyle, ThemeCtx } from './AbsoluteStyle'
import { applyRelative } from './applyRelative'

type DivType_FULL = React.HTMLAttributes<HTMLDivElement>
type DivType_SHORT = {
    children?: React.ReactNode
    className?: string
}

// --------- text styles
export const BoxBase = observer(function BoxTitleUI_({ children, ...rest }: DivType_SHORT) {
    return (
        <Box {...rest} base={{ contrast: 0.05 }}>
            {children}
        </Box>
    )
})

// --------- text styles
export const BoxTitle = observer(function BoxTitleUI_({ children, ...rest }: DivType_SHORT) {
    return (
        <Box {...rest} text={{ contrast: 1, chromaBlend: 100, hueShift: 0 }}>
            {children}
        </Box>
    )
})

export const BoxSubtle = observer(function BoxSubtle_({ children, ...rest }: DivType_SHORT) {
    return (
        <Box {...rest} text={{ contrast: 0.4, chromaBlend: 1, hueShift: 0 }}>
            {children}
        </Box>
    )
})

export const Box = observer(function BoxUI_(p: {
    /**
     * - string: absolute color
     * - relative: relative to parent
     * - number: = relative({ contrast: x / 100 })
     * - null: inherit parent's background
     * */
    base?: RelativeStyle | string | number
    /** relative to base; when relative, carry to children as default strategy */
    text?: RelativeStyle | string
    shadow?: RelativeStyle | string
    /**
     * - string: absolute color
     * - relative: relative to parent
     * - number: = relative({ contrast: x / 10 })
     * - null: inherit parent's background
     * */
    border?: RelativeStyle | string | number
    //
    className?: string
    children?: React.ReactNode
}) {
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

    return (
        <div
            className={p.className}
            style={{
                border: border ? `1px solid ${formatColor(border)}` : undefined,
                background:
                    p.base != null // when base is null, let's just inherit the parent's background
                        ? formatColor(background)
                        : undefined,
                color: formatColor(text),
            }}
        >
            <ThemeCtx.Provider
                value={{
                    background,
                    // ~~text must always remaian relative~~ => nope anymore ? ⁉️
                    text: typeof p.text === 'object' ? p.text : ctx.text,
                }}
            >
                {/*  */}
                {/* <div>{JSON.stringify(background)}</div>
                <div>
                    text: {JSON.stringify(text)} ({JSON.stringify(p.text)})
                </div> */}
                {p.children}
            </ThemeCtx.Provider>
        </div>
    )
})

function formatColor(col: AbsoluteStyle) {
    return `oklch(${clamp(col.lightness, 0.0001, 0.9999)} ${col.chroma} ${col.hue})`
}
