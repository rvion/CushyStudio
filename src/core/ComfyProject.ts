import { Comfy } from './Comfy'
import { RunMode } from './ComfyScript'
import { makeAutoObservable } from 'mobx'
import { ComfyScript } from './ComfyScript'

export class ComfyProject {
    name: string = 'Untitled'
    focus: number = 0
    code: string = ''
    script: ComfyScript = new ComfyScript()

    run = async () => {
        return this.udpateCode(this.code, 'real')
    }

    udpateCode = async (code: string, mode: RunMode) => {
        this.code = code
        const script = new ComfyScript()
        const result = await script.EVAL(code, mode)
        if (result) this.script = script
    }

    constructor() {
        makeAutoObservable(this)
    }
}
