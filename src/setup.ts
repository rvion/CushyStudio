// register a few globals
const _ = globalThis as any

// inject obs
const { obs } = await import ('./csuite/mobx/observer2')
_.obs = obs

// inject icons
const { IKONS } = await import ('./csuite/icons/icons')
_.IKONS = IKONS

// inject the builder
await import('./controls/CushyBuilder')

const { getBuilder } = await import ('./csuite/model/b')
_.getBuilder = getBuilder


export const __ = 0