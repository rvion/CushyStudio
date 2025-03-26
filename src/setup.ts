import { IKONS } from './csuite/icons/icons'
import { obs } from './csuite/mobx/observer2'

const _ = globalThis as any

// register a few globals
_.IKONS = IKONS
_.obs = obs
