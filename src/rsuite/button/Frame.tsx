import type { IconName } from '../../icons/icons'
import type { RSSize } from '../RsuiteTypes'

import Color from 'colorjs.io'
import { type CSSProperties, ReactNode } from 'react'

import { IkonOf } from '../../icons/iconHelpers'
import { Box } from '../../theme/colorEngine/Box'
import { exhaust } from '../../utils/misc/exhaust'

export type ButtonAppearance =
    /** no visual distinction */
    | 'headless'
    /** no border, very low contrast */
    | 'subtle'
    /** small border, low contrast */
    | 'default'
    /** a.k.a. outline: border but no contrast */
    | 'ghost'
    /** for readonly stuff */
    | 'link'
    /** panel or modal primary action; usually more chroma, more contrast */
    | 'primary'
    /** panel or modal secondary action */
    | 'secondary'

export type ButtonProps = {
    // color ---------------------------------------------------
    /** 🔶 usually not needed */
    hue?: number | string
    /** 🔶 usually not needed */
    hueShift?: number | undefined

    // look and feel -------------------------------------------
    appearance?: ButtonAppearance
    /** no visual distinction; equivalent to appearance='headless' */
    headless?: boolean
    /** no border, very low contrast; equivalent to appearance='subtle' */
    subtle?: boolean
    /** small border, low contrast; equivalent to appearance='default' */
    default?: boolean
    /** a.k.a. outline: border but no contrast; equivalent to appearance='ghost' */
    ghost?: boolean
    /** for readonly stuff; equivalent to appearance='link' */
    link?: boolean
    /** panel or modal primary action; usually more chroma, more contrast; equivalent to appearance='primary' */
    primary?: boolean
    /** panel or modal secondary action; equivalent to appearance='secondary' */
    secondary?: boolean

    // size ----------------------------------------------------
    size?: Maybe<RSSize>
    /** equivalent to size='xs' */
    xs?: boolean
    /** equivalent to size='sm' */
    sm?: boolean
    /** equivalent to size='md' */
    md?: boolean
    /** equivalent to size='lg' */
    lg?: boolean
    /** equivalent to size='xl' */
    xl?: boolean

    /** when true flex=1 */
    expand?: boolean
    /** when true, will try to force a square aspect ratio */
    square?: boolean

    // STATES ------------------------------------------------
    active?: Maybe<boolean>
    loading?: boolean
    disabled?: boolean

    // ICON --------------------------------------------------
    icon?: Maybe<IconName>

    // BEHAVIOUR ---------------------------------------------
    onClick?: (ev: React.MouseEvent<HTMLElement>) => void
    onMouseDown?: (ev: React.MouseEvent<HTMLElement>) => void
    onMouseUp?: (ev: React.MouseEvent<HTMLElement>) => void

    // -------------------------------------------------------
    tabIndex?: number
    className?: string
    style?: CSSProperties
    children?: ReactNode
}

