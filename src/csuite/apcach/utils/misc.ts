import type { Oklch } from 'culori'
import type { RGB_or_P3 } from '../types'

/**
 * 1. ensure every oklch properties are set
 * 2. round to decimal places to something sane
 */
export function healOklch(oklch: Oklch): Oklch {
    oklch.l = oklch.l === undefined ? 0 : roundToDP(oklch.l, 7)
    oklch.c = oklch.c === undefined ? 0 : roundToDP(oklch.c, 16)
    oklch.h = oklch.h === undefined ? 0 : roundToDP(oklch.h, 16)
    oklch.alpha = oklch.alpha === undefined ? 1 : roundToDP(oklch.alpha, 4)
    return oklch
}

/** round to decimal places */
export function roundToDP(number: number, dp: number): number {
    return Math.floor(number * 10 ** dp) / 10 ** dp
}

/**
 *  1 when >= 0,
 * -1 otherwise
 */
export function signOf(number: number): 1 | -1 {
    return number >= 0 ? 1 : -1
    // 💬 2024-06-16 rvion:
    // | 🔶 this seems to be dangerous (divide by 0?)
    // | `return number / Math.abs(number);`
}

/**
 * clip contrast to [0,108]
 * APCA contrast can't go above 108:
 * https://www.myndex.com/APCA/
 */
export function clipContrast(cr: number): number {
    return Math.max(Math.min(cr, 108), 0)
}

/**
 * clip chroma to [0, 0.37]
 * 🔶 chroma can technically go above 0.37.
 * 💬 2024-06-16 rvion:
 * | Isn't 0.37 is a bit too low, wouldn't .4, or even .45 better
 * | to cover a tiny bit more colors?
 */
export function clipChroma(c: number): number {
    return Math.max(Math.min(c, 0.37), 0)
}

/**
 * clip hue to [0, 360]
 * 💬 2024-06-16 rvion:
 * | 🔴 probably should do some mod instead of simple clamp.
 */
export function clipHue(h: number): number {
    return Math.max(Math.min(h, 360), 0)
}

export function floatingPointToHex(float: number): string {
    return Math.round(255 * float)
        .toString(16)
        .padStart(2, '0')
}

export function blendCompColors(
    //
    fgCompColor: RGB_or_P3,
    bgCompColor: RGB_or_P3,
): RGB_or_P3 {
    if (
        fgCompColor.alpha == null || //
        fgCompColor.alpha === 1
    ) {
        return fgCompColor
    }

    // prettier-ignore
    /* 💊 */ if (
    /* 💊 */     //
    /* 💊 */     fgCompColor.r > 1 ||
    /* 💊 */     bgCompColor.r > 1 ||
    /* 💊 */     fgCompColor.g > 1 ||
    /* 💊 */     bgCompColor.g > 1 ||
    /* 💊 */     fgCompColor.b > 1 ||
    /* 💊 */     bgCompColor.b > 1
    /* 💊 */ ) {
    /* 💊 */     console.log(`[🤠] `, fgCompColor, bgCompColor)
    /* 💊 */ }

    // Blend color with the bg
    return {
        b: _blendChannel(fgCompColor.b, bgCompColor.b, fgCompColor.alpha),
        g: _blendChannel(fgCompColor.g, bgCompColor.g, fgCompColor.alpha),
        r: _blendChannel(fgCompColor.r, bgCompColor.r, fgCompColor.alpha),
    }
}

function _blendChannel(
    //
    channelFg: number,
    channelBg: number,
    alpha: number,
): number {
    return channelBg + (channelFg - channelBg) * alpha
}
