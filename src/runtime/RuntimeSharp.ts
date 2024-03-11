import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

export class RuntimeSharp {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }
}
