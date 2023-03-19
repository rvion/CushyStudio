import { nanoid } from 'nanoid'
import type { ScriptStep_Iface } from './ScriptStep_Iface'

export class ScriptStep_Output implements ScriptStep_Iface<string[]> {
    uid = nanoid()
    name = 'output'
    finished: Promise<string[]>
    constructor(public images: string[]) {
        this.finished = Promise.resolve(this.images)
    }
}
