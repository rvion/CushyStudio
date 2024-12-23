import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

/** namespace for all canvas-related utils */
export class RuntimeCanvas {
   constructor(private rt: Runtime) {
      makeAutoObservable(this)
   }
}
