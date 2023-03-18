import { ScriptStep_Iface } from './ScriptStep_Iface'

export class ScriptStep_Output implements ScriptStep_Iface {
    name = 'output'
    constructor(public images: string[]) {}
    finished = Promise.resolve(this)
}
