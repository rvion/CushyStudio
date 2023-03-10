import { RunMode } from './ComfyGraph'
import { makeAutoObservable } from 'mobx'
import { ComfyGraph } from './ComfyGraph'
import { ComfyManager } from './ComfyManager'

export class ComfyProject {
    name: string = 'Untitled'
    focus: number = 0
    code: string = ''
    // script: ComfyScript = new ComfyScript(this)

    constructor(public manager: ComfyManager) {
        makeAutoObservable(this)
    }

    versions: ComfyGraph[] = [new ComfyGraph(this)]

    get script() {
        return this.versions[this.focus]
    }

    get outputs() {
        return this.script.outputs
    }

    run = async () => {
        return this.udpateCode(this.code, 'real')
    }

    // runningMode: RunMode = 'fake'

    udpateCode = async (code: string, mode: RunMode) => {
        this.code = code
        const script = new ComfyGraph(this)
        const result = await script.EVAL(code, mode)
        if (result) this.script = script
    }
}
