import { ScriptStep_Iface } from './ScriptStep_Iface'

export class ScriptStep_Init implements ScriptStep_Iface {
    name = 'init'
    finished = Promise.resolve(this)
}
