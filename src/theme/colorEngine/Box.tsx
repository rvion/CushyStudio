import type { RelativeStyle } from './AbsoluteStyle'
import type { ForwardedRef } from 'react'

import { observer } from 'mobx-react-lite'

import { ThemeCtx } from './AbsoluteStyle'
import { useColor } from './useColor'

// --------- text styles
export const BoxBase = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
    return (
        <Box {...rest} base={{ contrast: 0.05 }}>
            {children}
        </Box>
    )
})

// --------- text styles
export const BoxTitle = observer(function BoxTitleUI_({ children, ...rest }: BoxUIProps) {
    return (
        <Box {...rest} text={{ contrast: 1, chromaBlend: 100, hueShift: 0 }}>
            {children}
        </Box>
    )
})

export const BoxSubtle = observer(function BoxSubtle_({ children, ...rest }: BoxUIProps) {
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
     * - number: = relative({ contrast: x / 100, chromaBlend: 1, hueShift: 0 })
     * - null: inherit parent's background
     * */
    base?: RelativeStyle | string | number
    /**
     * @default { contrast: 1, chromaBlend: 1, hueShift: 0}
     * relative to base; when relative, carry to children as default strategy */
    text?: RelativeStyle | string
    shadow?: RelativeStyle | string
    /**
     * - string: absolute color
     * - relative: relative to parent
     * - number: = relative({ contrast: x / 10 })
     * - boolean: = relative({ contrast: 0.2 })
     * - null: inherit parent's background
     * */
    border?: RelativeStyle | string | number | boolean
    /** if true; will add some contrast on hover */
    hover?: boolean
}

export type BoxUIProps = BoxProps & {
    //
    className?: string
    style?: React.CSSProperties
    children?: any // React.ReactNode
    tabIndex?: number
    id?: string
    ref?: React.Ref<HTMLDivElement>
    onClick?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onMouseDown?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onMouseEnter?: (ev: React.MouseEvent<HTMLDivElement>) => void
}

// 🔴 2024-05-20 rvion:
// || do we want to add observer here + forward ref ?
// || or just go for speed ?
export const Box = observer(
    function BoxUI_(p: BoxUIProps, ref: ForwardedRef<HTMLDivElement>) {
        const {
            // to merge:
            style,
            className,
            // to ignore:
            base,
            hover,
            text,
            shadow,
            border,
            // others:
            ...rest
        } = p
        const { background, textForCtx, /* styles, */ variables } = useColor(p)

        return (
            <div //
                {...rest}
                ref={ref}
                tw={[/* className, */ className, 'Box']}
                style={{ /* ...styles, */ ...style, ...variables }}
            >
                <ThemeCtx.Provider
                    value={{
                        background,
                        // ~~text must always remaian relative~~ => nope anymore ? ⁉️
                        text: textForCtx,
                    }}
                >
                    {/* <div>{JSON.stringify(background)}</div> */}
                    {/* <div>
                        text: {JSON.stringify(text)} ({JSON.stringify(p.text)})
                    </div> */}
                    {p.children}
                </ThemeCtx.Provider>
            </div>
        )
    },
    { forwardRef: true },
)
