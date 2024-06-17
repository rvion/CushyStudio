import type { ColorSpace, ColorInCSSFormat } from '../types'

import { type Color } from 'culori'
import { ASSERT_EXAUSTED } from '../utils/assert'
import { clampColorToP3 } from './_clampColorToP3'
import { clampColorToSRGB } from './_clampColorToSRGB'

// ----------------------------------------------------------------------

export function clampColorToSpace(
    //
    colorInCssFormat: Color, // | ColorInCSSFormat,
    colorSpace: ColorSpace,
): Color /* | ColorInCSSFormat */ {
    if (colorSpace === 'p3') return clampColorToP3(colorInCssFormat)
    if (colorSpace === 'rgb') return clampColorToSRGB(colorInCssFormat)
    if (colorSpace === 'srgb') return clampColorToSRGB(colorInCssFormat)

    return ASSERT_EXAUSTED(colorSpace, 'unknown colorSpace')
}
