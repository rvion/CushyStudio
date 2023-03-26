import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'
import type { Run } from './Run'
import type { ScriptStep } from './ScriptStep'

import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { Body, fetch, ResponseType } from '@tauri-apps/api/http'
import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'
import { PersistedJSON } from '../config/PersistedJSON'
import { TypescriptBuffer } from '../ui/code/TypescriptBuffer'
import { CushyLayoutState } from '../ui/layout/LayoutState'
import { readableStringify } from '../utils/stringifyReadable'
import { ComfyStatus, ComfyUploadImageResult, WsMsg } from './ComfyAPI'
import { ComfySchema } from './ComfySchema'
import { Project } from './Project'
import { getPngMetadata } from '../png/getPngMetadata'
import { ScriptStep_prompt } from './ScriptStep_prompt'
import { c__ } from '../ui/sdkDTS'

export type WorkspaceConfigJSON = {
    version: 2
    comfyWSURL: string
    comfyHTTPURL: string
}

export type CSCriticalError = { title: string; help: string }

/**
 * global State
 *  - manages connection to the backend
 *  - manages list of known / open projects
 *  - dispatches messages to the right projects
 */
export class Workspace {
    schema: ComfySchema

    focusedFile: Maybe<TypescriptBuffer> = null
    focusedProject: Maybe<Project> = null

    projects: Project[] = []
    assets = new Map<string, boolean>()
    layout = new CushyLayoutState(this)
    _config: PersistedJSON<WorkspaceConfigJSON>
    _schema: PersistedJSON<ComfySchemaJSON>

    CushySDKBuff: TypescriptBuffer
    ComfySDKBuff: TypescriptBuffer

    openComfySDK = () => {
        this.focusedFile = this.ComfySDKBuff
        // this.layout.openEditorTab(this.ComfySDKBuff)
    }

    openCushySDK = () => {
        this.focusedFile = this.CushySDKBuff
        // this.layout.openEditorTab(this.CushySDKBuff)
    }

    static OPEN = async (folder: string): Promise<Workspace> => {
        const workspace = new Workspace(folder)
        await workspace._schema.finished
        await workspace._config.finished
        void workspace.init()
        return workspace
    }
    private constructor(public folder: string) {
        // this.editor = new ComfyScriptEditor(this)
        this.schema = new ComfySchema({})
        this.CushySDKBuff = new TypescriptBuffer(this, { name: 'sdk', path: this.folder + path.sep + 'cushy.d.ts', def: null }) //`file:///core/sdk.d.ts`)
        this.ComfySDKBuff = new TypescriptBuffer(this, { name: 'lib', path: this.folder + path.sep + 'comfy.d.ts', def: null }) //`file:///core/global.d.ts`)
        // this.script = new CSScript(this)
        this._schema = new PersistedJSON<ComfySchemaJSON>({
            folder: Promise.resolve(this.folder),
            name: 'schema.json',
            init: () => ({}),
        })
        this._config = new PersistedJSON<WorkspaceConfigJSON>({
            folder: Promise.resolve(this.folder),
            name: 'workspace.json',
            init: () => ({
                version: 2,
                comfyWSURL: 'ws://127.0.0.1:8188/ws',
                comfyHTTPURL: 'http://127.0.0.1:8188',
            }),
        })
        makeAutoObservable(this)
    }

