import { Body, fetch, ResponseType } from '@tauri-apps/api/http'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'
import type { CSRun } from './CSRun'
import { ScriptStep } from './ScriptStep'

import * as WS from 'ws'

import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'
import { DemoScript1 } from '../ui/DemoScript1'
import { CushyLayoutState } from '../ui/layout/LayoutState'
import { AutoSaver } from '../utils/AutoSaver'
import { ComfyStatus, ComfyUploadImageResult, WsMsg } from './ComfyAPI'
import { CSScript } from './CSScript'
import { ComfySchema } from './ComfySchema'
import { ComfyScriptEditor } from './ComfyScriptEditor'
import { CSImage } from './CSImage'
import { getPngMetadata } from './getPngMetadata'
import { ScriptStep_prompt } from './ScriptStep_prompt'
import { CSConfigManager } from '../config/CSConfigManager'
import { readableStringify } from '../utils/stringifyReadable'

export type ComfyClientOptions = {
    serverIP: string
    serverPort: number
    spec: ComfySchemaJSON
}

export type CSCriticalError = { title: string; help: string }

/**
 * global State
 *  - manages connection to the backend
 *  - manages list of known / open projects
 *  - dispatches messages to the right projects
 */
export class CSClient {
    serverIP: string
    serverPort: number
    schema: ComfySchema
    dts: string
    script: CSScript
    scripts: CSScript[] = []
    editor: ComfyScriptEditor
    // uploader = new ImageUploader(this)
    config = new CSConfigManager()
    assets = new Map<string, boolean>()
    layout = new CushyLayoutState(this)

    /** workspace directory */
    get workspaceDir() { return this.config.config.workspace } // prettier-ignore

    storageServerKey = 'comfy-server'
    getStoredServerKey = () => {}

    getConfig = () => ({
        serverIP: this.serverIP,
        serverPort: this.serverPort,
        spec: this.schema.spec,
    })

    TEST_saveFilesInDocuments = async () => {
        const dir = fs.Dir.Document
        await fs.createDir('CushyStudio', { recursive: true, dir })
        await fs.createDir('CushyStudio/images', { recursive: true, dir })
        await fs.createDir('CushyStudio/projects', { recursive: true, dir })
        await fs.writeTextFile({ contents: '[]', path: `CushyStudio/test.json` }, { dir })
    }

    private RANDOM_IMAGE_URL = 'http://192.168.1.20:8188/view?filename=ComfyUI_01619_.png&subfolder=&type=output'

