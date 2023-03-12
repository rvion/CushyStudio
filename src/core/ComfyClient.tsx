import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'

import * as WS from 'ws'

import { makeAutoObservable } from 'mobx'
import { a__ } from '../ui/samples/a'
import { WsMsg } from './ComfyAPI'
import { ComfyProject } from './ComfyProject'
import { ComfySchema } from './ComfySchema'
import { ComfyScriptEditor } from './ComfyScriptEditor'
import { initialize } from 'esbuild'

export type ComfyManagerOptions = {
    serverIP: string
    serverPort: number
    spec: ComfySchemaJSON
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
    schema: ComfySchema
    dts: string
    project: ComfyProject
    projects: ComfyProject[] = []
    editor: ComfyScriptEditor
    // dtsModel?: ITextModel

    // openProject = () => {
    //     const monaco = this.monacoRef.current
    //     if (monaco == null) return console.log('🔴 monaco not ready')

    //     // // for (const file of Object.values(virtualFilesystem)) {
    //     // const uri = monaco.Uri.parse(`file:///${file.name}`)
    //     // const model = monaco.editor.createModel(file.value, 'typescript', uri)
    //     // // }
    //     // const aModel = monaco.editor.getModel(monaco.Uri.parse(`file:///a.ts`))
    //     // // st.file = aModel
    //     // client.project.udpateCode(virtualFilesystem['a.ts'].value)
    // }

    constructor(opts: ComfyManagerOptions) {
        this.serverIP = opts.serverIP
        this.serverPort = opts.serverPort
        this.editor = new ComfyScriptEditor(this)
        this.schema = new ComfySchema(opts.spec)
        this.project = ComfyProject.INIT(this)
        this.projects.push(this.project)
        this.dts = this.schema.codegenDTS()
        this.startWSClient()
        makeAutoObservable(this)
        setTimeout(async () => {
            await this.fetchObjectsSchema()
            this.editor.openCODE()
        }, 1000)
    }

    get serverHost() {
        return `${this.serverIP}:${this.serverPort}`
    }

    fetchPrompHistory = async () => {
        const x = await fetch(`http://${this.serverHost}/history`, {}).then((x) => x.json())
        return x
    }

    /** retri e the comfy spec from the schema*/
    fetchObjectsSchema2 = async (): Promise<ComfySchemaJSON> => {
        const base = window.location.href
        const res = await fetch(`${base}/object_infos.json`, {})
        const schema$: ComfySchemaJSON = await res.json()
        // console.log('🟢 schema$:', schema$)
        this.schema.update(schema$)
        console.log('🟢 schema:', this.schema.nodes)
        return schema$
    }

    /** retri e the comfy spec from the schema*/
    fetchObjectsSchema = async (): Promise<ComfySchemaJSON> => {
        // 1. fetch schema$
        const timeoutController = new AbortController()
        const timeoutID = setTimeout(() => timeoutController.abort(), 2000)
        const url = `http://${this.serverHost}/object_info`
        const res = await fetch(url, { signal: timeoutController.signal })
        clearTimeout(timeoutID)
        const schema$: ComfySchemaJSON = await res.json()
        // 2. update schmea
        this.schema.update(schema$)
        // 3. update dts
        this.dts = this.schema.codegenDTS()
        // 4. update monaco
        this.editor.updateSDKDTS()
        this.editor.updateLibDTS()
        this.editor.updateCODE(a__)
        this.project.udpateCode(a__)
        console.log('🟢 schema:', this.schema.nodes)
        return schema$
    }
    static Init = () => {}

    // TODO: finish this
    get wsStatusTxt() {
        if (this.ws == null) return 'not initialized'
        if (this.ws?.readyState === WebSocket.OPEN) return 'connected'
        if (this.ws?.readyState === WebSocket.CLOSED) return 'disconnected'
        return 'connecting'
    }
    wsStatus: 'on' | 'off' = 'off'
    get wsStatusEmoji() {
        if (this.wsStatus === 'on') return '🟢'
        if (this.wsStatus === 'off') return '🔴'
        return '❓'
    }

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    get dtsStatusEmoji() {
        if (this.dts.length > 10_000) return '🟢'
        return '🔴'
    }

    ws: Maybe<WS.WebSocket | WebSocket> = null
    startWSClient = () => {
        if (this.ws) {
            if (this.ws?.readyState === WebSocket.OPEN) this.ws.close()
            this.wsStatus = 'off'
        }
        const ws =
            typeof window !== 'undefined'
                ? new WebSocket(`ws://${this.serverHost}/ws`)
                : new WS.WebSocket(`ws://${this.serverHost}/ws`)
        ws.binaryType = 'arraybuffer'
        ws.onopen = () => {
            console.log('connected')
            this.wsStatus = 'on'
        }
        ws.onmessage = (e: WS.MessageEvent) => {
            const msg: WsMsg = JSON.parse(e.data as any)
            console.log('>>', JSON.stringify(msg))
            // 🔴 ROUTING must be done at the API level
            if (msg.type === 'status') return this.project.currentGraph.onStatus(msg)
            if (msg.type === 'progress') return this.project.currentGraph.onProgress(msg)
            if (msg.type === 'executing') return this.project.currentGraph.onExecuting(msg)
            if (msg.type === 'executed') return this.project.currentGraph.onExecuted(msg)
            throw new Error('Unknown message type: ' + msg)
        }
        this.ws = ws
    }
}
