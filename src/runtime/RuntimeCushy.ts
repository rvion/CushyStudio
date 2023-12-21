import { makeAutoObservable } from 'mobx'
import { Runtime } from './Runtime'

export class RuntimeCushy {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }
}
