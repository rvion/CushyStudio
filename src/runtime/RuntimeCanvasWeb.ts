import { makeAutoObservable } from 'mobx'
import { Runtime } from './Runtime'

export class RuntimeCanvasNative {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }
}
