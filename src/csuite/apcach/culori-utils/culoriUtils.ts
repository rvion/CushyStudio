import type { ConvertFn } from 'culori/src/converter'

import {
    differenceEuclidean,
    // @ts-ignore 🔴 todo: patch types
    inGamut,
    // @ts-ignore 🔴 todo: patch types
    toGamut,
    type Color,
    type Oklch,
} from 'culori'
import { converter, modeOklch, modeP3, useMode } from 'culori/fn'
import type { ColorInCSSFormat } from '../types'

useMode(modeP3)
useMode(modeOklch)

export const convertToOklch_orNull: ConvertFn<'oklch'> = converter('oklch')
export const convertToOklch_orThrow = (color: string | Color): Oklch => {
    const oklch = convertToOklch_orNull(color)
    if (!oklch) throw new Error('Could not convert to oklch')
    return oklch
}

export const convertToP3: ConvertFn<'p3'> = converter('p3')
export const convertToRgb: ConvertFn<'rgb'> = converter('rgb')

export type GamutCheck = (color: Color | ColorInCSSFormat) => boolean

export const inP3: GamutCheck = inGamut('p3')
export const toP3 = toGamut('p3', 'oklch', differenceEuclidean('oklch'), 0)

export const inSrgb: GamutCheck = inGamut('rgb')
export const toSrgb = toGamut('rgb', 'oklch', differenceEuclidean('oklch'), 0)
