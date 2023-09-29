import type { ComfyStatus, PromptID, PromptRelated_WsMsg, WsMsg } from '../types/ComfyWsApi'
import type { CSCriticalError } from './CSCriticalError'
import type { ConfigFile } from 'src/core/ConfigFile'
import type { ImageL } from '../models/Image'

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { createRef } from 'react'
import { nanoid } from 'nanoid'
import { join } from 'pathe'

import { FromExtension_CushyStatus } from '../types/MessageFromExtensionToWebview'
import { ResilientWebSocketClient } from '../back/ResilientWebsocket'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
import { extractErrorMessage } from '../utils/extractErrorMessage'
import { readableStringify } from '../utils/stringifyReadable'
import { CushyFileWatcher } from '../back/CushyFileWatcher'
import { ComfySchemaJSON } from '../types/ComfySchemaJSON'
import { EmbeddingName, SchemaL } from '../models/Schema'
import { ManualPromise } from '../utils/ManualPromise'
import { CodePrettier } from '../utils/CodeFormatter'
import { sdkStubDeps } from '../typings/sdkStubDeps'
import { sdkTemplate } from '../typings/sdkTemplate'
import { LightBoxState } from './ui/LightBox'
import { exhaust } from '../utils/ComfyUtils'
import { asFolderID } from '../models/Folder'
import { JsonFile } from '../core/JsonFile'
import { GraphL } from '../models/Graph'
import { LiveDB } from '../db/LiveDB'
import { UIAction } from './UIAction'

export class STATE {
    //file utils that need to be setup first because
    // other stuff depends on them
    resolveFromRoot = (relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(this.rootPath, relativePath))
    resolve = (from: AbsolutePath, relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(from, relativePath))
    codePrettier: CodePrettier

    // front uid to fix hot reload
    uid = nanoid()

    // core data
    db: LiveDB

    // main state api
    schema: SchemaL
    comfySessionId = 'temp' /** send by ComfyUI server */
    // activePrompt: Maybe<PromptL> = null

    // runs: Runtime[] = []

    // paths
    cacheFolderPath: AbsolutePath
    vscodeSettings: AbsolutePath
    comfyJSONPath: AbsolutePath
    embeddingsPath: AbsolutePath
    nodesTSPath: AbsolutePath
    cushyTSPath: AbsolutePath
    tsConfigPath: AbsolutePath
    outputFolderPath: AbsolutePath

    // files and actions
    // knownFiles = new Map<AbsolutePath, CushyFile>()
    get toolsSorted() {
        return this.db.tools.values.slice().sort((a, b) => a.data.priority - b.data.priority)
    }

    // runtime
    status: ComfyStatus | null = null
    sid: Maybe<string> = null
    comfyStatus: Maybe<ComfyStatus> = null
    cushyStatus: Maybe<FromExtension_CushyStatus> = null

    // ui stuff
    lightBox = new LightBoxState(() => this.db.images.values, false)
    hovered: Maybe<ImageL> = null

    // startProject = () => {
    //     const initialGraph = this.db.graphs.create({ comfyPromptJSON: {} })
    //     this.db.projects.create({ rootGraphID: initialGraph.id, name: 'new project' })
    //     const startDraft = initialGraph.createDraft()
    //     initialGraph.update({ focusedDraftID: startDraft.id })
    // }
    configFile: JsonFile<ConfigFile>
    startProjectV2 = () => {
        console.log(`[🛋️] creating project`)
        const initialGraph = this.db.graphs.create({ comfyPromptJSON: {} })
        this.db.projects.create({
            activeToolID: this.db.tools.values[0].id,
            rootGraphID: initialGraph.id,
            name: 'new project',
        })
        // const startDraft = initialGraph.createDraft()
    }

    // showAllMessageReceived: boolean = false // ❌ legacy
    comfyUIIframeRef = createRef<HTMLIFrameElement>()
    expandNodes: boolean = false

    // action
    private _action: UIAction = { type: 'form' }
    get action() { return this._action } // prettier-ignore
    setAction = (action: UIAction) => (this._action = action)

    gallerySize: number = 256
    tsFilesMap = new CushyFileWatcher(this)
    schemaReady = new ManualPromise<true>()

