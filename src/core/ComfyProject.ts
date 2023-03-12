import type { Maybe } from './ComfyUtils'
import type { RunMode } from './ComfyGraph'

import { makeAutoObservable } from 'mobx'
import { ComfyGraph } from './ComfyGraph'
import { ComfyClient } from './ComfyClient'
import { ComfyPromptJSON } from './ComfyPrompt'
import { nanoid } from 'nanoid'

export class ComfyProject {
    /** unique project id */
    id: string = nanoid()

    /** project name */
    name: string = 'Untitled'

    /** current  */
    focus: number = 0

    code: string = ''
    // script: ComfyScript = new ComfyScript(this)

    static INIT = (client: ComfyClient) => {
        const project = new ComfyProject(client)
        const graph = new ComfyGraph(project)
        project.graphs.push(graph)
        return project
    }

    private constructor(public client: ComfyClient) {
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

    /** * project running is not the same as graph running; TODO: explain */
    isRunning = false

    error: Maybe<string> = null
    runningMode: RunMode = 'fake'
    run = async (mode: RunMode = 'fake'): Promise<boolean> => {
        // if (this.isRunning) return false
        this.runningMode = mode
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

    udpateCode = async (code: string) => {
        this.code = code
        // const script = new ComfyGraph(this)
        // const result = await script.EVAL(code, mode)
        // if (result) this.script = script
    }
}
