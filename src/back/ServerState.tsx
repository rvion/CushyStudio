import type { EmbeddingName } from '../core/Schema'
import type { ComfySchemaJSON } from '../types/ComfySchemaJSON'
import type { FlowExecutionStep } from '../types/FlowExecutionStep'
import type { Maybe } from '../utils/types'

import fetch from 'node-fetch'
import { join, relative } from 'path'
import * as WS from 'ws'
import { FlowRun } from './FlowRun'

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { PromptExecution } from '../controls/ScriptStep_prompt'
import { PayloadID, getPayloadID } from '../core/PayloadID'
import { Schema } from '../core/Schema'
import { logger } from '../logger/logger'
import { ComfyStatus, WsMsg } from '../types/ComfyWsApi'
import { MessageFromExtensionToWebview, MessageFromExtensionToWebview_ } from '../types/MessageFromExtensionToWebview'
import { sdkStubDeps } from '../typings/sdkStubDeps'
import { sdkTemplate } from '../typings/sdkTemplate'
import { CodePrettier } from '../utils/CodeFormatter'
import { extractErrorMessage } from '../utils/extractErrorMessage'
import { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { readableStringify } from '../utils/stringifyReadable'
import { CushyClient } from './Client'
import { ConfigFileWatcher } from './ConfigWatcher'
import { CushyDB } from './CushyDB'
import { CushyFile } from './CushyFile'
import { TypeScriptFilesMap } from './DirWatcher'
import { ActionDefinition, ActionDefinitionID } from './ActionDefinition'
import { GeneratedImage } from './GeneratedImage'
import { RANDOM_IMAGE_URL } from './RANDOM_IMAGE_URL'
import { ResilientWebSocketClient } from './ResilientWebsocket'
import { CushyServer } from './server'
import { FlowID } from 'src/front/FrontFlow'

export type CSCriticalError = { title: string; help: string }

export class ServerState {
    schema: Schema

    /** send by ComfyUI server */
    comfySessionId = 'temp'

    activeRun: Maybe<FlowRun> = null

    runs: FlowRun[] = []

    cacheFolderPath: AbsolutePath
    vscodeSettings: AbsolutePath
    comfyJSONPath: AbsolutePath
    embeddingsPath: AbsolutePath
    nodesTSPath: AbsolutePath
    cushyTSPath: AbsolutePath
    tsConfigPath: AbsolutePath
    outputFolderPath: AbsolutePath

    /** notify front of all new actions */
    allActionsRefs = (): MessageFromExtensionToWebview & { type: 'ls' } => {
        const actionDefs: ActionDefinition[] = Array.from(this.knownActions.values())
        const actionRefs = actionDefs.map((x) => ({ name: x.name, id: x.uid }))
        return { type: 'ls', actions: actionRefs, uid: getPayloadID() }
    }

    broadcastNewActionList = () => {
        const refs = this.allActionsRefs()
        console.log(`🔴 ${refs}`)
        this.broadCastToAllClients(refs)
    }
    // updateActionListDebounced = debounce(this.updateActionList, 1000, 2000)

    /** write a binary file to given absPath */
    writeBinaryFile(absPath: AbsolutePath, content: Buffer) {
        // ensure folder exists
        const folder = join(absPath, '..')
        mkdirSync(folder, { recursive: true })
        writeFileSync(absPath, content)
    }

    /** read text file, optionally provide a default */
    readJSON = <T extends any>(absPath: AbsolutePath, def?: T): T => {
        console.log(absPath)
        const exists = existsSync(absPath)
        if (!exists) {
            if (def != null) return def
            throw new Error(`file does not exist ${absPath}`)
        }
        const str = readFileSync(absPath, 'utf8')
        const json = JSON.parse(str)
        return json
    }

    /** read text file, optionally provide a default */
    readTextFile = (absPath: AbsolutePath, def: string): string => {
        const exists = existsSync(absPath)
        if (!exists) return def
        const x = readFileSync(absPath)
        const str = x.toString()
        return str
    }

    writeTextFile(
        //
        absPath: AbsolutePath,
        content: string,
        open = false,
    ) {
        // ensure folder exists
        const folder = join(absPath, '..')
        mkdirSync(folder, { recursive: true })
        writeFileSync(absPath, content, 'utf-8')
    }

    flows = new Map<FlowID, FlowRun>()
    getOrCreateFlow = (flowID: FlowID): FlowRun => {
        const prev = this.flows.get(flowID)
        if (prev != null) return prev
        const flow = new FlowRun(this, flowID)
        return flow
    }

    knownActions = new Map<ActionDefinitionID, ActionDefinition>()
    knownFiles = new Map<AbsolutePath, CushyFile>()

    /** wrapper around vscode.tests.createTestController so logic is self-contained  */

    clients = new Map<string, CushyClient>()
    registerClient = (id: string, client: CushyClient) => this.clients.set(id, client)
    unregisterClient = (id: string) => this.clients.delete(id)

    lastMessagesPerType = new Map<MessageFromExtensionToWebview['type'], MessageFromExtensionToWebview>()

    persistMessageInHistoryIfNecessary = (message: MessageFromExtensionToWebview) => {
        if (message.type === 'action-start') this.db.recordEvent(message)
        if (message.type === 'images') this.db.recordEvent(message)
        if (message.type === 'print') this.db.recordEvent(message)
        if (message.type === 'prompt') this.db.recordEvent(message)
        return
    }

    broadCastToAllClients = (message_: MessageFromExtensionToWebview_): PayloadID => {
        const uid = getPayloadID()
        const message: MessageFromExtensionToWebview = { ...message_, uid }
        const clients = Array.from(this.clients.values())
        this.lastMessagesPerType.set(message.type, message)
        this.persistMessageInHistoryIfNecessary(message)
        console.log(`sending message ${message.type} to ${clients.length} clients`)
        for (const client of clients) client.sendMessage(message)
        return uid
    }

    relative = (absolutePath: AbsolutePath): RelativePath => {
        return asRelativePath(relative(this.rootPath, absolutePath))
    }

    resolveFromRoot = (relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(this.rootPath, relativePath))
    resolve = (from: AbsolutePath, relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(from, relativePath))

    configWatcher = new ConfigFileWatcher()
    codePrettier: CodePrettier
    server!: CushyServer
    db: CushyDB

    constructor(
        /** path of the workspace */
        public rootPath: AbsolutePath,
        public opts: {
            /**
             * if set, no stub will be generated
             * if unset, will generate self-contained stubs
             * */
            cushySrcPathPrefix?: string
            /**
             * true in prod, false when running from this local subfolder
             * */
            genTsConfig: boolean
            /** true in prod, false when running from this local subfolder */
        },
    ) {
        this.db = new CushyDB(this)
        this.codePrettier = new CodePrettier(this)
        this.cacheFolderPath = this.resolve(this.rootPath, asRelativePath('.cushy/cache'))
        this.vscodeSettings = this.resolve(this.rootPath, asRelativePath('.vscode/settings.json'))
        this.comfyJSONPath = this.resolve(this.rootPath, asRelativePath('.cushy/nodes.json'))
        this.embeddingsPath = this.resolve(this.rootPath, asRelativePath('.cushy/embeddings.json'))
        this.nodesTSPath = this.resolve(this.rootPath, asRelativePath('global.d.ts'))
        this.cushyTSPath = this.resolve(this.rootPath, asRelativePath('.cushy/cushy.d.ts'))
        this.tsConfigPath = this.resolve(this.rootPath, asRelativePath('tsconfig.json'))
        this.outputFolderPath = this.resolve(this.cacheFolderPath, asRelativePath('outputs'))

        this.server = new CushyServer(this)
        this.schema = this.restoreSchemaFromCache()

        // gen files for standalone mode
        if (opts.genTsConfig) this.createTSConfigIfMissing()
        if (opts.cushySrcPathPrefix == null) this.writeTextFile(this.cushyTSPath, `${sdkTemplate}\n${sdkStubDeps}`)

        this.ws = this.initWebsocket()
        this.autoDiscoverEveryWorkflow()
        makeAutoObservable(this)
        this.configWatcher.startWatching(this.resolveFromRoot(asRelativePath('cushyconfig.json')))
    }

    createTSConfigIfMissing = () => {
        // create an empty tsconfig.json if it doesn't exist
        const tsConfigExists = existsSync(this.tsConfigPath)
        if (!tsConfigExists) {
            logger().info(`no tsconfig.json found, creating a default one`)
            const content = {
                compilerOptions: {
                    target: 'ESNext',
                    lib: ['ESNext'],
                },
                include: ['.cushy/*.d.ts', '**/*.ts'],
            }
            const contentStr = JSON.stringify(content, null, 4)
            this.writeTextFile(this.tsConfigPath, contentStr)
        }
        // const json = this.readJSON(this.tsConfigUri)
    }

    restoreSchemaFromCache = (): Schema => {
        let schema: Schema
        try {
            logger().info('⚡️ attemping to load cached nodes...')
            const cachedComfyJSON = this.readJSON<ComfySchemaJSON>(this.comfyJSONPath)
            const cachedEmbeddingsJSON = this.readJSON<EmbeddingName[]>(this.embeddingsPath)
            logger().info('⚡️ found cached json for nodes...')
            schema = new Schema(cachedComfyJSON, cachedEmbeddingsJSON)
            logger().info('⚡️ 🟢 object_info and embeddings restored from cache')
            logger().info('⚡️ 🟢 schema restored')
        } catch (error) {
            logger().error('⚡️ ' + extractErrorMessage(error))
            logger().error('⚡️ 🔴 failed to restore object_info and/or embeddings from cache')
            logger().info('⚡️ initializing empty schema')
            schema = new Schema({}, [])
        }
        return schema
    }

    // 🔴 watchForCOnfigurationChanges = () => {
    // 🔴     logger().info('watching for configuration changes...')
    // 🔴     vscode.workspace.onDidChangeConfiguration((e) => {
    // 🔴         if (e.affectsConfiguration('cushystudio.serverHostHTTP')) {
    // 🔴             logger().info('cushystudio.serverHostHTTP changed')
    // 🔴             this.fetchAndUdpateSchema()
    // 🔴             return
    // 🔴         }
    // 🔴         if (e.affectsConfiguration('cushystudio.serverWSEndoint')) {
    // 🔴             logger().info('cushystudio.serverWSEndoint changed')
    // 🔴             this.ws.updateURL(this.getWSUrl())
    // 🔴             return
    // 🔴         }
    // 🔴     })
    // 🔴 }

    tsFilesMap = new TypeScriptFilesMap(this)
    autoDiscoverEveryWorkflow = () => {
        this.tsFilesMap.startWatching(join(this.rootPath))

        // // pre-populate the tree with any open documents
        // for (const document of vscode.workspace.textDocuments) this.updateNodeForDocument(document)

        // // auto-update the tree when documents are opened or changed
        // const _1 = vscode.workspace.onDidOpenTextDocument(this.updateNodeForDocument)
        // const _2 = vscode.workspace.onDidChangeTextDocument((e) => this.updateNodeForDocument(e.document))
        // this.context.subscriptions.push(_1, _2)
    }

    /** will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server */
    ws: ResilientWebSocketClient

    getServerHostHTTP(): string {
        return (
            this.configWatcher.jsonContent['cushystudio.serverHostHTTP'] ??
            //
            'http://192.168.1.19:8188'
            // 'http://localhost:8188' //
        )
    }
    getWSUrl = (): string => {
        return (
            this.configWatcher.jsonContent['cushystudio.serverWSEndoint'] ??
            //
            `ws://192.168.1.19:8188/ws`
            // `ws://localhost:8188/ws`
        )
    }

    initWebsocket = () =>
        new ResilientWebSocketClient({
            onClose: () => {
                this.broadCastToAllClients({ type: 'cushy_status', connected: false })
            },
            onConnectOrReconnect: () => {
                this.broadCastToAllClients({ type: 'cushy_status', connected: true })
                this.fetchAndUdpateSchema()
            },
            url: this.getWSUrl,
            onMessage: this.onMessage,
        })

    // /** ensure webview is opened */
    // ensureWebviewPanelIsOpened = async (): Promise<void> => {
    //     if (this.clients.size > 0) return
    //     return await this.openWebview()
    // }

    forwardImagesToFrontV2 = (images: GeneratedImage[]) => {
        this.broadCastToAllClients({ type: 'images', images: images.map((i) => i.toJSON()) })
    }

    onMessage = (e: WS.MessageEvent) => {
        logger().info(`🧦 received ${e.data}`)
        const msg: WsMsg = JSON.parse(e.data as any)

        this.broadCastToAllClients({ ...msg })

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
        if (msg.type === 'execution_cached') {
            logger().debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            // return promptStep.onExecutionCached(msg)
            return
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
            // this.sendMessage({ type: 'images', uris })
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

    // fetchPrompHistory = async () => {
    //     const res = await fetch(`${this.serverHostHTTP}/history`, { method: 'GET' })
    //     console.log(res.data)
    //     const x = res.data
    //     return x
    // }

    CRITICAL_ERROR: Maybe<CSCriticalError> = null

    /** retri e the comfy spec from the schema*/
    fetchAndUdpateSchema = async (): Promise<ComfySchemaJSON> => {
        // 1. fetch schema$
        let schema$: ComfySchemaJSON
        try {
            // 1 ------------------------------------
            const object_info_url = `${this.getServerHostHTTP()}/object_info`
            logger().info(`[.... step 1/4] fetching schema from ${object_info_url} ...`)
            const headers: HeadersInit = { 'Content-Type': 'application/json' }
            const object_info_res = await fetch(object_info_url, { method: 'GET', headers })
            const object_info_json = (await object_info_res.json()) as { [key: string]: any }
            const knownNodeNames = Object.keys(object_info_json)
            logger().info(`[.... step 1/4] found ${knownNodeNames.length} nodes`) // (${JSON.stringify(keys)})
            schema$ = object_info_json as any
            logger().info('[*... step 1/4] schema fetched')

            // 1 ------------------------------------
            const embeddings_url = `${this.getServerHostHTTP()}/embeddings`
            logger().info(`[.... step 1/4] fetching embeddings from ${embeddings_url} ...`)
            const embeddings_res = await fetch(embeddings_url, { method: 'GET', headers })
            const embeddings_json = (await embeddings_res.json()) as EmbeddingName[]
            writeFileSync(this.embeddingsPath, JSON.stringify(embeddings_json), 'utf-8')
            // const keys2 = Object.keys(data2)
            // logger().info(`[.... step 1/4] found ${keys2.length} nodes`) // (${JSON.stringify(keys)})
            // schema$ = data as any
            logger().info(JSON.stringify(embeddings_json))
            logger().info('[*... step x/4] embeddings fetched')

            // 2 ------------------------------------
            http: logger().info('[*... step 2/4] updating schema...')
            const comfyJSONStr = readableStringify(schema$, 3)
            const comfyJSONBuffer = Buffer.from(comfyJSONStr, 'utf8')
            writeFileSync(this.comfyJSONPath, comfyJSONBuffer, 'utf-8')
            this.schema.update(schema$, embeddings_json)
            logger().info('[**.. step 2/4] schema updated')

            // 3 ------------------------------------
            logger().info('[**.. step 3/4] udpatin schema code...')
            const comfySchemaTs = this.schema.codegenDTS({ cushySrcPathPrefix: this.opts.cushySrcPathPrefix })
            logger().info('[***. step 3/4] schema code updated ')

            // 4 ------------------------------------
            logger().info('[**** step 4/4] saving schema')
            // const comfySchemaBuff = Buffer.from(comfySchemaTs, 'utf8')
            const comfySchemaTsFormatted = await this.codePrettier.prettify(comfySchemaTs)
            writeFileSync(this.nodesTSPath, comfySchemaTsFormatted, 'utf-8')
            logger().info('[**** step 4/4] 🟢 schema updated')
        } catch (error) {
            console.error('🔴 FAILURE TO GENERATE nodes.d.ts', extractErrorMessage(error))
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
}
