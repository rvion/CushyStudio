import type { MediaImageL } from '../models/MediaImage'
import type { ComfyStatus, PromptID, PromptRelated_WsMsg, WsMsg } from '../types/ComfyWsApi'
import type { CSCriticalError } from '../widgets/CSCriticalError'

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { join } from 'pathe'
import { createRef } from 'react'
import { PreferedFormLayout, type ConfigFile } from 'src/config/ConfigFile'
import { mkConfigFile } from 'src/config/mkConfigFile'
import { mkTypescriptConfig, type TsConfigCustom } from '../widgets/TsConfigCustom'

import { closest } from 'fastest-levenshtein'
import { ShortcutWatcher } from 'src/app/shortcuts/ShortcutManager'
import { shortcutsDef } from 'src/app/shortcuts/shortcuts'
import type { ActionTagMethodList } from 'src/cards/Card'
import { asAppPath } from 'src/cards/CardPath'
import { GithubUserName } from 'src/cards/GithubUser'
import { Library } from 'src/cards/Library'
import { GithubRepoName } from 'src/cards/githubRepo'
import { ComfyHostDef, ComfyHostID, DEFAULT_COMFYUI_INSTANCE_ID, defaultHost } from 'src/config/ComfyHostDef'
import { DraftL } from 'src/models/Draft'
import { ProjectL } from 'src/models/Project'
import { StepL } from 'src/models/Step'
import { ThemeManager } from 'src/theme/ThemeManager'
import { CleanedEnumResult } from 'src/types/EnumUtils'
import { UserTags } from 'src/widgets/prompter/nodes/usertags/UserLoader'
import { ResilientWebSocketClient } from '../back/ResilientWebsocket'
import { JsonFile } from '../core/JsonFile'
import { LiveDB } from '../db/LiveDB'
import { ComfyImporter } from '../importers/ComfyImporter'
import { GraphL } from '../models/Graph'
import { EmbeddingName, EnumValue, SchemaL } from '../models/Schema'
import { CushyLayoutManager } from '../panels/router/Layout'
import { ComfySchemaJSON } from '../types/ComfySchemaJSON'
import { GitManagedFolder } from '../updater/updater'
import { ElectronUtils } from '../utils/electron/ElectronUtils'
import { extractErrorMessage } from '../utils/formatters/extractErrorMessage'
import { readableStringify } from '../utils/formatters/stringifyReadable'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { exhaust } from '../utils/misc/ComfyUtils'
import { ManualPromise } from '../utils/misc/ManualPromise'
import { DanbooruTags } from '../widgets/prompter/nodes/booru/BooruLoader'
import { Uploader } from './Uploader'
import { StepOutput } from 'src/types/StepOutput'

// prettier-ignore
type HoveredAsset = StepOutput

export class STATE {
    /** hack to help closing prompt completions */
    currentPromptFocused: Maybe<HTMLDivElement> = null

    __TEMPT__maxStepsToShow = 30

    //file utils that need to be setup first because
    resolveFromRoot = (relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(this.rootPath, relativePath))
    resolve = (from: AbsolutePath, relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(from, relativePath))
    themeMgr: ThemeManager
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

    restart = () => {
        window.location.reload()
    }

    fullReset_eraseConfigAndSchemaFilesAndDB = () => {
        this.configFile.erase()
        this.typecheckingConfig.erase()
        this.db.erase()
        this.restart()
    }

