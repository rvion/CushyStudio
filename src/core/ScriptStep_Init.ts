import type { ScriptStep_Iface } from './ScriptStep_Iface'

export class ScriptStep_Init implements ScriptStep_Iface<true> {
    name = 'init'
    finished = Promise.resolve<true>(true)
}