    /** attempt to convert an url to a Blob */
    private getUrlAsBlob = async (url: string = this.RANDOM_IMAGE_URL) => {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            responseType: ResponseType.Binary,
        })
        const numArr: number[] = response.data as any
        const binArr = new Uint8Array(numArr)
        return binArr
        // return new Blob([binArr], { type: 'image/png' })
    }

    uploadURL = async (url: string = this.RANDOM_IMAGE_URL): Promise<ComfyUploadImageResult> => {
        const blob = await this.getUrlAsBlob(url)
        return this.uploadUIntArrToComfy(blob)
    }

    /** save an image at given url to disk */
    saveImgToDisk = async (
        url: string = 'http://192.168.1.20:8188/view?filename=ComfyUI_01619_.png&subfolder=&type=output',
    ): Promise<'ok'> => {
        console.log('done')
        const response = await fetch(url, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            responseType: ResponseType.Binary,
        })
        const numArr: number[] = response.data as any
        const binArr = new Uint16Array(numArr)
        await fs.writeBinaryFile('CushyStudio/images/test.png', binArr, { dir: fs.Dir.Document })
        return 'ok'
    }

    /** upload an image present on disk to ComfyServer */
    uploadImgFromDisk = async (): Promise<ComfyUploadImageResult> => {
        const ui8arr = await fs.readBinaryFile('CushyStudio/images/test.png', { dir: fs.Dir.Document })
        return this.uploadUIntArrToComfy(ui8arr)
    }

    // lastUpload: Maybe<string> = null
    /** upload an Uint8Array buffer as png to ComfyServer */
    uploadUIntArrToComfy = async (ui8arr: Uint8Array): Promise<ComfyUploadImageResult> => {
        const uploadURL = this.serverHostHTTP + '/upload/image'
        const resp = await fetch(uploadURL, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: Body.form({
                image: {
                    file: ui8arr,
                    mime: 'image/png',
                    fileName: 'upload.png',
                },
            }),
        })
        const result = resp.data as ComfyUploadImageResult
        console.log({ 'resp.data': result })
        // this.lastUpload = new CushyImage(this, { filename: result.name, subfolder: '', type: 'output' }).url
        return result
    }

    autosaver = new AutoSaver('client', this.getConfig)

    constructor(opts: ComfyClientOptions) {
        const prev = this.autosaver.load()
        if (prev) Object.assign(opts, prev)
        this.autosaver.start()
        this.serverIP = opts.serverIP
        this.serverPort = opts.serverPort
        this.editor = new ComfyScriptEditor(this)
        this.schema = new ComfySchema(opts.spec)
        this.script = CSScript.INIT(this)
        this.scripts.push(this.script)
        // this.projects.push(ComfyProject.INIT(this))
        this.dts = this.schema.codegenDTS()
        this.startWSClientSafe()
        makeAutoObservable(this)
        setTimeout(async () => {
            await this.fetchObjectsSchema()
            this.editor.openCODE()
            // this.project.run()
        }, 1500)
    }

    get serverHostHTTP() {
        const protocol = window.location.protocol === 'https:' ? 'https' : 'http'
        return `${protocol}://${this.serverIP}:${this.serverPort}`
    }
    get serverHostWs() {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
        return `${protocol}://${this.serverIP}:${this.serverPort}`
    }

    fetchPrompHistory = async () => {
        const res = await fetch(`${this.serverHostHTTP}/history`, { method: 'GET' })
        console.log(res.data)
        const x = res.data
        return x
    }

    CRITICAL_ERROR: Maybe<CSCriticalError> = null

    /** retri e the comfy spec from the schema*/
    fetchObjectsSchema = async (): Promise<ComfySchemaJSON> => {
        // 1. fetch schema$
        // const timeoutController = new AbortController()
        // const timeoutID = setTimeout(() => timeoutController.abort(), 2000)
        const url = `${this.serverHostHTTP}/object_info`

        let schema$: ComfySchemaJSON
        try {
            const res = await fetch(url, { method: 'GET', timeout: { secs: 3, nanos: 0 } })
            console.log(res.data)
            schema$ = res.data as any
            // clearTimeout(timeoutID)
            // schema$ = await res.json()
        } catch (error) {
            console.log('🔴', error)
            this.CRITICAL_ERROR = {
                title: 'Failed to fetch ObjectInfos from backend.',
                help: 'Possibly a CORS issue, check your navigator logs.',
            }
            schema$ = {}
        }

        // console.log('🔴', res)
        // 2. update schmea
        this.schema.update(schema$)
        // save schema to disk
        const schemaPath = this.workspaceDir + path.sep + 'comfy-nodes.json'
        await fs.writeTextFile(schemaPath, readableStringify(schema$))
        // 3. update dts
        this.dts = this.schema.codegenDTS()
        const dtsPath = this.workspaceDir + path.sep + 'comfy-api.md'
        await fs.writeTextFile(dtsPath, `# Comfy-API\n\n\`\`\`ts\n${this.dts}\n\`\`\``)
        // 4. update monaco
        this.editor.updateSDKDTS()
        this.editor.updateLibDTS()
        this.editor.updateCODE(DemoScript1)
        this.script.udpateCode(DemoScript1)
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
    startWSClientSafe = () => {
        try {
            this.startWSClient()
        } catch (error) {
            console.log(error)
            console.log('🔴 failed to start websocket client')
            this.CRITICAL_ERROR = {
                title: 'Failed to start websocket client.',
                help: 'Possibly a CORS issue, check your navigator logs.',
            }
        }
    }
    startWSClient = () => {
        if (this.ws) {
            if (this.ws?.readyState === WebSocket.OPEN) this.ws.close()
            this.wsStatus = 'off'
        }
        const ws =
            typeof window !== 'undefined' //
                ? new WebSocket(`${this.serverHostWs}/ws`)
                : new WS.WebSocket(`${this.serverHostWs}/ws`)
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
            const project: CSScript = this.script
            const currentRun: CSRun | null = project.currentRun
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
                const project = CSScript.FROM_JSON(this, data)
                this.scripts.push(project)
                this.script = project
                this.editor.updateCODE(project.code)
                this.script.udpateCode(project.code)
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