    partialReset_eraseConfigAndSchemaFiles = () => {
        this.configFile.erase()
        this.typecheckingConfig.erase()
        this.restart()
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
    get preferedFormLayout() { return this.configFile.value.preferedFormLayout ?? 'auto' } // prettier-ignore
    set preferedFormLayout(v: PreferedFormLayout) { this.configFile.update({ preferedFormLayout: v }) } // prettier-ignore

    // gallery size
    get gallerySizeStr() { return `${this.gallerySize}px` } // prettier-ignore
    set gallerySize(v: number) { this.configFile.update({ galleryImageSize: v }) } // prettier-ignore
    get gallerySize() { return this.configFile.value.galleryImageSize ?? 48 } // prettier-ignore

    // history app size
    get historySizeStr() { return `${this.historySize}px` } // prettier-ignore
    set historySize(v: number) { this.configFile.update({ historyAppSize: v }) } // prettier-ignore
    get historySize() { return this.configFile.value.historyAppSize ?? 48 } // prettier-ignore

    // latent size pct
    get latentSizeStr() { return `${this.latentSize}%` } // prettier-ignore
    set latentSize(v: number) { this.configFile.update({ latentPreviewSize: v }) } // prettier-ignore
    get latentSize() { return this.configFile.value.latentPreviewSize ?? 25 } // prettier-ignore

    //
    get githubUsername(): Maybe<GithubUserName> { return this.configFile.value.githubUsername as Maybe<GithubUserName> } // prettier-ignore
    get favoriteActions(): AppPath[] { return this.configFile.value.favoriteCards ?? [] } // prettier-ignore

    getConfigValue = <K extends keyof ConfigFile>(k: K) => this.configFile.value[k]
    setConfigValue = <K extends keyof ConfigFile>(k: K, v: ConfigFile[K]) => this.configFile.update({ [k]: v })
    isConfigValueEq = <K extends keyof ConfigFile>(k: K, val: ConfigFile[K]) => this.configFile.value[k] === val

    get showPreviewInPanel() { return this.configFile.value.showPreviewInPanel ?? true } // prettier-ignore
    set showPreviewInPanel(v: boolean) { this.configFile.update({ showPreviewInPanel: v }) } // prettier-ignore

    droppedFiles: File[] = []

    // showCardPicker: boolean = false
    closeFullLibrary = () => (this.layout.fullPageComp = null)
    openFullLibrary = () => (this.layout.fullPageComp = { props: {}, panel: 'CardPicker3UI' })
    toggleFullLibrary = () => {
        if (
            this.layout.fullPageComp == null || //
            this.layout.fullPageComp.panel !== 'CardPicker3UI'
        ) {
            this.layout.fullPageComp = { props: {}, panel: 'CardPicker3UI' }
        } else {
            this.layout.fullPageComp = null
        }
    }

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
            // 🔴 insert statement must be dynamic
            currentApp: null,
            currentDraftID: null,
        })
        return project
        // const startDraft = initialGraph.createDraft()
    }

    _currentDraft: DraftL
    get currentDraft(): DraftL {
        return this._currentDraft
    }
    set currentDraft(draft: DraftL) {
        const card = draft.app
        card?.load()
        this.closeFullLibrary()
        this._currentDraft = draft
    }
    // {
    //     cardPath: asCardPath('library/CushyStudio/default/prompt.ts'),
    // }

    fixEnumValue = (
        //
        candidateValue: Maybe<EnumValue>,
        enumName: string,
        isOptional: boolean,
    ): CleanedEnumResult<any> => {
        // 0. retrieve enum dev
        const possibleValues = this.schema.knownEnumsByName.get(enumName)?.values ?? []

        // 1. when enum is empty
        if (possibleValues.length == 0) {
            if (isOptional) return { finalValue: null, isSubstitute: candidateValue != null, candidateValue }
            return {
                finalValue: candidateValue ?? '❌ no value',
                ENUM_HAS_NO_VALUES: true,
                isSubstitute: candidateValue != null,
                candidateValue,
            }
        }

        // 2. when value is null
        if (candidateValue == null) {
            if (isOptional) return { finalValue: null, isSubstitute: false, candidateValue }
            return { finalValue: possibleValues[0], isSubstitute: true, candidateValue }
        }

        // 3. when value is correct
        if (possibleValues.includes(candidateValue as any))
            return { finalValue: candidateValue, isSubstitute: false, candidateValue }

        // 4. when value is incorrect
        const possibleValuesStr = possibleValues.map((v) => v.toString())
        const closestMatch = closest(candidateValue.toString(), possibleValuesStr)
        const ix = possibleValuesStr.indexOf(closestMatch)
        if (ix === -1) throw new Error(`❌ THE IMPOSSIBLE HAPPENED IN 'FixEnumValue'`)
        return { finalValue: possibleValues[ix], isSubstitute: true, candidateValue }
    }

    comfyUIIframeRef = createRef<HTMLIFrameElement>()
    expandNodes: boolean = false

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
        console.log('[🛋️] starting Cushy')
        this.cacheFolderPath = this.resolve(this.rootPath, asRelativePath('outputs'))
        this.comfyJSONPath = this.resolve(this.rootPath, asRelativePath('schema/object_info.json'))
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
        this.shortcuts = new ShortcutWatcher(shortcutsDef, this, { name: nanoid() })
        console.log(`[🛋️] ${this.shortcuts.shortcuts.length} shortcuts loaded`)
        this.uploader = new Uploader(this)
        this.layout = new CushyLayoutManager(this)
        this.themeMgr = new ThemeManager(this)
        this.updater = new GitManagedFolder(this, {
            absFolderPath: this.rootPath,
            shouldAutoUpdate: true,
            runNpmInstallAfterUpdate: true,
            canBeUninstalled: false,
            gitURLToFetchUpdatesFrom: 'rvion/CushyStudio',
            repositoryName: 'CushyStudio' as GithubRepoName,
            userName: 'rvion' as GithubUserName,
            betaBranch: 'dev',
        })
        this.importer = new ComfyImporter(this)
        this.library = new Library(this)
        const defaultCard = this.library.getFileOrThrow(asAppPath('library/CushyStudio/default/prompt.ts'))
        this._currentDraft = defaultCard.getLastDraft()
        ;(async () => {
            await this.schemaReady
            const project = this.getProject()
        })()

        this.ws = this.initWebsocket()
        makeAutoObservable(this, { comfyUIIframeRef: false })
    }

    get mainComfyHostID(): ComfyHostID {
        return (
            this.configFile.value.mainComfyHostID ?? //
            DEFAULT_COMFYUI_INSTANCE_ID
        )
    }

    get mainComfyHost(): ComfyHostDef {
        const selectedHost = this.configFile.value.comfyUIHosts?.find((h) => h.id === this.mainComfyHostID)
        return selectedHost ?? defaultHost
    }

    /**
     * will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server
     * */
    ws: ResilientWebSocketClient
    getServerHostHTTP(): string {
        const method = this.mainComfyHost.useHttps ? 'https' : 'http'
        const host = this.mainComfyHost.hostname
        const port = this.mainComfyHost.port
        return `${method}://${host}:${port}`
    }
    getWSUrl = (): string => {
        const method = this.mainComfyHost.useHttps ? 'wss' : 'ws'
        const host = this.mainComfyHost.hostname
        const port = this.mainComfyHost.port
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
        const prompt = this.db.comfy_prompts.get(prompt_id)

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

    latentPreview: Maybe<{
        receivedAt: Timestamp
        blob: Blob
        url: string
    }> = null
    onMessage = (e: MessageEvent) => {
        if (e.data instanceof ArrayBuffer) {
            // 🔴 console.log('[👢] WEBSOCKET: received ArrayBuffer', e.data)
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
                    this.latentPreview = { blob: imageBlob, url: imagePreview, receivedAt: Date.now() }
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
        // 🔴 console.info(`[👢] WEBSOCKET: received ${e.data}`)
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
    fetchAndUdpateSchema = async (): Promise<void> => {
        // 1. fetch schema$
        let object_info_json: ComfySchemaJSON = this.schema.data.spec

        this.schemaRetrievalLogs.splice(0, this.schemaRetrievalLogs.length)
        const addLog = (...args: any[]) => {
            this.schemaRetrievalLogs.push(args.join(' '))
            console.info('[🐱] CONFY:', ...args)
        }
        try {
            // 1 ------------------------------------
            // download object_info
            const headers: HeadersInit = { 'Content-Type': 'application/json' }
            const object_info_url = `${this.getServerHostHTTP()}/object_info`
            const object_info_res = await fetch(object_info_url, { method: 'GET', headers })
            const object_info_json = (await object_info_res.json()) as { [key: string]: any }
            const object_info_str = readableStringify(object_info_json, 4)
            writeFileSync(this.comfyJSONPath, object_info_str, 'utf-8')

            // 2 ------------------------------------
            // download embeddigns
            const embeddings_url = `${this.getServerHostHTTP()}/embeddings`
            const embeddings_res = await fetch(embeddings_url, { method: 'GET', headers })
            const embeddings_json = (await embeddings_res.json()) as EmbeddingName[]
            writeFileSync(this.embeddingsPath, JSON.stringify(embeddings_json), 'utf-8')

            // 3 ------------------------------------
            // update schema
            this.schema.update({ spec: object_info_json, embeddings: embeddings_json })
            this.schema.RUN_BASIC_CHECKS()

            // 3 ------------------------------------
            // regen sdk
            const comfySchemaTs = this.schema.codegenDTS()
            writeFileSync(this.nodesTSPath, comfySchemaTs, 'utf-8')

            // debug for rvion
            if (this.githubUsername === 'rvion') {
                writeFileSync('docs/ex/a.md', '```ts\n' + comfySchemaTs + '\n```\n', 'utf-8')
                writeFileSync('docs/ex/b.md', '```json\n' + object_info_str + '\n```\n', 'utf-8')
            }
        } catch (error) {
            console.error(error)
            console.error('🔴 FAILURE TO GENERATE nodes.d.ts', extractErrorMessage(error))

            const schemaExists = existsSync(this.nodesTSPath)
            if (!schemaExists) {
                const comfySchemaTs = this.schema.codegenDTS()
                writeFileSync(this.nodesTSPath, comfySchemaTs, 'utf-8')
            }
        }

        this.schemaReady.resolve(true)

        // this.objectInfoFile.update(schema$)
        // this.comfySDKFile.updateFromCodegen(comfySdkCode)
        // this.comfySDKFile.syncWithDiskFile()

        // const debugObjectInfosPath = 'schema/debug.json'
        // const hasDebugObjectInfosJSON = existsSync(debugObjectInfosPath)
        // if (hasDebugObjectInfosJSON) {
        //     const debugObjectInfosStr = readFileSync(debugObjectInfosPath, 'utf8')
        //     const debugObjectInfosJSON = JSON.parse(debugObjectInfosStr)
        //     schema$ = debugObjectInfosJSON
        //     const res = ComfySchemaJSON_zod.safeParse(schema$) //{ KSampler: schema$['KSampler'] })
        //     if (res.success) {
        //         console.log('🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢 valid schema')
        //     } else {
        //         console.log('🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 invalid schema')
        //         const DEBUG_small = JSON.stringify(res.error.flatten(), null, 4)
        //         writeFileSync('schema/debug.errors.json', DEBUG_small, 'utf-8')
        //         const DEBUG_full = JSON.stringify(res.error, null, 4)
        //         writeFileSync('schema/debug.errors-full.json', DEBUG_full, 'utf-8')
        //         console.log(res.error.flatten())
        //     }
        // } else {
        // }
    }

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    focusedStepID: Maybe<StepID> = null
    get focusedStepL(): Maybe<StepL> {
        if (this.focusedStepID) return this.db.steps.get(this.focusedStepID) ?? this.db.steps.last()
        return this.db.steps.last()
    }

    graph: Maybe<GraphL> = null
    // images: ImageT[] = []
    // imagesById: Map<ImageID, ImageT> = new Map()
    get imageToDisplay(): MediaImageL[] {
        const maxImages = this.configFile.value.galleryMaxImages ?? 20
        return this.db.media_images.getLastN(maxImages)
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
