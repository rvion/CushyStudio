import type { TintExt } from '../kolor/Tint'

export type SimpleBoxShadow = {
    inset?: boolean
    x?: number
    y?: number
    blur?: number
    spread?: number
    color?: TintExt
}
