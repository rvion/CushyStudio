import { observer } from 'mobx-react-lite'
import { clamp } from 'three/src/math/MathUtils'

import { AbsoluteStyle, type RelativeStyle, ThemeCtx } from './AbsoluteStyle'
import { useColor } from './useColor'

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

export type BoxProps = {
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
}

export const Box = observer(function BoxUI_(p: BoxProps) {
    const { border, background, text, textForCtx } = useColor(p)

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
                    text: textForCtx,
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
