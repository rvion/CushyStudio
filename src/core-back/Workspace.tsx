import type { ComfySchemaJSON } from '../core-types/ComfySchemaJSON'
import type { FlowExecutionStep } from '../core-types/FlowExecutionStep'
// import { ImportCandidate } from '../importers/ImportCandidate'

import fetch from 'node-fetch'
import { posix } from 'path'
import * as vscode from 'vscode'
import * as WS from 'ws'
import { sleep } from '../utils/ComfyUtils'
import { Maybe } from '../utils/types'
import { FlowRun } from './FlowRun'

import { makeAutoObservable } from 'mobx'
import { PromptExecution } from '../controls/ScriptStep_prompt'
import { getPayloadID } from '../core-shared/PayloadID'
import { Schema } from '../core-shared/Schema'
import { ComfyPromptJSON } from '../core-types/ComfyPrompt'
import { ComfyStatus, WsMsg } from '../core-types/ComfyWsPayloads'
import { RelativePath } from '../fs/BrandedPaths'
import { asRelativePath } from '../fs/pathUtils'
import { ComfyImporter } from '../importers/ImportComfyImage'
import { getPngMetadata } from '../importers/getPngMetadata'
import { loggerExt } from '../logger/LoggerBack'
import { sdkTemplate } from '../sdk/sdkTemplate'
import { demoLibrary } from '../templates/Library'
import { Template } from '../templates/Template'
import { defaultScript } from '../templates/defaultProjectCode'
import { bang } from '../utils/bang'
import { readableStringify } from '../utils/stringifyReadable'
import { CushyFile, vsTestItemOriginDict } from './CushyFile'
import { FlowRunner } from './FlowRunner'
import { FrontWebview } from './FrontWebview'
import { GeneratedImage } from './GeneratedImage'
import { RANDOM_IMAGE_URL } from './RANDOM_IMAGE_URL'
import { ResilientWebSocketClient } from './ResilientWebsocket'
import { StatusBar } from './statusBar'

export type CSCriticalError = { title: string; help: string }

/**
 * global State
 *  - manages connection to the backend
 *  - manages list of known / open projects
 *  - dispatches messages to the right projects
 */
export class Workspace {
    schema: Schema
    statusBar: StatusBar

    /** template /snippet library one can */
    demos: Template[] = demoLibrary
    comfySessionId = 'temp'
    activeRun: Maybe<FlowRun> = null
    vsTestController: vscode.TestController
    fileChangedEmitter = new vscode.EventEmitter<vscode.Uri>()

    /** relative workspace folder where CushyStudio should store every artifacts and runtime files */
    get relativeCacheFolderPath(): RelativePath {
        return asRelativePath('.cushy/cache')
    }

    get cacheFolderURI(): vscode.Uri {
        return this.resolve(this.relativeCacheFolderPath)
    }

    runs: FlowRun[] = []
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
        const cushyFile = this.getOrCreateFile(this.vsTestController, e.uri)
        cushyFile.updateFromContents(e.getText())
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
        const startTestRun = async (request: vscode.TestRunRequest) => void new FlowRunner(this, request)
        // ctrl.createRunProfile('Debug Tests', vscode.TestRunProfileKind.Debug, startTestRun, true, undefined, true)
        ctrl.createRunProfile('Run Tests', vscode.TestRunProfileKind.Run, startTestRun, true, undefined, true)

