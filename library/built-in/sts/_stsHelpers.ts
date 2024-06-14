import { exhaust } from '../../../src/csuite/utils/exhaust'
import { type SimpleColor, type SimpleKind, type SimpleRarity } from './_stsAssets'
import { type STSCard } from './_stsCards'

// helpes below convert from real data to simplified data
// cause I don't have all the assets.

export const convertColors = (color: STSCard['Color']): SimpleColor => {
    if (color === 'Red') return 'red'
    if (color === 'Green') return 'green'
    // TODO: ----------------------------------------------
    if (color === 'Blue') return 'gray' // TODO
    if (color === 'Curse') return 'gray' // TODO
    if (color === 'Colorless') return 'gray' // TODO
    if (color === 'Purple') return 'gray' // TODO
    exhaust(color)
    return 'gray'
}

export const convertKind = (kind: STSCard['Type']): SimpleKind => {
    if (kind === 'Attack') return 'attack'
    if (kind === 'Skill') return 'skill'
    if (kind === 'Power') return 'power'
    // TODO: ----------------------------------------------
    if (kind === 'Curse') return 'skill' // TODO
    if (kind === 'Status') return 'skill' // TODO
    exhaust(kind)
    return 'skill'
}

export const convertRarity = (kind: STSCard['Rarity']): SimpleRarity => {
    if (kind === 'Common') return 'common'
    if (kind === 'Uncommon') return 'uncommon'
    if (kind === 'Rare') return 'rare'
    // TODO: ----------------------------------------------
    if (kind === 'Basic') return 'common' // TODO
    if (kind === 'Curse') return 'common' // TODO
    if (kind === 'Special') return 'common' // TODO
    exhaust(kind)
    return 'common'
}
