export type Number0To1 = number
export type RGB_or_P3 = { r: number; g: number; b: number; alpha?: number }
export type ContrastRatio = number
export type SearchDirection = 'auto' | 'lighter' | 'darker'
export type Maybe<T> = T | null | undefined
export type ContrastModel = 'apca' | 'wcag'
export type ColorSpace = 'p3' | 'rgb' | 'srgb'
export type ColorInCSSFormat = string
export type HueExpr = number | string | ((hue: number) => number)
