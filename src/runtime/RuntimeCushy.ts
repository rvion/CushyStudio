import { makeAutoObservable } from 'mobx'
import { HostL } from 'src/models/Host'
import { Runtime } from './Runtime'

export class RuntimeCushy {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }
}
