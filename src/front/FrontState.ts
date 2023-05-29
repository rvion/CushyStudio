import type { ImageID, ImageT } from 'src/models/Image'
import type { ComfyStatus, WsMsg } from '../types/ComfyWsApi'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { LiveDB } from '../db/LiveDB'
import { GraphL } from '../models/Graph'
import { ProjectL, asProjectID } from '../models/Project'
import { EmbeddingName, SchemaL } from '../models/Schema'
import { asStepID } from '../models/Step'
import { FromExtension_CushyStatus, MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import { Maybe } from '../utils/types'
import { UIAction } from './UIAction'
import { LightBoxState } from './ui/LightBox'
import { CushyFile } from '../back/CushyFile'
import { Runtime } from '../back/Runtime'
import { ActionID, ActionL } from '../models/Action'
import { PromptL } from '../models/Prompt'
import { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
import { join } from 'pathe'
import { CodePrettier } from '../utils/CodeFormatter'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs'
import { CushyFileWatcher } from '../back/CushyFileWatcher'
import { ResilientWebSocketClient } from '../back/ResilientWebsocket'
import { ComfySchemaJSON } from '../types/ComfySchemaJSON'
import { sdkStubDeps } from '../typings/sdkStubDeps'
import { sdkTemplate } from '../typings/sdkTemplate'
import { extractErrorMessage } from '../utils/extractErrorMessage'
import { readableStringify } from '../utils/stringifyReadable'

export type CSCriticalError = { title: string; help: string }
export type MsgGroup = {
    groupType: string
    messages: MessageFromExtensionToWebview[]
    uis: JSX.Element[]
    wrap: boolean
}

export class STATE {
    uid = nanoid()
    schema: SchemaL
    hovered: Maybe<ImageT> = null
    lightBox = new LightBoxState(() => this.images, true)

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

    comfySessionId = 'temp' /** send by ComfyUI server */
    activePrompt: Maybe<PromptL> = null
    runs: Runtime[] = []
    cacheFolderPath: AbsolutePath
    vscodeSettings: AbsolutePath
    comfyJSONPath: AbsolutePath
    embeddingsPath: AbsolutePath
    nodesTSPath: AbsolutePath
    cushyTSPath: AbsolutePath
    tsConfigPath: AbsolutePath
    outputFolderPath: AbsolutePath
    knownActions = new Map<ActionID, ActionL>()
    knownFiles = new Map<AbsolutePath, CushyFile>()
    resolveFromRoot = (relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(this.rootPath, relativePath))
    resolve = (from: AbsolutePath, relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(from, relativePath))
    codePrettier: CodePrettier

    startProject = (): ProjectL => {
        const projectID = asProjectID(nanoid())
        const stepID = asStepID(nanoid())
        const step = this.db.steps.create({ id: stepID, projectID: projectID })
        const project = this.db.projects.create({ id: projectID, rootStepID: stepID, name: 'new project' })
        return project
    }
    // --------------------------

    expandNodes: boolean = false
    flowDirection: 'down' | 'up' = 'up'
    showAllMessageReceived: boolean = false
    currentAction: UIAction | null = null
    // msgGroupper = new MessageGroupper(this, () => this.db.msgs)

    // this is the new way
    // answerInfo = (value: any) => this.sendMessageToExtension({ type: 'answer', value })

    gallerySize: number = 256
    // cushySocket: ResilientSocketToExtension
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
        this.codePrettier = new CodePrettier(this)
        this.cacheFolderPath = this.resolve(this.rootPath, asRelativePath('.cushy/cache'))
        this.vscodeSettings = this.resolve(this.rootPath, asRelativePath('.vscode/settings.json'))
        this.comfyJSONPath = this.resolve(this.rootPath, asRelativePath('.cushy/nodes.json'))
        this.embeddingsPath = this.resolve(this.rootPath, asRelativePath('.cushy/embeddings.json'))
        this.nodesTSPath = this.resolve(this.rootPath, asRelativePath('global.d.ts'))
        this.cushyTSPath = this.resolve(this.rootPath, asRelativePath('.cushy/cushy.d.ts'))
        this.tsConfigPath = this.resolve(this.rootPath, asRelativePath('tsconfig.json'))
        this.outputFolderPath = this.resolve(this.cacheFolderPath, asRelativePath('outputs'))

        this.schema = this.db.schema

        // if (typeof acquireVsCodeApi === 'function') this.vsCodeApi = acquireVsCodeApi()
        // console.log('a')
        // this.cushySocket = new ResilientSocketToExtension({
        //     url: () => 'ws://localhost:8388',
        //     onConnectOrReconnect: () => {
        //         this.sendMessageToExtension({ type: 'say-ready', frontID: this.uid })
        //         // toaster.push('Connected to CushyStudio')
        //     },
        //     onMessage: (msg) => {
        //         // console.log('received', msg.data)
        //         const json = JSON.parse(msg.data)
        //         this.onMessageFromExtension(json)
        //     },
        // })
        // console.log('b')
        // this.startProject()
        if (opts.genTsConfig) this.createTSConfigIfMissing()
        if (opts.cushySrcPathPrefix == null) this.writeTextFile(this.cushyTSPath, `${sdkTemplate}\n${sdkStubDeps}`)

        this.tsFilesMap.walk(this.rootPath)

        this.ws = this.initWebsocket()
        // this.autoDiscoverEveryWorkflow()
        makeAutoObservable(this)
        // window.addEventListener('message', this.onMessageFromExtension)
        // this.sendMessageToExtension({ type: 'say-ready', frontID: this.uid })
    }

    createTSConfigIfMissing = () => {
        // create an empty tsconfig.json if it doesn't exist
        const tsConfigExists = existsSync(this.tsConfigPath)
        if (!tsConfigExists) {
            console.info(`no tsconfig.json found, creating a default one`)
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

    tsFilesMap = new CushyFileWatcher(this)
    // autoDiscoverEveryWorkflow = () => {
    //     this.tsFilesMap.startWatching(join(this.rootPath))
    // }

    /**
     * will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server
     * */
    ws: ResilientWebSocketClient

    getServerHostHTTP(): string {
        return (
            // this.configWatcher.jsonContent['cushystudio.serverHostHTTP'] ??
            //,
            'http://192.168.1.19:8188'
            // 'http://localhost:8188' //
        )
    }
    getWSUrl = (): string => {
        return (
            // this.configWatcher.jsonContent['cushystudio.serverWSEndoint'] ??
            //
            `ws://192.168.1.19:8188/ws`
            // `ws://localhost:8188/ws`
        )
    }

    initWebsocket = () =>
        new ResilientWebSocketClient({
            onClose: () => {
                // 🔴
                // this.db. = 'disconnected'
                // this.broadCastToAllClients({ type: 'cushy_status', connected: false })
            },
            onConnectOrReconnect: () => {
                // 🔴
                // this.db.store.config = 'connected'
                // this.broadCastToAllClients({ type: 'cushy_status', connected: true })
                this.fetchAndUdpateSchema()
            },
            url: this.getWSUrl,
            onMessage: this.onMessage,
        })

    onMessage = (e: MessageEvent) => {
        console.info(`🧦 received ${e.data}`)
        const msg: WsMsg = JSON.parse(e.data as any)

        // this.broadCastToAllClients({ ...msg })

        if (msg.type === 'status') {
            if (msg.data.sid) this.comfySessionId = msg.data.sid
            this.status = msg.data.status
            return
        }

        const currPrompt: Maybe<PromptL> = this.activePrompt
        if (currPrompt == null) {
            console.error('🐰', `❌ received ${msg.type} but currPrompt is null`)
            return
            // return console.log(`❌ received ${msg.type} but currentRun is null`)
        }

        // ensure current step is a prompt
        // const promptStep /*: FlowExecutionStep*/ = currPrompt.step
        // const prompt = promptStep.graph.item
        const graph = currPrompt.graph.item
        if (graph == null) return console.log(`❌ received ${msg.type} but graph is not prompt`)

        // defer accumulation to ScriptStep_prompt
        if (msg.type === 'progress') {
            console.debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            return graph.onProgress(msg)
        }

        if (msg.type === 'executing') {
            console.debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            return currPrompt.onExecuting(msg)
        }
        if (msg.type === 'execution_cached') {
            console.debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            // return promptStep.onExecutionCached(msg)
            return
        }
        if (msg.type === 'executed') {
            console.info(`${msg.type} ${JSON.stringify(msg.data)}`)
            const images = currPrompt.onExecuted(msg)
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
    getUrlAsBlob = async (url: string) => {
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
            console.info(`[.... step 1/4] fetching schema from ${object_info_url} ...`)
            const headers: HeadersInit = { 'Content-Type': 'application/json' }
            const object_info_res = await fetch(object_info_url, { method: 'GET', headers })
            const object_info_json = (await object_info_res.json()) as { [key: string]: any }
            const knownNodeNames = Object.keys(object_info_json)
            console.info(`[.... step 1/4] found ${knownNodeNames.length} nodes`) // (${JSON.stringify(keys)})
            schema$ = object_info_json as any
            console.info('[*... step 1/4] schema fetched')

            // 1 ------------------------------------
            const embeddings_url = `${this.getServerHostHTTP()}/embeddings`
            console.info(`[.... step 1/4] fetching embeddings from ${embeddings_url} ...`)
            const embeddings_res = await fetch(embeddings_url, { method: 'GET', headers })
            const embeddings_json = (await embeddings_res.json()) as EmbeddingName[]
            writeFileSync(this.embeddingsPath, JSON.stringify(embeddings_json), 'utf-8')
            // const keys2 = Object.keys(data2)
            // console.info(`[.... step 1/4] found ${keys2.length} nodes`) // (${JSON.stringify(keys)})
            // schema$ = data as any
            console.info(JSON.stringify(embeddings_json))
            console.info('[*... step x/4] embeddings fetched')

            // 2 ------------------------------------
            http: console.info('[*... step 2/4] updating schema...')
            const comfyJSONStr = readableStringify(schema$, 3)
            const comfyJSONBuffer = Buffer.from(comfyJSONStr, 'utf8')
            writeFileSync(this.comfyJSONPath, comfyJSONBuffer, 'utf-8')
            this.schema.update({ spec: schema$, embeddings: embeddings_json })

            const numNodesInSource = Object.keys(schema$).length
            const numNodesInSchema = this.schema.nodes.length
            if (numNodesInSource !== numNodesInSchema) {
                console.log(`🔴 ${numNodesInSource} != ${numNodesInSchema}`)
            }
            console.info('[**.. step 2/4] schema updated')

            // 3 ------------------------------------
            console.info('[**.. step 3/4] udpatin schema code...')
            const comfySchemaTs = this.schema.codegenDTS({ cushySrcPathPrefix: this.opts.cushySrcPathPrefix })
            console.info('[***. step 3/4] schema code updated ')

            // 4 ------------------------------------
            console.info('[**** step 4/4] saving schema')
            // const comfySchemaBuff = Buffer.from(comfySchemaTs, 'utf8')
            const comfySchemaTsFormatted = await this.codePrettier.prettify(comfySchemaTs)
            // console.log(this.nodesTSPath, comfySchemaTsFormatted)
            writeFileSync(this.nodesTSPath, comfySchemaTsFormatted, 'utf-8')
            console.info('[**** step 4/4] 🟢 schema updated')
        } catch (error) {
            console.error('🔴 FAILURE TO GENERATE nodes.d.ts', extractErrorMessage(error))
            console.error('🐰', extractErrorMessage(error))
            console.error('🦊', 'Failed to fetch ObjectInfos from Comfy.')
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

    graph: Maybe<GraphL> = null
    // schema: Maybe<Schema> = null
    images: ImageT[] = []
    imagesById: Map<ImageID, ImageT> = new Map()
    get imageReversed() {
        return this.images.slice().reverse()
    }
    db = new LiveDB()
    // get schema(): SchemaL {
    //     return this.db.schema
    // }
    sid: Maybe<string> = null
    comfyStatus: Maybe<ComfyStatus> = null
    cushyStatus: Maybe<FromExtension_CushyStatus> = null
    // knownActions = new Map<ActionDefinitionID, ActionT>()
    // get ActionOptionForSelectInput() {
    //     // return Array.from(this.knownActions.values()) // .map((x) => ({ value: x.id, label: x.name }))
    // }

    // selectedActionID: Maybe<ActionRef['id']> = null

    // runs: { flowRunId: string; graph: Graph }[]
    // XXXX = new Map<MessageFromExtensionToWebview['uid'], Graph>()

    createFolder = () => {
        this.db.folders.create({ id: nanoid() })
    }

    // updateConfig = (values: Partial<CushyDBData>) => {
    //     Object.assign(this.db.config, values)
    // }

    // moveFile = (ii: ImageT, folderUID: FolderUID) => {
    //     // 1. index folder in file
    //     const fileMeta = this.files.getOrThrow()
    //     if (fileMeta == null) this.db.files[ii.id] = {}
    //     this.db.files[ii.id]!.folder = folderUID

    //     // // 2. index file in folder
    //     // const folderMeta = this.db.folders[folderUID]
    //     // if (folderMeta == null) this.db.folders[folderUID] = {}
    //     // if (this.db.folders[folderUID]!.imageUIDs == null) this.db.folders[folderUID]!.imageUIDs = []
    //     // this.db.folders[folderUID]!.imageUIDs?.push(ii.uid)
    // }
    // ---------------------------------------

    // tagFile = (file: string, values: { [key: string]: any }) => {
    //     const prevMeta = this.db.fileMetadata[file]
    //     if (prevMeta) Object.assign(prevMeta, values)
    //     else this.data.fileMetadata[file] = values
    //     this.scheduleSync()
    // }

    // recordEvent = (msg: MessageFromExtensionToWebview) => {
    //     console.log('🔴 recording', msg)
    //     this.data.msgs.push({ at: Date.now(), msg })
    //     this.scheduleSync()
    // }

    // private recordImages = (imgs: ImageInfos[]) => {
    //     this.images.push(...imgs)
    //     for (const img of imgs) this.imagesById.set(img.uid, img)
    // }

    // getOrCreateFlow = (flowID: FlowID): FrontFlow => {
    //     let flow = this.flows.get(flowID)
    //     if (flow == null) flow = this.startProject(flowID)
    //     return flow
    // }

    /** this is for the UI only; process should be very thin / small */
    // onMessageFromExtension = (message: MessageFromExtensionToWebview) => {
    //     // 1. enqueue the message
    //     const msg: MessageFromExtensionToWebview =
    //         typeof message === 'string' //
    //             ? JSON.parse(message)
    //             : message

    //     // this message must not be logged
    //     if (msg.type === 'sync-history') {
    //         this.db.data = msg.history
    //         for (const msg of this.db.data.msgs) {
    //             if (!(msg.msg.type === 'images')) continue
    //             this.recordImages(msg.msg.images)
    //         }
    //         // this.db.createFolder()
    //         // this.db.createFolder()
    //         return
    //     }

    //     console.log('💬', msg.type) //, { message })

    //     this.db.data.msgs.push({ at: Date.now(), msg })

    //     // 2. process the info
    //     if (msg.type === 'action-code') return
    //     if (msg.type === 'ask') {
    //         const flow = this.getOrCreateFlow(msg.flowID)
    //         flow.history.push(msg)
    //         // flow.pendingAsk.push(msg)
    //         return
    //     }
    //     if (msg.type === 'show-html') {
    //         if (msg.flowID) {
    //             const flow = this.getOrCreateFlow(msg.flowID)
    //             flow.history.push(msg)
    //         }
    //         return
    //     }

    //     if (msg.type === 'print') {
    //         const flow = this.getOrCreateFlow(msg.flowID)
    //         flow.history.push(msg)
    //         return
    //     }
    //     if (msg.type === 'action-start') {
    //         const flow = this.getOrCreateFlow(msg.flowID)
    //         if (flow.actions.has(msg.executionID)) return console.log(`🔴 error: action already exists`)
    //         flow.actionStarted(msg)
    //         flow.history.push(msg)
    //         return
    //     }

    //     if (msg.type === 'action-end') {
    //         const flow = this.getOrCreateFlow(msg.flowID)
    //         flow.history.push(msg)
    //         const action = flow.actions.get(msg.executionID)
    //         if (action == null) return console.log(`🔴 error: no action found`)
    //         action.done = msg.status
    //         return
    //     }

    //     if (msg.type === 'schema') {
    //         this.schema = new Schema(msg.schema, msg.embeddings)
    //         return
    //     }

    //     if (msg.type === 'status') {
    //         if (msg.data.sid) this.sid = msg.data.sid
    //         this.comfyStatus = msg.data.status
    //         return
    //     }
    //     if (msg.type === 'execution_cached') return // 🔴

    //     if (msg.type === 'prompt') {
    //         if (this.schema == null) throw new Error('missing schema')
    //         this.graph = new Graph(this.schema, msg.graph)
    //         return
    //     }

    //     if (msg.type === 'images') {
    //         if (msg.flowID) {
    //             const flow = this.getOrCreateFlow(msg.flowID)
    //             flow.history.push(msg)
    //         }
    //         return this.recordImages(msg.images)
    //     }

    //     if (msg.type === 'ls') {
    //         console.log(msg)
    //         let firstKnownActionID = msg.actions[0]?.id
    //         for (const a of msg.actions) this.knownActions.set(a.id, a)
    //         // if (this.selectedActionID == null && firstKnownActionID) this.selectedActionID = firstKnownActionID
    //         return
    //     }

    //     if (msg.type === 'cushy_status') {
    //         this.cushyStatus = msg
    //         return
    //     }

    //     const graph = this.graph
    //     if (graph == null) throw new Error('missing graph')

    //     // defer accumulation to ScriptStep_prompt
    //     if (msg.type === 'progress') {
    //         console.debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
    //         return graph.onProgress(msg)
    //     }

    //     if (msg.type === 'executing') {
    //         if (graph == null) throw new Error('missing graph')
    //         this.XXXX.set(msg.uid, graph)
    //         if (msg.data.node == null) this.graph = null // done
    //         console.debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
    //         return graph.onExecuting(msg)
    //     }

    //     if (msg.type === 'executed') {
    //         console.info(`${msg.type} ${JSON.stringify(msg.data)}`)
    //         // return graph.onExecuted(msg)
    //         return
    //     }

    //     exhaust(msg)
    // }

    /** Post a message (i.e. send arbitrary data) to the owner of the webview (the extension).
     * @remarks When running webview code inside a web browser, postMessage will instead log the given message to the console.
     */
    // public sendMessageToExtension(message: MessageFromWebviewToExtension) {
    //     this.cushySocket.send(JSON.stringify(message))
    //     // else console.log(message)
    // }
}
