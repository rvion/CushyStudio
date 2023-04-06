import fetch from 'node-fetch'
import { posix } from 'path'
import * as vscode from 'vscode'
import * as WS from 'ws'
import type { ImportCandidate } from '../importers/ImportCandidate'
import type { ComfySchemaJSON } from './ComfySchemaJSON'
import type { Maybe } from './ComfyUtils'
import { Run } from './Run'
import type { ScriptStep } from './ScriptStep'

import { makeAutoObservable } from 'mobx'
// import { JsonFile } from '../monaco/JsonFile'
import { CushyLayoutState } from '../layout/LayoutState'
import { logger } from '../logger/Logger'
import { Template } from '../templates/Template'
// import { TypescriptFile } from '../monaco/TypescriptFile'
import { asRelativePath, RelativePath } from '../fs/pathUtils'
import { sdkTemplate } from '../sdk/sdkTemplate'
import { defaultScript } from '../templates/defaultProjectCode'
import { ResilientWebSocketClient } from '../ws/ResilientWebsocket'
import { ComfyStatus, ComfyUploadImageResult, WsMsg } from './ComfyAPI'
import { ComfyPromptJSON } from './ComfyPrompt'
import { ComfySchema } from './ComfySchema'
// import { Project } from './Project'
import { ScriptStep_prompt } from '../controls/ScriptStep_prompt'
import { demoLibrary } from '../templates/Library'
// import { ProjectCreationWizard } from '../menu/ProjectCreationWizard'
import { ComfyImporter } from '../importers/ImportComfyImage'
import { readableStringify } from '../utils/stringifyReadable'
import { RunMode } from './Graph'
import { transpileCode } from './transpiler'

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
    demos: Template[] = demoLibrary
    // projects: Project[] = []
    assets = new Map<string, boolean>()
    layout = new CushyLayoutState(this)

    // import management
    importQueue: ImportCandidate[] = []
    removeCandidate = (candidate: ImportCandidate) => {
        const index = this.importQueue.indexOf(candidate)
        this.importQueue.splice(index, 1)
    }

    /** relative workspace folder where CushyStudio should store every artifacts and runtime files */
    get relativeCacheFolderPath(): RelativePath {
        return asRelativePath('cache')
    }

    runs: Run[] = []

    RUN = async (mode: RunMode = 'fake'): Promise<boolean> => {
        // this.focusedProject = this
        // ensure we have some code to run
        // this.scriptBuffer.codeJS
        // get the content of the current editor

        const activeTextEditor = vscode.window.activeTextEditor
        if (activeTextEditor == null) {
            console.log('❌', 'no active editor')
            return false
        }
        const activeDocument = activeTextEditor.document
        const activeURI = activeDocument.uri
        console.log({ activeURI })
        const codeTS = activeDocument.getText() ?? ''
        console.log({ codeTS })
        const codeJS = await transpileCode(codeTS)
        console.log({ codeJS })
        if (codeJS == null) {
            console.log('❌', 'no code to run')
            return false
        }
        // check if we're in "MOCK" mode
        const opts = mode === 'fake' ? { mock: true } : undefined
        const execution = new Run(this, activeURI, opts)
        await execution.save()
        // write the code to a file
        this.runs.unshift(execution)

        // try {
        const ProjectScriptFn = new Function('WORKFLOW', codeJS)
        const graph = execution.graph

        // graph.runningMode = mode
        // this.MAIN = graph

        const WORKFLOW = (fn: any) => fn(graph)

        try {
            await ProjectScriptFn(WORKFLOW)
            console.log('[✅] RUN SUCCESS')
            // this.isRunning = false
            return true
        } catch (error) {
            console.log(error)
            logger.error('🌠', 'RUN FAILURE')
            return false
        }
    }

    comfyJSONUri: vscode.Uri
    comfyTSUri: vscode.Uri
    cushyTSUri: vscode.Uri

    writeBinaryFile(relPath: RelativePath, content: Buffer, open = false) {
        const uri = this.resolve(relPath)
        vscode.workspace.fs.writeFile(uri, content)
        if (open) vscode.workspace.openTextDocument(uri)
    }

    writeTextFile(uri: vscode.Uri, content: string, open = false) {
        const buff = Buffer.from(content)
        vscode.workspace.fs.writeFile(uri, buff)
        if (open) vscode.workspace.openTextDocument(uri)
    }

    constructor(public wspUri: vscode.Uri) {
        this.schema = new ComfySchema({})
        this.comfyJSONUri = wspUri.with({ path: posix.join(wspUri.path, 'comfy.json') })
        this.comfyTSUri = wspUri.with({ path: posix.join(wspUri.path, 'comfy.d.ts') })
        this.cushyTSUri = wspUri.with({ path: posix.join(wspUri.path, 'cushy.d.ts') })

        this.writeTextFile(this.cushyTSUri, sdkTemplate)
        void this.init()
        makeAutoObservable(this)
    }

    /** will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server */
    ws!: ResilientWebSocketClient

    async init() {
        this.ws = new ResilientWebSocketClient({
            url: () => {
                const socketPort = vscode.workspace.getConfiguration('languageServerExample').get('port', 8188)
                const url = `ws://192.168.1.19:${socketPort}/ws`
                return url
            },
            onMessage: this.onMessage,
        })
        // await this.loadProjects()
        await this.updateComfy_object_info()
        // this.editor.openCODE()
    }

    sid = 'temp'

    activeRun: Maybe<Run> = null

    onMessage = (e: WS.MessageEvent) => {
        const msg: WsMsg = JSON.parse(e.data as any)
        if (msg.type === 'status') {
            if (msg.data.sid) this.sid = msg.data.sid
            this.status = msg.data.status
            return
        }

        // console.log(e.data)
        // // 🔴
        // return

        // ensure current project is running
        // const project: Maybe<Project> = this.focusedProject
        // if (project == null) return console.log(`❌ received ${msg.type} but project is null`)

        const currentRun: Maybe<Run> = this.activeRun
        if (currentRun == null) return console.log(`❌ received ${msg.type} but currentRun is null`)

        // ensure current step is a prompt
        const promptStep: ScriptStep = currentRun.step
        if (!(promptStep instanceof ScriptStep_prompt))
            return console.log(`❌ received ${msg.type} but currentStep is not prompt`)

        // defer accumulation to ScriptStep_prompt
        if (msg.type === 'progress') {
            logger.debug('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep.onProgress(msg)
        }
        if (msg.type === 'executing') {
            logger.debug('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep.onExecuting(msg)
        }

        if (msg.type === 'executed') {
            logger.info('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep.onExecuted(msg)
        }

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
            // responseType: ResponseType.Binary,
        })
        const blob = await response.blob()
        // const binArr = new Uint8Array(numArr)
        return blob
        // return new Blob([binArr], { type: 'image/png' })
    }

    uploadURL = async (url: string = this.RANDOM_IMAGE_URL): Promise<ComfyUploadImageResult> => {
        const blob = await this.getUrlAsBlob(url)
        return this.uploadUIntArrToComfy(blob)
    }

    createProjectAndFocustIt = (
        //
        workspaceRelativeFilePath: vscode.Uri,
        scriptContent: string = defaultScript,
    ) => {
        this.writeTextFile(workspaceRelativeFilePath, scriptContent, true)
        // const project = new Project(this, workspaceRelativeFilePath, scriptContent)
        // this.projects.push(project)
        // project.focus()
    }

    resolve = (relativePath: RelativePath): vscode.Uri => {
        return this.wspUri.with({ path: posix.join(this.wspUri.path, relativePath) })
    }

    /** save an image at given url to disk */
    saveImgToDisk = async (
        url: string = 'http://192.168.1.20:8188/view?filename=ComfyUI_01619_.png&subfolder=&type=output',
    ): Promise<'ok'> => {
        console.log('🔴 BROKEN')
        return Promise.reject('🔴 BROKEN')
        // const response = await fetch(url, {
        //     headers: { 'Content-Type': 'image/png' },
        //     method: 'GET',
        //     responseType: ResponseType.Binary,
        // })
        // const numArr: number[] = response.data as any
        // const binArr = new Uint16Array(numArr)
        // await fs.writeBinaryFile('CushyStudio/images/test.png', binArr, { dir: fs.Dir.Document })
        // return 'ok'
    }

    /** upload an image present on disk to ComfyServer */
    uploadImgFromDisk = async (path: string): Promise<ComfyUploadImageResult> => {
        return Promise.reject('🔴 BROKEN')
        // const ui8arr = await fs.readBinaryFile(path)
        // return this.uploadUIntArrToComfy(ui8arr)
    }

    // lastUpload: Maybe<string> = null
    /** upload an Uint8Array buffer as png to ComfyServer */
    uploadUIntArrToComfy = async (ui8arr: Blob): Promise<ComfyUploadImageResult> => {
        const uploadURL = this.serverHostHTTP + '/upload/image'
        const form = new FormData()
        form.append('image', ui8arr, 'upload.png')
        const resp = await fetch(uploadURL, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: form,
            // body: Body.form({
            //     image: {
            //         file: ui8arr,
            //         mime: 'image/png',
            //         fileName: 'upload.png',
            //     },
            // }),
        })
        const result: ComfyUploadImageResult = (await resp.json()) as any
        console.log({ 'resp.data': result })
        // this.lastUpload = new CushyImage(this, { filename: result.name, subfolder: '', type: 'output' }).url
        return result
    }

    get serverHostHTTP() {
        const def = vscode.workspace.getConfiguration('cushystudio').get('serverHostHTTP', 'http://192.168.1.19:8188')
        return def
    }

    // fetchPrompHistory = async () => {
    //     const res = await fetch(`${this.serverHostHTTP}/history`, { method: 'GET' })
    //     console.log(res.data)
    //     const x = res.data
    //     return x
    // }

    CRITICAL_ERROR: Maybe<CSCriticalError> = null

    /** retri e the comfy spec from the schema*/
    updateComfy_object_info = async (): Promise<ComfySchemaJSON> => {
        // 1. fetch schema$
        const url = `${this.serverHostHTTP}/object_info`
        logger.info('🌠', `contacting ${url}`)
        vscode.window.showInformationMessage(url)
        // console.log(url)

        let schema$: ComfySchemaJSON
        try {
            // const cancel =
            const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json()
            logger.info('🌠', `data: ${JSON.stringify(data)}`)
            schema$ = data as any
        } catch (error) {
            vscode.window.showErrorMessage('FAILED TO FETCH OBJECT INFOS FROM COMFY')
            console.error('🐰', error)
            logger.error('🦊', 'Failed to fetch ObjectInfos from Comfy.')
            schema$ = {}
        }
        vscode.window.showInformationMessage('🟢 yay')

        const comfyStr = readableStringify(schema$, 3)
        const comfyJSONBuffer = Buffer.from(comfyStr, 'utf8')
        vscode.workspace.fs.writeFile(this.comfyJSONUri, comfyJSONBuffer)

        this.schema.update(schema$)
        const cushyStr = this.schema.codegenDTS()
        const cushyBuff = Buffer.from(cushyStr, 'utf8')
        vscode.workspace.fs.writeFile(this.comfyTSUri, cushyBuff)

        // this.objectInfoFile.update(schema$)
        // this.comfySDKFile.updateFromCodegen(comfySdkCode)
        // this.comfySDKFile.syncWithDiskFile()

        return schema$
    }

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    status: ComfyStatus | null = null

    notify = (msg: string) => vscode.window.showInformationMessage(msg)

    addProjectFromComfyWorkflowJSON = async (title: string, comfyPromptJSON: ComfyPromptJSON) => {
        const code = new ComfyImporter(this).convertFlowToCode(comfyPromptJSON)
        const fileName = title.endsWith('.ts') ? title : `${title}.ts`
        const uri = this.resolve(asRelativePath(fileName))
        this.writeTextFile(uri, code, true)
    }
}