        // provided by the extension that the editor may call to request children of a test item
        ctrl.resolveHandler = async (item: vscode.TestItem | undefined) => {
            if (!item) {
                this.context.subscriptions.push(...this.startWatchingWorkspace(ctrl, this.fileChangedEmitter))
                return
            }
            const cushyFile = vsTestItemOriginDict.get(item)
            if (cushyFile instanceof CushyFile) await cushyFile.updateFromDisk()
        }
        return ctrl
    }

    initOutputChannel = () => {
        const outputChan = vscode.window.createOutputChannel('CushyStudio')
        outputChan.appendLine(`🟢 "cushystudio" is now active!`)
        outputChan.show(true)
        loggerExt.chanel = outputChan
    }

    constructor(
        //
        public context: vscode.ExtensionContext,
        public wspUri: vscode.Uri,
    ) {
        this.schema = new Schema({})
        this.initOutputChannel()
        this.comfyJSONUri = wspUri.with({ path: posix.join(wspUri.path, '.cushy', 'nodes.json') })
        this.comfyTSUri = wspUri.with({ path: posix.join(wspUri.path, '.cushy', 'nodes.d.ts') })
        this.cushyTSUri = wspUri.with({ path: posix.join(wspUri.path, '.cushy', 'cushy.d.ts') })
        this.writeTextFile(this.cushyTSUri, sdkTemplate)
        this.vsTestController = this.initVSTestController()
        this.statusBar = new StatusBar(this)
        this.autoDiscoverEveryWorkflow()
        void this.updateComfy_object_info()
        this.ws = this.initWebsocket()
        makeAutoObservable(this)
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
                return vscode.workspace //
                    .getConfiguration('cushystudio')
                    .get('serverWSEndoint', `ws://localhost:8188/ws`)
            },
            onMessage: this.onMessage,
        })

    /** ensure webview is opened */
    ensureWebviewPanelIsOpened = () => {
        FrontWebview.createOrReveal(this)
    }

    importCurrentFile = async (opts: { preserveId: boolean }) => {
        const tab = vscode.window.tabGroups.activeTabGroup.activeTab
        if (!((tab?.input as any)?.viewType === 'imagePreview.previewEditor')) {
            throw new Error('❌ not an image')
        }
        const uri: vscode.Uri = bang((tab!.input as any).uri)
        console.log(tab)
        if (!uri.fsPath.toLowerCase().endsWith('.png')) {
            throw new Error('❌ not a png')
        }
        const pngData = await vscode.workspace.fs.readFile(uri)
        const result = getPngMetadata(pngData)
        if (result.type === 'failure') {
            throw new Error(`❌ ${result.value}`)
        }
        const pngMetadata = result.value
        console.log({ pngMetadata })
        const canBeImportedAsComfyUIJSON = 'prompt' in pngMetadata
        if (!canBeImportedAsComfyUIJSON) {
            throw new Error(`❌ no 'prompt' json metadata`)
        }

        const json = JSON.parse(pngMetadata.prompt)
        // console.log(json)
        const baseName = posix.basename(uri.path, '.png')

        // replace the extension with .cushy.ts
        const absPath = uri.path.replace(/\.png$/, '.cushy.ts')

        // make it relative to the workspace
        const relPathStr = vscode.Uri.file(absPath).path.replace(this.wspUri.fsPath, '.')
        const relPath = asRelativePath(relPathStr)
        const convertedUri = this.addProjectFromComfyWorkflowJSON(relPath, baseName, json, opts)
        await sleep(1000)
        //  reveal the URI
        vscode.window.showTextDocument(convertedUri)

        // const curr = vscode.window.reveal()
        // if (curr == null) return
        // const filename = curr.document.fileName
        // console.log({ filename })
        // const editor = curr.document.
        // const ic = new ImportCandidate(this, filename)
    }

    forwardImagesToFrontV1 = async (images: GeneratedImage[]) => {
        await Promise.all(images.map((i) => i.savedPromise))
        await sleep(200)
        const uris = FrontWebview.with((curr) => {
            return images.map((img: GeneratedImage) => {
                return curr.webview.asWebviewUri(img.localUri).toString()
            })
        })
        loggerExt.info('💿', 'all images saved: sending to front: ' + uris.join(', '))
        FrontWebview.sendMessage({ type: 'images', uris: uris, uid: getPayloadID() })
    }

    forwardImagesToFrontV2 = (images: GeneratedImage[]) => {
        const uris = images.map((i) => i.comfyURL)
        FrontWebview.sendMessage({ type: 'images', uris, uid: getPayloadID() })
    }

    onMessage = (e: WS.MessageEvent) => {
        loggerExt.info('🧦', `received ${e.data}`)
        const msg: WsMsg = JSON.parse(e.data as any)

        FrontWebview.sendMessage({ ...msg, uid: getPayloadID() })

        if (msg.type === 'status') {
            if (msg.data.sid) this.comfySessionId = msg.data.sid
            this.status = msg.data.status
            return
        }

        const currentRun: Maybe<FlowRun> = this.activeRun
        if (currentRun == null) {
            loggerExt.error('🐰', `❌ received ${msg.type} but currentRun is null`)
            return
            // return console.log(`❌ received ${msg.type} but currentRun is null`)
        }

        // ensure current step is a prompt
        const promptStep: FlowExecutionStep = currentRun.step
        if (!(promptStep instanceof PromptExecution)) return console.log(`❌ received ${msg.type} but currentStep is not prompt`)

        // defer accumulation to ScriptStep_prompt
        if (msg.type === 'progress') {
            loggerExt.debug('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep._graph.onProgress(msg)
        }

        if (msg.type === 'executing') {
            loggerExt.debug('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep.onExecuting(msg)
        }

        if (msg.type === 'executed') {
            loggerExt.info('🐰', `${msg.type} ${JSON.stringify(msg.data)}`)
            const images = promptStep.onExecuted(msg)
            this.forwardImagesToFrontV2(images)
            return
            // await Promise.all(images.map(i => i.savedPromise))
            // const uris = FrontWebview.with((curr) => {
            //     return images.map((img: GeneratedImage) => {
            //         return curr.webview.asWebviewUri(img.uri).toString()
            //     })
            // })
            // console.log('📸', 'uris', uris)
            // FrontWebview.sendMessage({ type: 'images', uris })
            // return images
        }

        // unknown message payload ?
        console.log('❌', 'Unknown message:', msg)
        throw new Error('Unknown message type: ' + msg)
    }

    /** attempt to convert an url to a Blob */
    getUrlAsBlob = async (url: string = RANDOM_IMAGE_URL) => {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'image/png' },
            method: 'GET',
            // responseType: ResponseType.Binary,
        })
        const blob = await response.blob()
        // console.log('📦', 'typeof blob', typeof blob)
        // console.log('📦', 'blob.constructor.name', blob.constructor.name)
        // console.log('📦', 'blob', blob)
        // const binArr = new Uint8Array(numArr)
        return blob
        // return new Blob([binArr], { type: 'image/png' })
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

    get serverHostHTTP(): string {
        return vscode.workspace.getConfiguration('cushystudio').get('serverHostHTTP', 'http://localhost:8188')
    }

    get serverWSEndoint(): string {
        return vscode.workspace.getConfiguration('cushystudio').get('serverWSEndoint', 'ws://localhost:8188/ws')
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
        loggerExt.info('🌠', `contacting ${url}`)
        vscode.window.showInformationMessage(url)
        // console.log(url)

        let schema$: ComfySchemaJSON
        try {
            // const cancel =
            const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            const data = (await res.json()) as { [key: string]: any }
            const keys = Object.keys(data)
            loggerExt.info('🌠', `found ${keys.length} nodes (${JSON.stringify(keys)})`)
            schema$ = data as any
        } catch (error) {
            vscode.window.showErrorMessage('FAILED TO FETCH OBJECT INFOS FROM COMFY')
            console.error('🐰', error)
            loggerExt.error('🦊', 'Failed to fetch ObjectInfos from Comfy.')
            schema$ = {}
        }
        vscode.window.showInformationMessage('🟢 yay')

        const comfyJSONStr = readableStringify(schema$, 3)
        const comfyJSONBuffer = Buffer.from(comfyJSONStr, 'utf8')
        vscode.workspace.fs.writeFile(this.comfyJSONUri, comfyJSONBuffer)

        this.schema.update(schema$)
        loggerExt.info('🌠', 'schema updated')
        const comfySchemaTs = this.schema.codegenDTS()
        loggerExt.info('🌠', 'schema code updated !')
        const comfySchemaBuff = Buffer.from(comfySchemaTs, 'utf8')
        vscode.workspace.fs.writeFile(this.comfyTSUri, comfySchemaBuff)
        loggerExt.info('🌠', 'schema code saved !')

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

    addProjectFromComfyWorkflowJSON = (
        //
        relPath: RelativePath,
        title: string,
        comfyPromptJSON: ComfyPromptJSON,
        opts: { preserveId: boolean },
    ): vscode.Uri => {
        const code = new ComfyImporter(this).convertFlowToCode(title, comfyPromptJSON, opts)
        // const fileName = title.endsWith('.ts') ? title : `${title}.ts`
        const uri = this.resolve(relPath)
        this.writeTextFile(uri, code, true)
        return uri
    }

    // --------------------------------------------------
    getOrCreateFile = (vsTestController: vscode.TestController, uri: vscode.Uri): CushyFile => {
        // { vsTestItem: vscode.TestItem; cushyFile: CushyFile } {
        const existing = vsTestController.items.get(uri.toString())
        if (existing) {
            const cushyFile = vsTestItemOriginDict.get(existing) as CushyFile
            if (!(cushyFile instanceof CushyFile)) throw new Error('🔴not a cushyfile')
            return cushyFile
        }
        return new CushyFile(this, uri)
    }

    startWatchingWorkspace = (
        //
        controller: vscode.TestController,
        fileChangedEmitter: vscode.EventEmitter<vscode.Uri>,
    ) => {
        return this.getWorkspaceTestPatterns().map(({ workspaceFolder, pattern }) => {
            const watcher = vscode.workspace.createFileSystemWatcher(pattern)
            watcher.onDidCreate((uri) => {
                this.getOrCreateFile(controller, uri)
                fileChangedEmitter.fire(uri)
            })
            watcher.onDidChange(async (uri) => {
                const cushyFile = this.getOrCreateFile(controller, uri)
                if (cushyFile.didResolve) await cushyFile.updateFromDisk()
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
