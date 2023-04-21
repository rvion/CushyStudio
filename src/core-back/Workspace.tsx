import type { ComfySchemaJSON } from '../core-types/ComfySchemaJSON'
import type { FlowExecutionStep } from '../core-types/FlowExecutionStep'

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
import { extractErrorMessage } from '../utils/extractErrorMessage'
import { Decorator } from './decorator'
import { existsSync, readFileSync } from 'fs'
import { logger } from '../logger/logger'

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

    /** read text file, optionally provide a default */
    readJSON = <T extends any>(uri: vscode.Uri, def?: T): T => {
        console.log(uri.fsPath)
        const exists = existsSync(uri.fsPath)
        if (!exists) {
            if (def != null) return def
            throw new Error(`file does not exist ${uri.fsPath}`)
        }
        const str = readFileSync(uri.fsPath, 'utf8')
        const json = JSON.parse(str)
        return json
    }

    /** read text file, optionally provide a default */
    readTextFile = async (uri: vscode.Uri, def: string): Promise<string> => {
        const exists = existsSync(uri.fsPath)
        if (!exists) return def
        const x = await vscode.workspace.fs.readFile(uri)
        const str = x.toString()
        return str
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
        outputChan.appendLine(`starting cushystudio....`)
        outputChan.show(true)
        logger().chanel = outputChan
    }

    decorator: Decorator
    constructor(
        //
        public context: vscode.ExtensionContext,
        public wspUri: vscode.Uri,
    ) {
        this.initOutputChannel()
        this.comfyJSONUri = wspUri.with({ path: posix.join(wspUri.path, '.cushy', 'nodes.json') })
        this.comfyTSUri = wspUri.with({ path: posix.join(wspUri.path, '.cushy', 'nodes.d.ts') })
        this.cushyTSUri = wspUri.with({ path: posix.join(wspUri.path, '.cushy', 'cushy.d.ts') })
        // load previously cached nodes
        try {
            logger().info('attemping to load cached nodes...')
            const cachedComfyJSON = this.readJSON<ComfySchemaJSON>(this.comfyJSONUri)
            logger().info('found cached json for nodes...')
            this.schema = new Schema(cachedComfyJSON)
            logger().info('🟢 loaded cached json for nodes')
        } catch (error) {
            logger().error('🌠', extractErrorMessage(error))
            logger().error('🌠', 'failed to load cached nodes')
            logger().info('initializing empty schema')
            this.schema = new Schema({})
        }
        this.decorator = new Decorator(this)
        this.writeTextFile(this.cushyTSUri, sdkTemplate)
        this.vsTestController = this.initVSTestController()
        this.statusBar = new StatusBar(this)
        this.autoDiscoverEveryWorkflow()
        // void this.updateComfy_object_info()
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
            onConnectOrReconnect: () => {
                this.updateComfy_object_info()
            },
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
        logger().info('all images saved: sending to front: ' + uris.join(', '))
        FrontWebview.sendMessage({ type: 'images', uris: uris, uid: getPayloadID() })
    }

    forwardImagesToFrontV2 = (images: GeneratedImage[]) => {
        const uris = images.map((i) => i.comfyURL)
        FrontWebview.sendMessage({ type: 'images', uris, uid: getPayloadID() })
    }

    onMessage = (e: WS.MessageEvent) => {
        logger().info(`🧦 received ${e.data}`)
        const msg: WsMsg = JSON.parse(e.data as any)

        FrontWebview.sendMessage({ ...msg, uid: getPayloadID() })

        if (msg.type === 'status') {
            if (msg.data.sid) this.comfySessionId = msg.data.sid
            this.status = msg.data.status
            return
        }

        const currentRun: Maybe<FlowRun> = this.activeRun
        if (currentRun == null) {
            logger().error('🐰', `❌ received ${msg.type} but currentRun is null`)
            return
            // return console.log(`❌ received ${msg.type} but currentRun is null`)
        }

        // ensure current step is a prompt
        const promptStep: FlowExecutionStep = currentRun.step
        if (!(promptStep instanceof PromptExecution)) return console.log(`❌ received ${msg.type} but currentStep is not prompt`)

        // defer accumulation to ScriptStep_prompt
        if (msg.type === 'progress') {
            logger().debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep._graph.onProgress(msg)
        }

        if (msg.type === 'executing') {
            logger().debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            return promptStep.onExecuting(msg)
        }

        if (msg.type === 'executed') {
            logger().info(`${msg.type} ${JSON.stringify(msg.data)}`)
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
        let schema$: ComfySchemaJSON
        try {
            // 1 ------------------------------------
            logger().info(`[.... step 1/4] fetching schema from ${url} ...`)
            const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            const data = (await res.json()) as { [key: string]: any }
            const keys = Object.keys(data)
            logger().info(`[.... step 1/4] found ${keys.length} nodes`) // (${JSON.stringify(keys)})
            schema$ = data as any
            // vscode.window.showInformationMessage('🟢 yay')
            logger().info('[*... step 1/4] schema fetched')

            // 2 ------------------------------------
            logger().info('[*... step 2/4] updating schema...')
            const comfyJSONStr = readableStringify(schema$, 3)
            const comfyJSONBuffer = Buffer.from(comfyJSONStr, 'utf8')
            vscode.workspace.fs.writeFile(this.comfyJSONUri, comfyJSONBuffer)
            this.schema.update(schema$)
            logger().info('[**.. step 2/4] schema updated')

            // 3 ------------------------------------
            logger().info('[**.. step 3/4] udpatin schema code...')
            const comfySchemaTs = this.schema.codegenDTS()
            logger().info('[***. step 3/4] schema code updated ')

            // 4 ------------------------------------
            logger().info('[**** step 4/4] saving schema')
            const comfySchemaBuff = Buffer.from(comfySchemaTs, 'utf8')
            vscode.workspace.fs.writeFile(this.comfyTSUri, comfySchemaBuff)
            logger().info('[**** step 4/4] 🟢 schema updated')
            vscode.window.showInformationMessage('🟢 schema updated')
        } catch (error) {
            vscode.window.showErrorMessage('FAILURE TO GENERATE nodes.d.ts', extractErrorMessage(error))
            logger().error('🐰', extractErrorMessage(error))
            logger().error('🦊', 'Failed to fetch ObjectInfos from Comfy.')
            schema$ = {}
        }

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
        const relativePathToDTS = posix.relative(posix.dirname(uri.path), this.cushyTSUri.path)
        const codeFinal = [`/// <reference path="${relativePathToDTS}" />`, code].join('\n\n')
        this.writeTextFile(uri, codeFinal, true)
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
