import { makeAutoObservable } from 'mobx'
import { Runtime } from './Runtime'

/** namespace for all cushy-related utils */
export class RuntimeCushy {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }
}
