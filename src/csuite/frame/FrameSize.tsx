import type { RSSize } from '../types/RsuiteTypes'

import { exhaust } from '../utils/exhaust'

export type FrameSize = {
    size?: Maybe<RSSize>
    square?: boolean
}

// prettier-ignore
export function getClassNameForSize(p: FrameSize): Maybe<string> {
    if (p.square) {
        if (p.size === 'input') return `h-input w-input text-sm`

        if (p.size === 'xs')    return 'w-6  h-6'
        if (p.size === 'sm')    return 'w-8  h-8'
        if (p.size === 'md')    return 'w-10 h-10'
        if (p.size === 'lg')    return 'w-12 h-12'
        if (p.size === 'xl')    return 'w-14 h-14'
        if (p.size == null)     return
        exhaust(p.size)
    } else {
        if (p.size === 'input') return `h-input text-sm`

        if (p.size === 'xs')    return 'text-xs px-0.5 py-0.5'
        if (p.size === 'sm')    return 'text-sm px-1   py-1  '
        if (p.size === 'md')    return '        px-2   py-1  '
        if (p.size === 'lg')    return 'text-lg px-4   py-2  '
        if (p.size === 'xl')    return 'text-xl px-8   py-8  '
        if (p.size == null)     return
        exhaust(p.size)
    }
    return ''
}
