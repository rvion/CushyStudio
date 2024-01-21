import { makeAutoObservable } from 'mobx'
import { Runtime } from './Runtime'

/** namespace for all extra utils */
export class RuntimeIO {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }
}
