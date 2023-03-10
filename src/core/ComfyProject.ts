import { makeAutoObservable } from 'mobx'
import { ComfyScript } from './ComfyScript'

export class ComfyProject {
    name: string = 'Untitled'
    script: ComfyScript = new ComfyScript()
    constructor() {
        makeAutoObservable(this)
    }
}
