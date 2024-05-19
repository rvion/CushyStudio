import { observer } from 'mobx-react-lite'
import { createContext, useContext } from 'react'
import { clamp } from 'three/src/math/MathUtils'

import { autoContrast } from '../theme/colorEngine/autoContrast'

/** oklch */
export type AbsoluteStyle = {
    type: 'absolute'
    /** 0 to 1 */
    lightness: number
    /** 0 to 1 */
    chroma: number
    /** 0 to 360 or -180 to 180 */
    hue: number
}

/** contrast+accent bleed + hue shift */
export type RelativeStyle = {
    type: 'relative'
    /** -1 to 1 */
    contrast: number

    /**
     * 0 to 1
     * multiplier for chroma (saturation)
     * how much colorfulness to retain from the background
     */
    chromaBlend?: number
    /** 0 to 1 */
    hueShift?: number
    /** TBD */
    opacity?: number
}

export type Appearance = {
    background: RelativeStyle | AbsoluteStyle
    text: RelativeStyle | AbsoluteStyle
    shadow: Maybe<RelativeStyle | AbsoluteStyle>
    border: Maybe<RelativeStyle | AbsoluteStyle>
}

const ThemeCtx = createContext<{
    background: AbsoluteStyle
    text: RelativeStyle | AbsoluteStyle
    /** shiftDirection will change at threesholds (0.25 when pos, .75 when neg) */
    shiftDirection?: 'pos' | 'neg'
}>({
    background: {
        type: 'absolute',
        lightness: 0.5,
        chroma: 0.2,
        hue: 180,
    },
    text: {
        type: 'relative',
        contrast: 1,
        chromaBlend: 0,
        hueShift: 0,
    },
    // text: { type: 'absolute', lightness: 0, chroma: 0.5, hue: 180, },
    // shadow: null,
    // border: null,
})

const applyRelative = (a: AbsoluteStyle, b: RelativeStyle): AbsoluteStyle => {
    // oklch(lightness chroma hue);
    const xxx = autoContrast(a.lightness, b.contrast)
    const lightness = xxx /* a.lightness */
    const chroma = clamp(a.chroma * (b.chromaBlend ?? 1), 0, 0.4)

    const hue = a.hue + (b.hueShift ?? 0)
    return { type: 'absolute', lightness, chroma, hue }
}

export const BoxTitle = observer(function BoxTitleUI_(p: { children: React.ReactNode }) {
    return <Box text={{ type: 'relative', contrast: 1, chromaBlend: 100, hueShift: 0 }}>{p.children}</Box>
})
export const BoxSubtle = observer(function BoxSubtle_(p: { children: React.ReactNode }) {
    return <Box text={{ type: 'relative', contrast: 0.4, chromaBlend: 1, hueShift: 0 }}>{p.children}</Box>
})
export const Box = observer(function BoxUI_(
    p: Partial<Appearance> & {
        className?: string
        children?: React.ReactNode
    },
) {
    const ctx = useContext(ThemeCtx)

    const background: AbsoluteStyle = (() => {
        // if the box have a new background
        if (p.background) {
            // if it's absolute, use it as-is
            if (p.background.type === 'absolute') return p.background
            // if it's relative (should be the most common case)
            if (p.background.type === 'relative') return applyRelative(ctx.background, p.background)
        }
        return ctx.background
    })()

    const text: AbsoluteStyle = (() => {
        if (p.text) {
            if (p.text.type === 'absolute') return p.text
            if (p.text.type === 'relative') return applyRelative(background, p.text)
        } else {
            if (ctx.text.type === 'absolute') return ctx.text
            if (ctx.text.type === 'relative') return applyRelative(background, ctx.text)
        }
        // return applyRelative(
        //     background,
        //     ctx.text,
        //     // { type: 'relative', contrast: 1, chromaBlend: 0, hueShift: 0 },
        // )
    })()

    return (
        <div
            className={p.className}
            style={{
                background: formatColor(background),
                color: formatColor(text),
            }}
        >
            <ThemeCtx.Provider
                value={{
                    background,
                    // text must always remaian relative
                    text: p.text?.type === 'relative' ? p.text : ctx.text,
                }}
            >
                {/*  */}
                <div>{JSON.stringify(background)}</div>
                <div>
                    text: {JSON.stringify(text)} ({JSON.stringify(p.text)})
                </div>
                {p.children}
            </ThemeCtx.Provider>
        </div>
    )
})

function formatColor(col: AbsoluteStyle) {
    return `oklch(${clamp(col.lightness, 0.0001, 0.9999)} ${col.chroma} ${col.hue})`
}
