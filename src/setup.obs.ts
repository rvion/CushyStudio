import { obs } from './csuite/mobx/observer2'

const _ = globalThis as any
_.obs = obs
