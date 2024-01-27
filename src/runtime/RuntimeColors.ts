import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

/** namespace for all color-related utils */
export class RuntimeColors {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }

    /**
     * generate a random hex color
     * example result: "#f0f0f0"
     */
    randomHexColor = (): string => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16)
    }
}
