import type { RSSize } from '../RsuiteTypes'

export type FrameSize = {
    size?: Maybe<RSSize>
    square?: boolean
}

export function getClassNameForSize(p: FrameSize) {
    if (p.square) {
        if (p.size === 'xs') return 'w-6 h-6'
        if (p.size === 'sm') return 'w-8 h-8'
        if (p.size === 'md') return 'w-10 h-10'
        if (p.size === 'lg') return 'w-12 h-12'
        if (p.size === 'xl') return 'w-14 h-14'
    } else {
        if (p.size === 'xs') return 'text-xs px-0.5 py-0.5 line-height-[1.1em]'
        if (p.size === 'sm') return 'text-sm px-1   py-1   line-height-[1.1em]'
        if (p.size === 'md') return '        px-2   py-1   line-height-[1.1em]'
        if (p.size === 'lg') return 'text-lg px-4   py-2   line-height-[1.1em]'
        if (p.size === 'xl') return 'text-xl px-8   py-8   line-height-[1.1em]'
    }
    // return 'px-1'
    return ''
}