// -------------------------------------------------
let isDragging = false
const isDraggingListener = (ev: MouseEvent) => {
    if (ev.button == 0) {
        isDragging = false
        window.removeEventListener('mouseup', isDraggingListener, true)
    }
}
export const Frame = (p: ButtonProps) => {
    const {
        icon,
        active,
        hue,
        hueShift,
        size,
        loading,
        disabled,
        primary,
        appearance: appearance_,
        onClick,
        className,
        ...rest
    } = p

    const appearance = getAppearance(p)
    const isDisabled = p.loading || p.disabled || false
    const chroma = getChroma({ active, appearance, isDisabled, primary })
    const contrast: number = getContrast(active, isDisabled, appearance)
    const border: number | undefined = getBorder(appearance)

    const hueFinal = ((): number | undefined => {
        if (p.hue == null) return
        if (typeof p.hue === 'number') return p.hue
        if (typeof p.hue === 'string') return new Color(p.hue).oklch[2]
        return
    })()
    return (
        <Box
            base={{ contrast, chroma, hue: hueFinal, hueShift }}
            hover={appearance !== 'headless'}
            tabIndex={p.tabIndex ?? -1}
            border={border}
            className={className}
            onMouseDown={(ev) => {
                if (ev.button == 0) {
                    p.onMouseDown?.(ev)
                    isDragging = true
                    window.addEventListener('mouseup', isDraggingListener, true)
                }
            }}
            onClick={(ev) => {
                onClick?.(ev)
            }}
            onMouseEnter={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                if (isDragging) onClick?.(ev)
            }}
            {...rest}
            tw={[
                getClassNameForSize(p),
                p.expand && 'flex-1',
                'Button_',
                'cursor-pointer',
                p.appearance === 'headless' ? undefined : 'justify-center rounded-sm flex gap-2 items-center',
            ]}
        >
            {p.icon && <IkonOf name={p.icon} />}
            {p.children && <div tw='line-clamp-1'>{p.children}</div>}
        </Box>
    )
}
function getAppearance(p: ButtonProps): ButtonAppearance {
    // boolean props
    if (p.headless) return 'headless'
    if (p.subtle) return 'subtle'
    if (p.default) return 'default'
    if (p.ghost) return 'ghost'
    if (p.link) return 'link'
    if (p.primary) return 'primary'
    if (p.secondary) return 'secondary'

    // generic prop
    if (p.appearance) return p.appearance

    // default
    return 'default'
}

function getClassNameForSize(p: ButtonProps) {
    if (p.square) {
        if (p.xs || p.size === 'xs') return 'w-6 h-6'
        if (p.sm || p.size === 'sm' || p.size == null) return 'w-8 h-8'
        if (p.md || p.size === 'md') return 'w-10 h-10'
        if (p.lg || p.size === 'lg') return 'w-12 h-12'
        if (p.xl || p.size === 'xl') return 'w-14 h-14'
    } else {
        if (p.xs || p.size === 'xs') return 'text-xs px-0.5 py-0.5 line-height-[1.1em]'
        if (p.sm || p.size === 'sm' || p.size == null) return 'text-sm px-1   py-1   line-height-[1.1em]'
        if (p.md || p.size === 'md') return '        px-2   py-1   line-height-[1.1em]'
        if (p.lg || p.size === 'lg') return 'text-lg px-4   py-2   line-height-[1.1em]'
        if (p.xl || p.size === 'xl') return 'text-xl px-8   py-8   line-height-[1.1em]'
    }
    return 'px-1'
}

function getChroma(p: {
    //
    active: Maybe<boolean>
    isDisabled: Maybe<boolean>
    primary: Maybe<boolean>
    appearance: Maybe<ButtonAppearance>
}) {
    if (p.active) return 0.1
    if (p.isDisabled) return 0.001
    if (p.primary || p.appearance === 'primary') return 0.1
    return
    // if (appearance === 'none') return undefined
    // if (appearance === 'ghost') return 0
    // if (appearance === 'link') return 0
    // if (appearance === 'default') return 0.1
    // if (appearance === 'subtle') return 0
    // if (appearance == null) return 0.05
    // exhaust(appearance)
    // return 0.1
}

function getBorder(appearance: Maybe<ButtonAppearance>) {
    if (appearance === 'headless') return undefined
    if (appearance === 'primary') return 3
    if (appearance === 'secondary') return 3
    if (appearance === 'ghost') return 0
    if (appearance === 'link') return 0
    if (appearance === 'default') return 1
    if (appearance === 'subtle') return 0.5
    if (appearance == null) return 1
    exhaust(appearance)
    return 1
}

function getContrast(
    //
    active: Maybe<boolean>,
    isDisabled: boolean,
    appearance: ButtonAppearance,
) {
    if (active) return 0.6
    if (isDisabled) return 0.05

    if (appearance === 'headless') return 0
    if (appearance === 'primary') return 0.9
    if (appearance === 'secondary') return 0.9
    if (appearance === 'ghost') return 0
    if (appearance === 'link') return 0
    if (appearance === 'default') return 0.1
    if (appearance === 'subtle') return 0
    if (appearance == null) return 0.1
    exhaust(appearance)
    return 0.1
}
