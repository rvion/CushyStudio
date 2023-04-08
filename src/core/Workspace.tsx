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
import { CushyLayoutState } from '../layout/LayoutState'
import { logger } from '../logger/Logger'
import { Template } from '../templates/Template'
import { asRelativePath, RelativePath } from '../fs/pathUtils'
import { sdkTemplate } from '../sdk/sdkTemplate'
import { defaultScript } from '../templates/defaultProjectCode'
import { ResilientWebSocketClient } from '../ws/ResilientWebsocket'
import { ComfyStatus, ComfyUploadImageResult, WsMsg } from './ComfyAPI'
import { ComfyPromptJSON } from './ComfyPrompt'
import { ComfySchema } from './ComfySchema'
import { ScriptStep_prompt } from '../controls/ScriptStep_prompt'
import { demoLibrary } from '../templates/Library'
import { ComfyImporter } from '../importers/ImportComfyImage'
import { readableStringify } from '../utils/stringifyReadable'
import { RunMode } from './Graph'
import { transpileCode } from './transpiler'
import { CushyFile, vsTestItemOriginDict } from '../shell/itest/CushyFile'
import { CushyRunProcessor } from '../shell/itest/extension'

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

    /** template /snippet library one can */
    demos: Template[] = demoLibrary

    comfySessionId = 'temp'

    activeRun: Maybe<Run> = null

    // projects: Project[] = []

    assets = new Map<string, boolean>()

    layout = new CushyLayoutState(this)

    // 🔴 add to subscriptions
    vsTestController: vscode.TestController

    fileChangedEmitter = new vscode.EventEmitter<vscode.Uri>()

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

    RUN = async (mode: RunMode = 'real'): Promise<boolean> => {
        logger.info('🔥', '❓ HELLO super12')
        // this.focusedProject = this
        // ensure we have some code to run
        // this.scriptBuffer.codeJS
        // get the content of the current editor

        const activeTextEditor = vscode.window.activeTextEditor
        if (activeTextEditor == null) {
            logger.info('🔥', '❌ no active editor')
            return false
        }
        const activeDocument = activeTextEditor.document
        const activeURI = activeDocument.uri
        logger.info('🔥', activeURI.toString())
        const codeTS = activeDocument.getText() ?? ''
        logger.info('🔥', codeTS.slice(0, 1000) + '...')
        const codeJS = await transpileCode(codeTS)
        // logger.info('🔥', codeJS.slice(0, 1000) + '...')
        logger.info('🔥', codeJS + '...')
        if (codeJS == null) {
            logger.info('🔥', '❌ no code to run')
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
            logger.error('🌠', (error as any as Error).name)
            logger.error('🌠', (error as any as Error).message)
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

    updateNodeForDocument(e: vscode.TextDocument) {
        if (e.uri.scheme !== 'file') return
        if (!e.uri.path.endsWith('.cushy.ts')) return
        const { vsTestItem, cushyFile } = this.getOrCreateFile(this.vsTestController, e.uri)
        cushyFile.updateFromContents(this.vsTestController, e.getText(), vsTestItem)
    }

    /** wrapper around vscode.tests.createTestController so logic is self-contained  */
    initVSTestController(): vscode.TestController {
        const ctrl = vscode.tests.createTestController('mathTestController', 'Markdown Math')
        this.vsTestController = ctrl
        this.context.subscriptions.push(ctrl)
        ctrl.refreshHandler = async () => {
            const testPatterns = this.getWorkspaceTestPatterns()
            const promises = testPatterns.map(({ pattern }) => this.findInitialFiles(ctrl, pattern))
            await Promise.all(promises)
        }
        const startTestRun = async (request: vscode.TestRunRequest) => {
            const run = new CushyRunProcessor(request, this)
            return
        }
        ctrl.createRunProfile('Run Tests', vscode.TestRunProfileKind.Run, startTestRun, true, undefined, true)

        // provided by the extension that the editor may call to requestchildren of a test item
        ctrl.resolveHandler = async (item: vscode.TestItem | undefined) => {
            if (!item) {
                this.context.subscriptions.push(...this.startWatchingWorkspace(ctrl, this.fileChangedEmitter))
                return
            }
            const data = vsTestItemOriginDict.get(item)
            if (data instanceof CushyFile) await data.updateFromDisk(ctrl, item)
        }
        return ctrl
    }

    initOutputChannel = () => {
        const outputChan = vscode.window.createOutputChannel('CushyStudio')
        outputChan.appendLine(`🟢 "cushystudio" is now active!`)
        outputChan.show(true)
        logger.chanel = outputChan
    }

    constructor(
        //
        public context: vscode.ExtensionContext,
        public wspUri: vscode.Uri,
    ) {
        this.schema = new ComfySchema({})
        this.initOutputChannel()
        this.comfyJSONUri = wspUri.with({ path: posix.join(wspUri.path, 'comfy.json') })
        this.comfyTSUri = wspUri.with({ path: posix.join(wspUri.path, 'comfy.d.ts') })
        this.cushyTSUri = wspUri.with({ path: posix.join(wspUri.path, 'cushy.d.ts') })
        this.writeTextFile(this.cushyTSUri, sdkTemplate)
        this.vsTestController = this.initVSTestController()
        this.autoDiscoverEveryWorkflow()
        void this.updateComfy_object_info()
        this.ws = this.initWebsocket()
        makeAutoObservable(this)

        // vscode.tests.createTestController('mathTestController', 'Markdown Math')
        // this.ctrl.refreshHandler = async () => {
        //     await Promise.all(getWorkspaceTestPatterns().map(({ pattern }) => findInitialFiles(ctrl, pattern)))
        // }
        // this.ctrl.createRunProfile('Run Tests', vscode.TestRunProfileKind.Run, startTestRun, true, undefined, true)

        // // provided by the extension that the editor may call to requestchildren of a test item
        // this.ctrl.resolveHandler = async (item) => {
        //     if (!item) {
        //         context.subscriptions.push(...startWatchingWorkspace(ctrl, fileChangedEmitter))
        //         return
        //     }
        //     const data = testData.get(item)
        //     if (data instanceof CushyFile) await data.updateFromDisk(ctrl, item)
        // }
    }

    autoDiscoverEveryWorkflow = () => {
        // pre-populate the tree with any open documents
        for (const document of vscode.workspace.textDocuments) this.updateNodeForDocument(document)

        // auto-update the tree when documents are opened or changed
        const _1 = vscode.workspace.onDidOpenTextDocument(this.updateNodeForDocument)
        const _2 = vscode.workspace.onDidChangeTextDocument((e) => this.updateNodeForDocument(e.document))
        this.context.subscriptions.push(_1, _2)
    }

    /** will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server */
    ws: ResilientWebSocketClient

    initWebsocket = () =>
        new ResilientWebSocketClient({
            url: () => {
                const socketPort = vscode.workspace.getConfiguration('languageServerExample').get('port', 8188)
                const url = `ws://192.168.1.19:${socketPort}/ws`
                return url
            },
            onMessage: this.onMessage,
        })

    onMessage = (e: WS.MessageEvent) => {
        const msg: WsMsg = JSON.parse(e.data as any)
        if (msg.type === 'status') {
            if (msg.data.sid) this.comfySessionId = msg.data.sid
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
        const code = new ComfyImporter(this).convertFlowToCode(title, comfyPromptJSON)
        const fileName = title.endsWith('.ts') ? title : `${title}.ts`
        const uri = this.resolve(asRelativePath(fileName))
        this.writeTextFile(uri, code, true)
    }

    // --------------------------------------------------
    // --------------------------------------------------
    // --------------------------------------------------
    getOrCreateFile(
        //
        vsTestController: vscode.TestController,
        uri: vscode.Uri,
    ): { vsTestItem: vscode.TestItem; cushyFile: CushyFile } {
        const existing = vsTestController.items.get(uri.toString())
        if (existing) {
            const cushyFile = vsTestItemOriginDict.get(existing)
            return { vsTestItem: existing, cushyFile: cushyFile as CushyFile } // 🔴
        }

        const vsTestItem = vsTestController.createTestItem(
            uri.toString(), // id
            uri.path.split('/').pop()!, // label
            uri, // uri
        )
        vsTestController.items.add(vsTestItem)

        const cushyFile = new CushyFile()
        vsTestItemOriginDict.set(vsTestItem, cushyFile)

        vsTestItem.canResolveChildren = true
        return { vsTestItem: vsTestItem, cushyFile: cushyFile }
    }

    startWatchingWorkspace(controller: vscode.TestController, fileChangedEmitter: vscode.EventEmitter<vscode.Uri>) {
        return this.getWorkspaceTestPatterns().map(({ workspaceFolder, pattern }) => {
            const watcher = vscode.workspace.createFileSystemWatcher(pattern)
            watcher.onDidCreate((uri) => {
                this.getOrCreateFile(controller, uri)
                fileChangedEmitter.fire(uri)
            })
            watcher.onDidChange(async (uri) => {
                const { vsTestItem: file, cushyFile: data } = this.getOrCreateFile(controller, uri)
                if (data.didResolve) {
                    await data.updateFromDisk(controller, file)
                }
                fileChangedEmitter.fire(uri)
            })
            watcher.onDidDelete((uri) => controller.items.delete(uri.toString()))

            this.findInitialFiles(controller, pattern)

            return watcher
        })
    }

    getWorkspaceTestPatterns() {
        if (!vscode.workspace.workspaceFolders) return []
        return vscode.workspace.workspaceFolders.map((workspaceFolder) => ({
            workspaceFolder,
            pattern: new vscode.RelativePattern(workspaceFolder, '**/*.cushy.ts'),
        }))
    }

    async findInitialFiles(controller: vscode.TestController, pattern: vscode.GlobPattern) {
        for (const file of await vscode.workspace.findFiles(pattern)) {
            this.getOrCreateFile(controller, file)
        }
    }
}
