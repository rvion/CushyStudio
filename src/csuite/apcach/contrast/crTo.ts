import { parse, type Oklch } from 'culori'
import type { ContrastRatio, ContrastModel, SearchDirection } from '../types'
import { TO_FIND, type ContrastConfig } from './contrastConfig'
import { convertToOklch_orThrow } from '../culori-utils/culoriUtils'

/** TODO */
export function crToBg(
    bgColor: string,
    cr: ContrastRatio,
    contrastModel: ContrastModel = 'apca',
    searchDirection: SearchDirection = 'auto',
): ContrastConfig {
    return {
        fgColor: TO_FIND,
        bgColor: _stringToColor(bgColor),
        cr,
        contrastModel,
        searchDirection,
    }
}

export function crToFg(
    fgColor: string,
    cr: ContrastRatio,
    contrastModel: ContrastModel = 'apca',
    searchDirection: SearchDirection = 'auto',
): ContrastConfig {
    return {
        fgColor: _stringToColor(fgColor),
        bgColor: TO_FIND,
        cr,
        contrastModel,
        searchDirection,
    }
}
// aliasa `crTo` to `crToBg  --------------------------------------------------------------

export function crTo(
    bgColor: string,
    cr: ContrastRatio,
    contrastModel: ContrastModel = 'apca',
    searchDirection: SearchDirection = 'auto',
): ContrastConfig {
    return crToBg(bgColor, cr, contrastModel, searchDirection)
}
// misc presets --------------------------------------------------------------

export function crToBgWhite(
    cr: ContrastRatio,
    contrastModel: ContrastModel = 'apca',
    searchDirection: SearchDirection = 'auto',
): ContrastConfig {
    return crToBg('white', cr, contrastModel, searchDirection)
}

export function crToBgBlack(
    cr: ContrastRatio,
    contrastModel: ContrastModel = 'apca',
    searchDirection: SearchDirection = 'auto',
): ContrastConfig {
    return crToBg('black', cr, contrastModel, searchDirection)
}

export function crToFgWhite(
    cr: ContrastRatio,
    contrastModel: ContrastModel = 'apca',
    searchDirection: SearchDirection = 'auto',
) {
    return crToFg('white', cr, contrastModel, searchDirection)
}

export function crToFgBlack(
    cr: ContrastRatio,
    contrastModel: ContrastModel = 'apca',
    searchDirection: SearchDirection = 'auto',
) {
    return crToFg('black', cr, contrastModel, searchDirection)
}

function _stringToColor(str: string): Oklch {
    switch (str) {
        case 'black':
            return { mode: 'oklch', l: 0, c: 0, h: 0 } // 'oklch(0 0 0)'
        case 'white':
            return { mode: 'oklch', l: 1, c: 0, h: 0 }
        // 'oklch(1 0 0)'
        default:
            // return str
            return convertToOklch_orThrow(str)
        // parse(str)
        // return ,
    }
}
