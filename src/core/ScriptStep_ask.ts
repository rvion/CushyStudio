import { makeAutoObservable } from 'mobx'
import { ScriptStep_Iface } from './ScriptStep_Iface'

export class ScriptStep_ask implements ScriptStep_Iface {
    name = 'ask'
    constructor(public msg: string) {
        makeAutoObservable(this)
    }
    finished = Promise.resolve(this) // 🔴
}
