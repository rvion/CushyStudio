import { nanoid } from 'nanoid'
import type { ScriptStep_Iface } from './ScriptStep_Iface'

export class ScriptStep_Init implements ScriptStep_Iface<true> {
    uid = nanoid()
    name = 'init'
    finished = Promise.resolve<true>(true)
}
