import type { TintExt } from '../kolor/Tint'

export type SimpleBoxShadow = {
    inset?: boolean
    x?: number
    y?: number
    blur?: number
    spread?: number
    color?: TintExt
}

export type SimpleDropShadow = {
    x?: number
    y?: number
    blur?: number
    color?: TintExt
    opacity?: number
}
