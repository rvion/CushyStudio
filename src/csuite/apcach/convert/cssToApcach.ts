import type { ContrastConfig } from '../contrast/contrastConfig'
import type { ColorSpace, ContrastModel, Maybe, SearchDirection } from '../types'

import { parse, type Color, type Oklch } from 'culori'
import { clampColorToSpace } from '../clamp/clampColorToSpace'
import { crToBg, crToFg } from '../contrast/crTo'
import { apcach } from '../index'
import { convertToOklch_orThrow } from '../culori-utils/culoriUtils'
import { calcContrast } from '../scoring/calcContrast'

/**
 * The apcach format can be restored from color in CSS format
 * using the function cssToApcach():
 */
export function cssToApcach(
    /** color in CSS format that you want to convert to apcach format */
    colorStr: string,

    /** comparing color
     * if it's on the background position: { bg : comparingColor }
     * if it's in the foreground position: { fg : comparingColor }
     *
     * (supported formats: oklch, oklab, display-p3, lch, lab, hex, rgb, hsl, p3)
     */
    antagonist: { bg?: string; fg?: string },
    colorSpace: ColorSpace = 'p3',
    contrastModel: ContrastModel = 'apca',
) {
    // ensure color is not null
    if (colorStr == null) throw new Error('Color is undefined')

    // enusre color is valid
    const color: Maybe<Color> = parse(colorStr)
    if (color == null) throw new Error('Color is invalid')

    const fg_raw = antagonist.fg
    const bg_raw = antagonist.bg

    // ensure antagonist is specified
    if (fg_raw == null && bg_raw == null) throw new Error('antagonist color is not provided')

    // ensure antagonist is either fg xor bg, not both
    if (fg_raw != null && bg_raw != null) throw new Error("antagonist can't be both fb and bg")

    const fg: Maybe<Color> = fg_raw != null ? parse(fg_raw) : undefined
    const bg: Maybe<Color> = bg_raw != null ? parse(bg_raw) : undefined

    const fgColor: Color = clampColorToSpace(fg ?? color, colorSpace)
    const bgColor: Color = clampColorToSpace(bg ?? color, colorSpace)

    // get the contrast function
    const crFunction = fg != null ? crToFg : crToBg

    // get the antagonist color
    const antagonistColor = fg_raw ?? bg_raw!

    const contrast = calcContrast(fgColor, bgColor, contrastModel, colorSpace)

    // Compose apcach
    const colorClamped: Color = clampColorToSpace(color, colorSpace)
    const colorComp: Oklch = convertToOklch_orThrow(colorClamped)
    const antagonistColorOklch: Oklch = convertToOklch_orThrow(antagonistColor)
    const isColorLighter: boolean = colorComp.l > antagonistColorOklch.l
    const searchDirection: SearchDirection = isColorLighter ? 'lighter' : 'darker'

    const contrastConfigXX: ContrastConfig = crFunction(
        antagonistColor,
        contrast,
        contrastModel,
        searchDirection,
    )

    return apcach(
        //
        contrastConfigXX,
        colorComp.c,
        colorComp.h ?? 0,
        colorComp.alpha ?? 1,
        colorSpace,
    )
}
