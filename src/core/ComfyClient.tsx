import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'
import type { ScriptExecution } from './ScriptExecution'
import { ScriptStep } from './ScriptStep'

import * as WS from 'ws'

import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'
import { a__ } from '../ui/samples/a'
import { AutoSaver } from './AutoSaver'
import { ComfyStatus, WsMsg } from './ComfyAPI'
import { ComfyProject } from './ComfyProject'
import { ComfySchema } from './ComfySchema'
import { ComfyScriptEditor } from './ComfyScriptEditor'
import { getPngMetadata } from './getPngMetadata'
import { ScriptStep_prompt } from './ScriptStep_prompt'

export type ComfyClientOptions = {
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

    assets = new Map<string, boolean>()

    storageServerKey = 'comfy-server'
    getStoredServerKey = () => {}

    getConfig = () => ({
        serverIP: this.serverIP,
        serverPort: this.serverPort,
        spec: this.schema.spec,
    })

    autosaver = new AutoSaver('client', this.getConfig)

    constructor(opts: ComfyClientOptions) {
        const prev = this.autosaver.load()
        if (prev) Object.assign(opts, prev)
        this.autosaver.start()
        this.serverIP = opts.serverIP
        this.serverPort = opts.serverPort
        this.editor = new ComfyScriptEditor(this)
        this.schema = new ComfySchema(opts.spec)
        this.project = ComfyProject.INIT(this)
        this.projects.push(this.project)
        // this.projects.push(ComfyProject.INIT(this))
        this.dts = this.schema.codegenDTS()
        this.startWSClient()
        makeAutoObservable(this)
        setTimeout(async () => {
            await this.fetchObjectsSchema()
            this.editor.openCODE()
            // this.project.run()
        }, 500)
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
        // console.log('🟢 schema:', this.schema.nodes)
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
        // console.log('🟢 schema:', this.schema.nodes)
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

    sid: string = 'temporary'
    status: ComfyStatus | null = null
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
            console.log('[👢] connected')
            this.wsStatus = 'on'
        }
        ws.onmessage = (e: WS.MessageEvent) => {
            const msg: WsMsg = JSON.parse(e.data as any)
            console.log(`[🐰] %c${msg.type} %c${JSON.stringify(msg.data)}`, 'color:#90bdff', 'color:gray')
            if (msg.type === 'status') {
                if (msg.data.sid) this.sid = msg.data.sid
                this.status = msg.data.status
                return
            }

            // ensure current project is running
            const project: ComfyProject = this.project
            const currentRun: ScriptExecution | null = project.currentRun
            if (currentRun == null) return console.log(`❌ received ${msg.type} but currentRun is null`)

            // ensure current step is a prompt
            const promptStep: ScriptStep = currentRun.step
            if (!(promptStep instanceof ScriptStep_prompt))
                return console.log(`❌ received ${msg.type} but currentStep is not prompt`)

            // defer accumulation to ScriptStep_prompt
            if (msg.type === 'progress') return promptStep.onProgress(msg)
            if (msg.type === 'executing') return promptStep.onExecuting(msg)
            if (msg.type === 'executed') return promptStep.onExecuted(msg)

            // unknown message payload ?
            console.log('❌', 'Unknown message:', msg)
            throw new Error('Unknown message type: ' + msg)
        }
        this.ws = ws
    }

    notify = (msg: string) => void toast(msg)

    /** Loads workflow data from the specified file */
    async handleFile(file: File) {
        if (file.type === 'image/png') {
            const pngInfo = await getPngMetadata(this, file)
            console.log(pngInfo)
            if (pngInfo && pngInfo.prompt) {
                const data = JSON.parse(pngInfo.prompt)
                console.log(data)
                const project = ComfyProject.FROM_JSON(this, data)
                this.projects.push(project)
                this.project = project
                this.editor.updateCODE(project.code)
                this.project.udpateCode(project.code)
            }
        }
        // else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        //     const reader = new FileReader()
        //     reader.onload = () => {
        //         this.loadGraphData(JSON.parse(reader.result))
        //     }
        //     reader.readAsText(file)
        // } else {
        // }
    }
}