    constructor(
        /** path of the workspace */
        public rootPath: AbsolutePath,
        /** workspace configuration */
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
        console.log('[🗳️] starting web app')
        this.db = new LiveDB(this)
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
        this.configFile = new JsonFile<ConfigFile>({
            folder: this.rootPath,
            name: 'CONFIG.json',
            maxLevel: 3,
            init: () => ({
                comfyHost: 'localhost',
                comfyPort: 8188,
                useHttps: false,
            }),
        })
        if (opts.genTsConfig) this.createTSConfigIfMissing()
        if (opts.cushySrcPathPrefix == null) this.writeTextFile(this.cushyTSPath, `${sdkTemplate}\n${sdkStubDeps}`)

        Promise.all([
            //
            this.tsFilesMap.walk(this.rootPath),
            this.schemaReady,
        ]).then((_done) => {
            if (this.db.projects.size === 0) this.startProjectV2()
        })

        this.ws = this.initWebsocket()
        // this.autoDiscoverEveryWorkflow()
        makeAutoObservable(this, { comfyUIIframeRef: false })
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

    /**
     * will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server
     * */
    ws: ResilientWebSocketClient
    getServerHostHTTP(): string {
        const method = this.configFile.value.useHttps ? 'https' : 'http'
        const host = this.configFile.value.comfyHost
        const port = this.configFile.value.comfyPort
        return `${method}://${host}:${port}`
    }
    getWSUrl = (): string => {
        const method = this.configFile.value.useHttps ? 'wss' : 'ws'
        const host = this.configFile.value.comfyHost
        const port = this.configFile.value.comfyPort
        return `${method}://${host}:${port}/ws`
    }

    initWebsocket = () => {
        console.log('[👢] WEBSOCKET: starting client to ComfyUI')
        return new ResilientWebSocketClient({
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
    }

    private _pendingMsgs = new Map<PromptID, WsMsg[]>()
    private activePromptID: PromptID | null = null
    temporize = (prompt_id: PromptID, msg: PromptRelated_WsMsg) => {
        this.activePromptID = prompt_id
        const prompt = this.db.prompts.get(prompt_id)

        // case 1. no prompt yet => just store the messages
        if (prompt == null) {
            const msgs = this._pendingMsgs.get(prompt_id)
            if (msgs) msgs.push(msg)
            else this._pendingMsgs.set(prompt_id, [msg])
            return
        }
        // case 2. prompt exists => send the messages
        prompt.onPromptRelatedMessage(msg)
    }

    preview: Maybe<{
        blob: Blob
        url: string
    }> = null
    onMessage = (e: MessageEvent) => {
        if (e.data instanceof ArrayBuffer) {
            console.log('[👢] WEBSOCKET: received ArrayBuffer', e.data)
            const view = new DataView(e.data)
            const eventType = view.getUint32(0)
            const buffer = e.data.slice(4)
            switch (eventType) {
                case 1:
                    const view2 = new DataView(e.data)
                    const imageType = view2.getUint32(0)
                    let imageMime
                    switch (imageType) {
                        case 1:
                        default:
                            imageMime = 'image/jpeg'
                            break
                        case 2:
                            imageMime = 'image/png'
                    }
                    const imageBlob = new Blob([buffer.slice(4)], { type: imageMime })
                    const imagePreview = URL.createObjectURL(imageBlob)
                    this.preview = { blob: imageBlob, url: imagePreview }
                    // 🔴 const previewImage = this.db.images.upsert({
                    // 🔴     id: 'PREVIEW',
                    // 🔴     localFolderPath: this.resolve(this.rootPath, asRelativePath('PREVIEW')),
                    // 🔴 })
                    break
                default:
                    throw new Error(`Unknown binary websocket message of type ${eventType}`)
            }
            return
        }
        console.info(`[👢] WEBSOCKET: received ${e.data}`)
        const msg: WsMsg = JSON.parse(e.data as any)

        if (msg.type === 'status') {
            if (msg.data.sid) this.comfySessionId = msg.data.sid
            this.status = msg.data.status
            return
        }

        // defer accumulation to ScriptStep_prompt
        if (msg.type === 'progress') {
            const activePromptID = this.activePromptID
            if (activePromptID == null) {
                console.log(`❌ received a 'progress' msg, but activePromptID is not set`)
                return
            }
            this.temporize(activePromptID, msg)
            return
        }
        if (
            msg.type === 'execution_start' ||
            msg.type === 'execution_cached' ||
            msg.type === 'execution_error' ||
            msg.type === 'executing' ||
            msg.type === 'executed'
        ) {
            this.temporize(msg.data.prompt_id, msg)
            return
        }

        exhaust(msg)
        console.log('❌', 'Unknown message:', msg)
        throw new Error('Unknown message type: ' + JSON.stringify(msg))
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
            console.info(`[🐱] CONFY: [.... step 1/4] fetching schema from ${object_info_url} ...`)
            const headers: HeadersInit = { 'Content-Type': 'application/json' }
            const object_info_res = await fetch(object_info_url, { method: 'GET', headers })
            const object_info_json = (await object_info_res.json()) as { [key: string]: any }
            const knownNodeNames = Object.keys(object_info_json)
            console.info(`[🐱] CONFY: [.... step 1/4] found ${knownNodeNames.length} nodes`) // (${JSON.stringify(keys)})
            schema$ = object_info_json as any
            console.info('[🐱] CONFY: [*... step 1/4] schema fetched')

            // 1 ------------------------------------
            const embeddings_url = `${this.getServerHostHTTP()}/embeddings`
            console.info(`[🐱] CONFY: [.... step 1/4] fetching embeddings from ${embeddings_url} ...`)
            const embeddings_res = await fetch(embeddings_url, { method: 'GET', headers })
            const embeddings_json = (await embeddings_res.json()) as EmbeddingName[]
            writeFileSync(this.embeddingsPath, JSON.stringify(embeddings_json), 'utf-8')
            // const keys2 = Object.keys(data2)
            // console.info(`[.... step 1/4] found ${keys2.length} nodes`) // (${JSON.stringify(keys)})
            // schema$ = data as any
            console.info(`[🐱] CONFY: ${embeddings_json.length} embedings found:`, { embeddings_json })
            console.info('[🐱] CONFY: [*... step x/4] embeddings fetched')

            // 2 ------------------------------------
            // http:
            console.info('[🐱] CONFY: [*... step 2/4] updating schema...')
            const comfyJSONStr = readableStringify(schema$, 3)
            const comfyJSONBuffer = Buffer.from(comfyJSONStr, 'utf8')
            writeFileSync(this.comfyJSONPath, comfyJSONBuffer, 'utf-8')
            this.schema.update({ spec: schema$, embeddings: embeddings_json })

            const numNodesInSource = Object.keys(schema$).length
            const numNodesInSchema = this.schema.nodes.length
            if (numNodesInSource !== numNodesInSchema) {
                console.log(`🔴 ${numNodesInSource} != ${numNodesInSchema}`)
            }
            console.info('[🐱] CONFY: [**.. step 2/4] schema updated')

            // 3 ------------------------------------
            console.info('[🐱] CONFY: [**.. step 3/4] udpatin schema code...')
            const comfySchemaTs = this.schema.codegenDTS({ cushySrcPathPrefix: this.opts.cushySrcPathPrefix })
            console.info('[🐱] CONFY: [***. step 3/4] schema code updated ')

            // 4 ------------------------------------
            console.info('[🐱] CONFY: [**** step 4/4] saving schema')
            // const comfySchemaBuff = Buffer.from(comfySchemaTs, 'utf8')
            const comfySchemaTsFormatted = await this.codePrettier.prettify(comfySchemaTs)
            // console.log(this.nodesTSPath, comfySchemaTsFormatted)
            writeFileSync(this.nodesTSPath, comfySchemaTsFormatted, 'utf-8')
            console.info('[🐱] CONFY: [**** step 4/4] 🟢 schema updated')
        } catch (error) {
            console.error('🔴 FAILURE TO GENERATE nodes.d.ts', extractErrorMessage(error))
            console.error('🐰', extractErrorMessage(error))
            console.error('🦊', 'Failed to fetch ObjectInfos from Comfy.')
            schema$ = {}
        }
        this.schemaReady.resolve(true)

        // this.objectInfoFile.update(schema$)
        // this.comfySDKFile.updateFromCodegen(comfySdkCode)
        // this.comfySDKFile.syncWithDiskFile()

        return schema$
    }

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    graph: Maybe<GraphL> = null
    // images: ImageT[] = []
    // imagesById: Map<ImageID, ImageT> = new Map()
    get imageReversed(): ImageL[] {
        return this.db.images.values.filter((x) => x.data.folderID == null)
    }

    createFolder = () => {
        this.db.folders.create({ id: asFolderID(nanoid()) })
    }
    // FILESYSTEM UTILS --------------------------------------------------------------------
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

    writeTextFile(absPath: AbsolutePath, content: string) {
        // ensure folder exists
        const folder = join(absPath, '..')
        mkdirSync(folder, { recursive: true })
        writeFileSync(absPath, content, 'utf-8')
    }
}
