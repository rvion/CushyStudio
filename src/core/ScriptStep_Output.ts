import type { ScriptStep_Iface } from './ScriptStep_Iface'

export class ScriptStep_Output implements ScriptStep_Iface<string[]> {
    name = 'output'
    finished: Promise<string[]>
    constructor(public images: string[]) {
        this.finished = Promise.resolve(this.images)
    }
}
