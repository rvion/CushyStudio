import type { IconName } from '../icons/icons'
import type { RSAppearance, RSSize } from './RsuiteTypes'

import Color from 'colorjs.io'
import { type CSSProperties, ReactNode } from 'react'

import { IkonOf } from '../icons/iconHelpers'
import { Box } from '../theme/colorEngine/Box'
import { exhaust } from '../utils/misc/exhaust'

let isDragging = false
// inputs

export const Button = (p: {
    // size
    expand?: boolean
    // color
    primary?: boolean
    secondary?: boolean
    // size
    xs?: boolean
    sm?: boolean
    md?: boolean
    lg?: boolean
    xl?: boolean
    size?: Maybe<RSSize>
    // -------------------------
    // hack
    tabIndex?: number
    square?: boolean
    hue?: number | string
    hueShift?: number | undefined
    className?: string
    icon?: Maybe<IconName>
    active?: Maybe<boolean>
    loading?: boolean
    disabled?: boolean
    appearance?: Maybe<RSAppearance | 'none'>
    style?: CSSProperties
    /** 🔶 DO NOT USE; for */
    onClick?: (ev: React.MouseEvent<HTMLElement>) => void
    children?: ReactNode
}) => {
    const {
        //
        icon,
        active,
        hue,
        hueShift,
        size,
        loading,
        disabled,
        appearance,
        onClick,
        className,
        ...rest
    } = p

    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button == 0) {
            isDragging = false
            window.removeEventListener('mouseup', isDraggingListener, true)
        }
    }

    const isDisabled = p.loading || p.disabled || false
    const chroma: number | undefined = (() => {
        if (active) return 0.1
        if (isDisabled) return 0.001
        if (p.primary || appearance === 'primary') return 0.1
        return
        // if (appearance === 'none') return undefined
        // if (appearance === 'ghost') return 0
        // if (appearance === 'link') return 0
        // if (appearance === 'default') return 0.1
        // if (appearance === 'subtle') return 0
        // if (appearance == null) return 0.05
        // exhaust(appearance)
        // return 0.1
    })()

    const contrast: number = (() => {
        if (active) return 0.8
        if (isDisabled) return 0.05

        if (appearance === 'none') return 0
        if (appearance === 'primary' || p.primary) return 0.3
        if (appearance === 'ghost') return 0
        if (appearance === 'link') return 0
        if (appearance === 'default') return 0.1
        if (appearance === 'subtle') return 0
        if (appearance == null) return 0.1
        exhaust(appearance)
        return 0.1
    })()

    const border: number | undefined = (() => {
        if (appearance === 'none') return undefined
        if (appearance === 'primary') return 3
        if (appearance === 'ghost') return 0
        if (appearance === 'link') return 0
        if (appearance === 'default') return 1
        if (appearance === 'subtle') return 0.5
        if (appearance == null) return 1
        exhaust(appearance)
        return 1
    })()

    const hueFinal = ((): number | undefined => {
        if (p.hue == null) return
        if (typeof p.hue === 'number') return p.hue
        if (typeof p.hue === 'string') return new Color(p.hue).oklch[2]
        return
    })()
    return (
        <Box
            base={{ contrast, chroma, hue: hueFinal, hueShift }}
            hover={p.appearance !== 'none'}
            tabIndex={p.tabIndex ?? -1}
            border={border}
            className={className}
            onMouseDown={(ev) => {
                if (ev.button == 0) {
                    onClick?.(ev)
                    isDragging = true
                    window.addEventListener('mouseup', isDraggingListener, true)
                }
            }}
            onMouseEnter={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                if (isDragging) onClick?.(ev)
            }}
            {...rest}
            tw={[
                p.expand && 'flex-1',
                'Button_',
                'cursor-pointer',
                p.appearance === 'none' ? undefined : 'justify-center',
                'rounded-sm flex gap-2 items-center',
                // size stuff
                (() => {
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
                    //   return exhaust(p.size)
                })(),
            ]}
        >
            {p.icon && <IkonOf name={p.icon} />}
            {p.children && <div tw='line-clamp-1'>{p.children}</div>}
        </Box>
    )
}
