import type { RSSize } from '../RsuiteTypes'

export type FrameSize = {
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

    /** when true, will try to force a square aspect ratio */
    square?: boolean
}

export function getClassNameForSize(p: FrameSize) {
    if (p.square) {
        if (p.xs || p.size === 'xs') return 'w-6 h-6'
        if (p.sm || p.size === 'sm') return 'w-8 h-8'
        if (p.md || p.size === 'md') return 'w-10 h-10'
        if (p.lg || p.size === 'lg') return 'w-12 h-12'
        if (p.xl || p.size === 'xl') return 'w-14 h-14'
    } else {
        if (p.xs || p.size === 'xs') return 'text-xs px-0.5 py-0.5 line-height-[1.1em]'
        if (p.sm || p.size === 'sm') return 'text-sm px-1   py-1   line-height-[1.1em]'
        if (p.md || p.size === 'md') return '        px-2   py-1   line-height-[1.1em]'
        if (p.lg || p.size === 'lg') return 'text-lg px-4   py-2   line-height-[1.1em]'
        if (p.xl || p.size === 'xl') return 'text-xl px-8   py-8   line-height-[1.1em]'
    }
    // return 'px-1'
    return ''
}
