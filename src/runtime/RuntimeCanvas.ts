import { makeAutoObservable } from 'mobx'
import { Runtime } from './Runtime'

/** namespace for all canvas-related utils */
export class RuntimeCanvas {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }
}
