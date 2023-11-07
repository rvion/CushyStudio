import type { ImageL } from '../models/Image'
import type { ComfyStatus, PromptID, PromptRelated_WsMsg, WsMsg } from '../types/ComfyWsApi'
import type { CSCriticalError } from '../widgets/CSCriticalError'

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { join } from 'pathe'
import { createRef } from 'react'
import { mkConfigFile, type ConfigFile } from 'src/core/ConfigFile'
import { mkTypescriptConfig, type TsConfigCustom } from '../widgets/TsConfigCustom'

import type { ActionTagMethodList } from 'src/cards/Card'
import { CardPath, asCardPath } from 'src/cards/CardPath'
import { GithubUserName } from 'src/cards/GithubUser'
import { Library } from 'src/cards/Library'
import { GithubRepoName } from 'src/cards/githubRepo'
import { DraftL } from 'src/models/Draft'
import { ProjectL } from 'src/models/Project'
import { ShortcutWatcher } from 'src/shortcuts/ShortcutManager'
import { shortcutsDef } from 'src/shortcuts/shortcuts'
import { ThemeManager } from 'src/theme/layoutTheme'
import { UserTags } from 'src/widgets/prompter/nodes/usertags/UserLoader'
import { CushyLayoutManager } from '../app/layout/Layout'
import { ResilientWebSocketClient } from '../back/ResilientWebsocket'
import { GitManagedFolder } from '../cards/updater'
import { JsonFile } from '../core/JsonFile'
import { LiveDB } from '../db/LiveDB'
import { ComfyImporter } from '../importers/ComfyImporter'
import { GraphL } from '../models/Graph'
import { EmbeddingName, SchemaL } from '../models/Schema'
import { ComfySchemaJSON, ComfySchemaJSON_zod } from '../types/ComfySchemaJSON'
import { FromExtension_CushyStatus } from '../types/MessageFromExtensionToWebview'
import { exhaust } from '../utils/misc/ComfyUtils'
import { ManualPromise } from '../utils/misc/ManualPromise'
import { ElectronUtils } from '../utils/electron/ElectronUtils'
import { extractErrorMessage } from '../utils/formatters/extractErrorMessage'
import { readableStringify } from '../utils/formatters/stringifyReadable'
import { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { DanbooruTags } from '../widgets/prompter/nodes/booru/BooruLoader'
import { Uploader } from './Uploader'

// prettier-ignore
type HoveredAsset =
    | { type: 'image'; url: string }
    | { type: 'video'; url: string }

export class STATE {
    //file utils that need to be setup first because
    resolveFromRoot = (relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(this.rootPath, relativePath))
    resolve = (from: AbsolutePath, relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(from, relativePath))
    theme: ThemeManager
    layout: CushyLayoutManager
    uid = nanoid() // front uid to fix hot reload
    db: LiveDB // core data
    shortcuts: ShortcutWatcher
    uploader: Uploader

    liveTime: number = (() => {
        const store = this.hotReloadPersistentCache
        if (store.liveTimeInterval != null) clearInterval(store.liveTimeInterval)
        store.liveTimeInterval = setInterval(() => {
            const now = Date.now()
            // console.log(`time is now ${now}`)
            this.liveTime = Math.round(now / 1000)
        }, 1000)
        return Date.now()
    })()

    /**
     * global hotReload persistent cache that should survive hot reload
     * useful to ensure various singleton stuff (e.g. dbHealth)
     */
    get hotReloadPersistentCache(): { [key: string]: any } {
        const globalRef = globalThis as any
        if (globalRef.__hotReloadPersistentCache == null) globalRef.__hotReloadPersistentCache = {}
        return globalRef.__hotReloadPersistentCache
    }

    // main state api
    schema: SchemaL
    comfySessionId = 'temp' /** send by ComfyUI server */

    // paths
    cacheFolderPath: AbsolutePath
    comfyJSONPath: AbsolutePath
    embeddingsPath: AbsolutePath
    nodesTSPath: AbsolutePath
    actionsFolderPathAbs: AbsolutePath
    actionsFolderPathRel: RelativePath
    outputFolderPath: AbsolutePath
    status: ComfyStatus | null = null
    graphHovered: Maybe<{ graph: GraphL; pctTop: number; pctLeft: number }> = null
    sid: Maybe<string> = null
    comfyStatus: Maybe<ComfyStatus> = null
    cushyStatus: Maybe<FromExtension_CushyStatus> = null
    configFile: JsonFile<ConfigFile>
    updater: GitManagedFolder
    hovered: Maybe<HoveredAsset> = null
    electronUtils: ElectronUtils
    library: Library
    schemaReady = new ManualPromise<true>()
    danbooru = DanbooruTags.build()
    userTags = UserTags.build()
    actionTags: ActionTagMethodList = []
    importer: ComfyImporter
    typecheckingConfig: JsonFile<TsConfigCustom>

    // showLatentPreviewInLastImagePanel
    get showLatentPreviewInLastImagePanel() { return this.configFile.value.showLatentPreviewInLastImagePanel ?? false } // prettier-ignore
    set showLatentPreviewInLastImagePanel(v: boolean) { this.configFile.update({ showLatentPreviewInLastImagePanel: v }) } // prettier-ignore

    // showPreviewInFullScreen
    get showPreviewInFullScreen() { return this.configFile.value.showPreviewInFullScreen ?? false } // prettier-ignore
    set showPreviewInFullScreen(v: boolean) { this.configFile.update({ showPreviewInFullScreen: v }) } // prettier-ignore

    // showPreviewInFullScreen
    get galleryHoverOpacity() { return this.configFile.value.galleryHoverOpacity ?? .9 } // prettier-ignore
    set galleryHoverOpacity(v: number) { this.configFile.update({ galleryHoverOpacity: v }) } // prettier-ignore

    // showPreviewInFullScreen
    get preferDenseForms() { return this.configFile.value.preferDenseForms ?? false } // prettier-ignore
    set preferDenseForms(v: boolean) { this.configFile.update({ preferDenseForms: v }) } // prettier-ignore

    // gallery size
    get gallerySizeStr() { return `${this.gallerySize}px` } // prettier-ignore
    set gallerySize(v: number) { this.configFile.update({ galleryImageSize: v }) } // prettier-ignore
    get gallerySize() { return this.configFile.value.galleryImageSize ?? 48 } // prettier-ignore

    //
    get githubUsername(): Maybe<GithubUserName> { return this.configFile.value.githubUsername as Maybe<GithubUserName> } // prettier-ignore
    get favoriteActions(): CardPath[] {
        return this.configFile.value.favoriteCards ?? []
    }

    showCardPicker: boolean = false
    closeCardPicker = () => (this.showCardPicker = false)
    openCardPicker = () => (this.showCardPicker = true)

    // 🔴 this is not the right way to go cause it will cause the action to stay
    // pending in the background: fix that LATER™️
    stopCurrentPrompt = async () => {
        const promptEndpoint = `${this.getServerHostHTTP()}/interrupt`
        const res = await fetch(promptEndpoint, { method: 'POST' })
        console.log('🔥 INTERRUPTED.')
    }

    getProject = (): ProjectL => {
        if (this.db.projects.size > 0) {
            return this.db.projects.firstOrCrash()
        }
        console.log(`[🛋️] creating project`)
        const initialGraph = this.db.graphs.create({ comfyPromptJSON: {} })
        const project = this.db.projects.create({
            // activeToolID: this.db.tools.values[0].id,
            rootGraphID: initialGraph.id,
            name: 'new project',
        })
        return project
        // const startDraft = initialGraph.createDraft()
    }

    _currentDraft: DraftL
    get currentDraft(): DraftL {
        return this._currentDraft
    }
    set currentDraft(draft: DraftL) {
        const card = draft.card
        card?.load()
        this.closeCardPicker()
        this._currentDraft = draft
    }
    // {
    //     cardPath: asCardPath('library/CushyStudio/default/prompt.ts'),
    // }

    // showAllMessageReceived: boolean = false // ❌ legacy
    comfyUIIframeRef = createRef<HTMLIFrameElement>()
    expandNodes: boolean = false

    /**  */
    updateTsConfig = () => {
        const finalInclude = ['src', 'schema/global.d.ts']
        if (this.githubUsername) finalInclude.push(`library/${this.githubUsername}/**/*`)
        if (this.githubUsername === 'rvion') finalInclude.push('library/CushyStudio/**/*')
        this.typecheckingConfig.update({ include: finalInclude })
    }

    constructor(
        /** path of the workspace */
        public rootPath: AbsolutePath,
    ) {
        console.log('[🗳️] starting web app')
        this.cacheFolderPath = this.resolve(this.rootPath, asRelativePath('outputs'))
        this.comfyJSONPath = this.resolve(this.rootPath, asRelativePath('schema/nodes.json'))
        this.embeddingsPath = this.resolve(this.rootPath, asRelativePath('schema/embeddings.json'))
        this.nodesTSPath = this.resolve(this.rootPath, asRelativePath('schema/global.d.ts'))
        this.outputFolderPath = this.cacheFolderPath // this.resolve(this.cacheFolderPath, asRelativePath('outputs'))

        this.actionsFolderPathRel = asRelativePath('library')
        this.actionsFolderPathAbs = this.resolve(this.rootPath, this.actionsFolderPathRel)

        // config files
        this.typecheckingConfig = mkTypescriptConfig()
        this.configFile = mkConfigFile()
        this.updateTsConfig()

        // core instances
        this.db = new LiveDB(this)
        this.schema = this.db.schema

        this.electronUtils = new ElectronUtils(this)
        this.shortcuts = new ShortcutWatcher(shortcutsDef, this, { log: true, name: nanoid() })
        this.uploader = new Uploader(this)
        this.layout = new CushyLayoutManager(this)
        this.theme = new ThemeManager(this)
        this.updater = new GitManagedFolder(this, {
            absFolderPath: this.rootPath,
            shouldAutoUpdate: true,
            runNpmInstallAfterUpdate: true,
            canBeUninstalled: false,
            githubURL: 'rvion/CushyStudio',
            repositoryName: 'CushyStudio' as GithubRepoName,
            userName: 'rvion' as GithubUserName,
            betaBranch: 'dev',
        })
        this.importer = new ComfyImporter(this)
        this.library = new Library(this)
        const defaultCard = this.library.getCardOrThrow(asCardPath('library/CushyStudio/default/prompt.ts'))
        this._currentDraft = defaultCard.getLastDraft()
        ;(async () => {
            await this.schemaReady
            const project = this.getProject()
        })()

        this.ws = this.initWebsocket()
        makeAutoObservable(this, { comfyUIIframeRef: false })
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
            onConnectOrReconnect: () => this.fetchAndUdpateSchema(),
            onMessage: this.onMessage,
            url: this.getWSUrl,
            onClose: () => {},
        })
    }

    _pendingMsgs = new Map<PromptID, PromptRelated_WsMsg[]>()
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
        receivedAt: Timestamp
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
                    this.preview = { blob: imageBlob, url: imagePreview, receivedAt: Date.now() }
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

    schemaRetrievalLogs: string[] = []
    /** retrieve the comfy spec from the schema*/
    fetchAndUdpateSchema = async (): Promise<ComfySchemaJSON> => {
        // 1. fetch schema$
        let schema$: ComfySchemaJSON
        this.schemaRetrievalLogs.splice(0, this.schemaRetrievalLogs.length)
        const progress = (...args: any[]) => {
            this.schemaRetrievalLogs.push(args.join(' '))
            console.info('[🐱] CONFY:', ...args)
        }
        try {
            // 1 ------------------------------------
            const headers: HeadersInit = { 'Content-Type': 'application/json' }
            const debugObjectInfosPath = 'schema/debug.json'
            const hasDebugObjectInfosJSON = existsSync(debugObjectInfosPath)
            if (hasDebugObjectInfosJSON) {
                progress('[.... step 1/4] using debug comfyJSONPath')
                const debugObjectInfosStr = readFileSync(debugObjectInfosPath, 'utf8')
                const debugObjectInfosJSON = JSON.parse(debugObjectInfosStr)
                schema$ = debugObjectInfosJSON
                progress('[*... step 1/4] schema fetched')
                const res = ComfySchemaJSON_zod.safeParse(schema$) //{ KSampler: schema$['KSampler'] })
                if (res.success) {
                    console.log('🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢 valid schema')
                } else {
                    console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 invalid schema')
                    const DEBUG_small = JSON.stringify(res.error.flatten(), null, 4)
                    writeFileSync('schema/debug.errors.json', DEBUG_small, 'utf-8')
                    const DEBUG_full = JSON.stringify(res.error, null, 4)
                    writeFileSync('schema/debug.errors-full.json', DEBUG_full, 'utf-8')
                    console.log(res.error.flatten())
                }
            } else {
                const object_info_url = `${this.getServerHostHTTP()}/object_info`
                progress(`[.... step 1/4] fetching schema from ${object_info_url} ...`)
                const object_info_res = await fetch(object_info_url, { method: 'GET', headers })
                const object_info_json = (await object_info_res.json()) as { [key: string]: any }
                writeFileSync(this.comfyJSONPath, JSON.stringify(object_info_json), 'utf-8')
                const knownNodeNames = Object.keys(object_info_json)
                progress(`[.... step 1/4] found ${knownNodeNames.length} nodes`) // (${JSON.stringify(keys)})
                schema$ = object_info_json as any
                progress('[*... step 1/4] schema fetched')
            }

            // 1 ------------------------------------
            const embeddings_url = `${this.getServerHostHTTP()}/embeddings`
            progress(`[.... step 1/4] fetching embeddings from ${embeddings_url} ...`)
            const embeddings_res = await fetch(embeddings_url, { method: 'GET', headers })
            const embeddings_json = (await embeddings_res.json()) as EmbeddingName[]
            writeFileSync(this.embeddingsPath, JSON.stringify(embeddings_json), 'utf-8')
            // const keys2 = Object.keys(data2)
            // console.info(`[.... step 1/4] found ${keys2.length} nodes`) // (${JSON.stringify(keys)})
            // schema$ = data as any
            progress(`${embeddings_json.length} embedings found:`, { embeddings_json })
            progress('[*... step x/4] embeddings fetched')

            // 2 ------------------------------------
            // http:
            progress('[*... step 2/4] updating schema...')
            const comfyJSONStr = readableStringify(schema$, 3)
            const comfyJSONBuffer = Buffer.from(comfyJSONStr, 'utf8')
            writeFileSync(this.comfyJSONPath, comfyJSONBuffer, 'utf-8')
            this.schema.update({ spec: schema$, embeddings: embeddings_json })

            const numNodesInSource = Object.keys(schema$).length
            const numNodesInSchema = this.schema.nodes.length
            if (numNodesInSource !== numNodesInSchema) {
                console.log(`🔴 ${numNodesInSource} != ${numNodesInSchema}`)
            }
            progress('[**.. step 2/4] schema updated')

            // 3 ------------------------------------
            progress('[**.. step 3/4] udpatin schema code...')
            const comfySchemaTs = this.schema.codegenDTS()
            progress('[***. step 3/4] schema code updated ')

            // 4 ------------------------------------
            progress('[**** step 4/4] saving schema')
            // const comfySchemaBuff = Buffer.from(comfySchemaTs, 'utf8')
            const comfySchemaTsFormatted = comfySchemaTs
            // console.log(this.nodesTSPath, comfySchemaTsFormatted)
            writeFileSync(this.nodesTSPath, comfySchemaTsFormatted, 'utf-8')
            progress('[**** step 4/4] 🟢 schema updated')
        } catch (error) {
            console.error(error)
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
    get imageToDisplay(): ImageL[] {
        const maxImages = this.configFile.value.galleryMaxImages ?? 50
        return this.db.images.values.slice(-maxImages).reverse()
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
    // ----------------------------
}
