import * as WS from 'ws'

import { makeAutoObservable } from 'mobx'
import { WsMsg } from './ComfyAPI'
import { ComfyProject } from './ComfyProject'
import { ComfyTypingsGenerator } from './ComfyTypingsGenerator'
import { ComfySchema } from './ComfySchema'

export type ComfyManagerOptions = {
    serverIP: string
    serverPort: number
    spec: ComfySchema
}

/**
 * global State
 *  - manages connection to the backend
 *  - manages list of known / open projects
 *  - dispatches messages to the right projects
 */
export class ComfyClient {
    serverIP: string
    serverPort: number
    spec: ComfySchema
    schemaGenerator: ComfyTypingsGenerator
    libDTS: string
    constructor(opts: ComfyManagerOptions) {
        this.serverIP = opts.serverIP
        this.serverPort = opts.serverPort
        this.spec = opts.spec
        this.schemaGenerator = new ComfyTypingsGenerator(this.spec)
        this.libDTS = this.schemaGenerator.codegenDTS()
        this.startWSClient()
        makeAutoObservable(this)
    }

    get serverHost() {
        return `${this.serverIP}:${this.serverPort}`
    }

    /** initial project */
    project: ComfyProject = new ComfyProject(this)

    /** list of known projects */
    projects: ComfyProject[] = [this.project]

    fetchPrompHistory = async () => {
        const x = await fetch(`http://${this.serverHost}/history`, {}).then((x) => x.json())
    }

    // $schema: Comfy =
    fetchObjectsSchema = async () => {
        const x = await fetch(`http://${this.serverHost}/object_info`, {}).then((x) => x.json())
    }

    static Init = () => {}

    startWSClient = () => {
        const ws =
            typeof window !== 'undefined'
                ? new WebSocket(`ws://${this.serverHost}/ws`)
                : new WS.WebSocket(`ws://${this.serverHost}/ws`)
        ws.binaryType = 'arraybuffer'
        ws.onopen = () => console.log('connected')
        ws.onmessage = (e: WS.MessageEvent) => {
            const msg: WsMsg = JSON.parse(e.data as any)
            console.log('>>', JSON.stringify(msg))
            // 🔴 ROUTING must be done at the API level
            if (msg.type === 'status') return this.project.script.onStatus(msg)
            if (msg.type === 'progress') return this.project.script.onProgress(msg)
            if (msg.type === 'executing') return this.project.script.onExecuting(msg)
            if (msg.type === 'executed') return this.project.script.onExecuted(msg)
            throw new Error('Unknown message type: ' + msg)
        }
    }
}