    async init() {
        // this.scripts.push(this.script)
        // const dts = this.schema.codegenDTS()
        this.startWSClientSafe()
        await this.loadProjects()
        await this.fetchObjectsSchema()
        // this.editor.openCODE()
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

    createProject = (folderName: string, script?: string) => {
        const project = new Project(this, folderName, script)
        this.projects.push(project)
        this.focusedProject = project
    }

    /** load all project found in workspace */
    loadProjects = async () => {
        console.log(`[🔍] loading projects...`)
        const items = await fs.readDir(this.folder, { recursive: true })
        for (const item of items) {
            if (!item.children) {
                console.log(`[🔍] - ${item.name} is not a folder`)
                continue
            }
            const script = item.children.find((f) => f.name === 'script.ts')
            if (script == null) {
                console.log(
                    `[🔍] - ${item.name} has no script.ts file ${item.children.length} ${item.children.map((f) => f.name)}`,
                )
                continue
            }
            const folderName = item.name
            if (folderName == null) {
                console.log(`[🔍] - ${item.name} has an invalid name (e.g. ends with a dot)`)
                continue
            }
            console.log(`[🔍] found project ${folderName}!`)
            this.projects.push(new Project(this, folderName))
        }
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

    get serverHostHTTP() { return this._config.value.comfyHTTPURL } // prettier-ignore
    get serverHostWs() { return this._config.value.comfyWSURL } // prettier-ignore

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
        const url = `${this.serverHostHTTP}/object_info`

        let schema$: ComfySchemaJSON
        try {
            const res = await fetch(url, { method: 'GET', timeout: { secs: 3, nanos: 0 } })
            console.log('[🤖]', res.data)
            schema$ = res.data as any
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
        this.CushySDKBuff.initProgrammatically(c__)
        // save schema to disk
        const schemaPath = this.folder + path.sep + 'comfy-nodes.json'
        await fs.writeTextFile(schemaPath, readableStringify(schema$))
        // 3. update dts
        const dts = this.schema.codegenDTS()
        this.ComfySDKBuff.initProgrammatically(dts)
        // const dtsPath = this.folder + path.sep + 'comfy-api.md'
        // await fs.writeTextFile(dtsPath, `# Comfy-API\n\n\`\`\`ts\n${this.dts}\n\`\`\``)
        // 4. update monaco
        // this.editor.updateSDKDTS() // 🔴
        // this.editor.updateLibDTS() // 🔴
        // this.editor.updateCODE(DemoScript1)
        // this.script.udpateCode(DemoScript1)
        // console.log('🟢 schema:', this.schema.nodes)
        return schema$
        this.openComfySDK()
        this.openCushySDK()
    }

    // openScript = () => {
    //     // 🔴
    //     this.editor.updateCODE(DemoScript1)
    //     this.script?.udpateCode(DemoScript1)
    // }
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

    // get dtsStatusEmoji() {
    //     if (this.dts.length > 10_000) return '🟢'
    //     return '🔴'
    // }

    sid: string = 'temporary'
    status: ComfyStatus | null = null
    ws: Maybe</*WS.WebSocket |*/ WebSocket> = null

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
        const ws = new WebSocket(this.serverHostWs)
        // typeof window !== 'undefined' //
        //     ? new WebSocket(this.serverHostWs)
        //     : new WS.WebSocket(this.serverHostWs)
        ws.binaryType = 'arraybuffer'
        ws.onopen = () => {
            console.log('[👢] connected')
            this.wsStatus = 'on'
        }
        ws.onmessage = (e: MessageEvent /* WS.MessageEvent*/) => {
            const msg: WsMsg = JSON.parse(e.data as any)
            console.log(`[🐰] %c${msg.type} %c${JSON.stringify(msg.data)}`, 'color:#90bdff', 'color:gray')
            if (msg.type === 'status') {
                if (msg.data.sid) this.sid = msg.data.sid
                this.status = msg.data.status
                return
            }

            // ensure current project is running
            const project: Maybe<Project> = this.focusedProject
            if (project == null) return console.log(`❌ received ${msg.type} but project is null`)

            const currentRun: Run | null = project.currentRun
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
                const project = Project.FROM_JSON(this, data)
                this.projects.push(project)
                this.focusedProject = project
                this.focusedFile = project.scriptBuffer
                // this.layout.openEditorTab(project.scriptBuffer)
                // this.editor.updateCODE(project.code)
                // this.script.udpateCode(project.code)
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
