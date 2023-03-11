import { RunMode } from './ComfyGraph'
import { makeAutoObservable } from 'mobx'
import { ComfyGraph } from './ComfyGraph'
import { ComfyClient } from './ComfyClient'
import { ComfyPromptJSON } from './ComfyPrompt'

export class ComfyProject {
    /** project name */
    name: string = 'Untitled'

    /** current  */
    focus: number = 0

    code: string = ''
    // script: ComfyScript = new ComfyScript(this)

    constructor(public client: ComfyClient) {
        makeAutoObservable(this)
    }

    /** converts a ComfyPromptJSON into it's canonical normal-form script */
    static LoadFromComfyPromptJSON = (json: ComfyPromptJSON) => {
        throw new Error('🔴 not implemented yet')
    }

    graphs: ComfyGraph[] = []

    get currentGraph() { return this.graphs[this.focus] } // prettier-ignore
    get currentOutputs() { return this.currentGraph.outputs } // prettier-ignore
    get schema() { return this.client.schema } // prettier-ignore

    run = async () => {
        return this.udpateCode(this.code, 'real')
    }

    // runningMode: RunMode = 'fake'

    /** * project running is not the same as graph running; TODO: explain */
    isRunning = false

    EVAL = async (mode: RunMode = 'fake'): Promise<boolean> => {
        // if (this.isRunning) return false
        // this.runningMode = mode
        // if (mode === 'real') this.isRunning = true
        if (this.code == null) {
            console.log('❌', 'no code to run')
            // this.isRunning = false
            return false
        }
        try {
            const finalCode = this.code.replace(`export {}`, '')
            const BUILD = new Function('C', `return (async() => { ${finalCode} })()`)
            const emptyGraph = new ComfyGraph(this)
            await BUILD(emptyGraph)
            console.log('✅')
            // this.isRunning = false
            return true
        } catch (error) {
            console.log('❌', error)
            // this.isRunning = false
            return false
        }
    }

    udpateCode = async (code: string, mode: RunMode) => {
        this.code = code
        // const script = new ComfyGraph(this)
        // const result = await script.EVAL(code, mode)
        // if (result) this.script = script
    }
}
