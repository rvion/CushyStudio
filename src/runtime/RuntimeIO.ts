import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

/** namespace for all extra utils */
export class RuntimeIO {
   constructor(private rt: Runtime) {
      makeAutoObservable(this)
   }
}
