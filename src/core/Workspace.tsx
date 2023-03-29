import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'
import type { Run } from './Run'
import type { ScriptStep } from './ScriptStep'
import type { CushyStudio } from '../config/CushyStudio'

import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { Body, fetch, ResponseType } from '@tauri-apps/api/http'
import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'
import { JsonFile } from '../config/JsonFile'
import { TypescriptFile } from '../code/TypescriptFile'
import { CushyLayoutState } from '../layout/LayoutState'
import { readableStringify } from '../utils/stringifyReadable'
import { ComfyStatus, ComfyUploadImageResult, WsMsg } from './ComfyAPI'
import { ComfySchema } from './ComfySchema'
import { Project } from './Project'
import { getPngMetadata } from '../png/getPngMetadata'
import { ScriptStep_prompt } from './ScriptStep_prompt'
import { c__ } from '../ui/sdkDTS'
import { ResilientWebSocketClient } from '../ui/ResilientWebsocket'
import { logger } from '../logger/Logger'
import { defaultScript } from './defaultProjectCode'

export type WorkspaceConfigJSON = {
    version: 2
    comfyWSURL: string
    comfyHTTPURL: string
    lastProjectFolder?: string
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

    focusedFile: Maybe<TypescriptFile> = null
    focusedProject: Maybe<Project> = null

    projects: Project[] = []
    assets = new Map<string, boolean>()
    layout = new CushyLayoutState(this)

    // main files
    workspaceConfigFile: JsonFile<WorkspaceConfigJSON>
    objectInfoFile: JsonFile<ComfySchemaJSON>
    cushySDKFile: TypescriptFile
    comfySDKFile: TypescriptFile

    openComfySDK = () => {
        this.focusedFile = this.comfySDKFile
        // this.layout.openEditorTab(this.ComfySDKBuff)
    }

    openCushySDK = () => {
        this.focusedFile = this.cushySDKFile
        // this.layout.openEditorTab(this.CushySDKBuff)
    }

    static OPEN = async (cushy: CushyStudio, folder: string): Promise<Workspace> => {
        const workspace = new Workspace(cushy, folder)
        await workspace.objectInfoFile.finished
        await workspace.workspaceConfigFile.finished
        void workspace.init()
        return workspace
    }

    private constructor(
        //
        public cushy: CushyStudio,
        public folder: string,
    ) {
        // this.editor = new ComfyScriptEditor(this)
        this.schema = new ComfySchema({})
        this.cushySDKFile = new TypescriptFile(this, { title: 'sdk', path: this.folder + path.sep + 'cushy.d.ts', def: c__ }) //`file:///core/sdk.d.ts`)
        this.comfySDKFile = new TypescriptFile(this, { title: 'lib', path: this.folder + path.sep + 'comfy.d.ts', def: null }) //`file:///core/global.d.ts`)
        // this.script = new CSScript(this)
        this.objectInfoFile = new JsonFile<ComfySchemaJSON>({
            folder: Promise.resolve(this.folder),
            name: 'object_info.json',
            init: () => ({}),
            maxLevel: 3,
        })
        this.workspaceConfigFile = new JsonFile<WorkspaceConfigJSON>({
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

    /** will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server */
    ws!: ResilientWebSocketClient

    async init() {
        this.ws = new ResilientWebSocketClient({
            url: () => this.workspaceConfigFile.value.comfyWSURL,
            onMessage: this.onMessage,
        })
        await this.loadProjects()
        await this.updateComfy_object_info()
        // this.editor.openCODE()
    }

    sid = 'temp'

    onMessage = (e: MessageEvent /* WS.MessageEvent*/) => {
        const msg: WsMsg = JSON.parse(e.data as any)
        logger.info('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
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

    createProject = (folderName: string, script: string = defaultScript) => {
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
    uploadImgFromDisk = async (path: string): Promise<ComfyUploadImageResult> => {
        const ui8arr = await fs.readBinaryFile(path)
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

    get serverHostHTTP() { return this.workspaceConfigFile.value.comfyHTTPURL } // prettier-ignore

    fetchPrompHistory = async () => {
        const res = await fetch(`${this.serverHostHTTP}/history`, { method: 'GET' })
        console.log(res.data)
        const x = res.data
        return x
    }

    CRITICAL_ERROR: Maybe<CSCriticalError> = null

    /** retri e the comfy spec from the schema*/
    updateComfy_object_info = async (): Promise<ComfySchemaJSON> => {
        // 1. fetch schema$
        const url = `${this.serverHostHTTP}/object_info`

        let schema$: ComfySchemaJSON
        try {
            const res = await fetch(url, { method: 'GET', timeout: { secs: 3, nanos: 0 } })
            console.log('[🤖]', res.data)
            schema$ = res.data as any
        } catch (error) {
            console.log('🔴', error)
            logger.error('🦊', 'Failed to fetch ObjectInfos from Comfy.')
            schema$ = {}
        }
        this.objectInfoFile.update(schema$)
        this.schema.update(schema$)
        const comfySdkCode = this.schema.codegenDTS()
        this.comfySDKFile.updateFromCodegen(comfySdkCode)

        return schema$
    }

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    status: ComfyStatus | null = null

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
