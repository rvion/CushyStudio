import type { Wildcards } from 'src/widgets/prompter/nodes/wildcards/wildcards'
import type { MediaImageL } from '../models/MediaImage'
import type { ComfyStatus, PromptID, PromptRelated_WsMsg, WsMsg } from '../types/ComfyWsApi'
import type { CSCriticalError } from '../widgets/CSCriticalError'

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { join } from 'pathe'
import { createRef } from 'react'
import { PreferedFormLayout, type ConfigFile } from 'src/config/ConfigFile'
import { mkConfigFile } from 'src/config/mkConfigFile'
import { mandatoryTSConfigIncludes, mkTypescriptConfig, type TsConfigCustom } from '../widgets/TsConfigCustom'

import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js'
import { closest } from 'fastest-levenshtein'
import { ShortcutWatcher } from 'src/app/shortcuts/ShortcutManager'
import { shortcutsDef } from 'src/app/shortcuts/shortcuts'
import type { ActionTagMethodList } from 'src/cards/App'
import { GithubUserName } from 'src/cards/GithubUser'
import { Library } from 'src/cards/Library'
import { asAppPath } from 'src/cards/asAppPath'
import { GithubRepoName } from 'src/cards/githubRepo'
import { STANDARD_HOST_ID, vIRTUAL_HOST_ID__BASE, vIRTUAL_HOST_ID__FULL } from 'src/config/ComfyHostDef'
import { LiveCollection } from 'src/db/LiveCollection'
import { LiveFind } from 'src/db/LiveQuery'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'
import { DraftT, asHostID } from 'src/db/TYPES.gen'
import { DraftL } from 'src/models/Draft'
import { HostL } from 'src/models/Host'
import { ProjectL } from 'src/models/Project'
import { StepL } from 'src/models/Step'
import { Database } from 'src/supa/database.types'
import { ThemeManager } from 'src/theme/ThemeManager'
import { CleanedEnumResult } from 'src/types/EnumUtils'
import { StepOutput } from 'src/types/StepOutput'
import { UserTags } from 'src/widgets/prompter/nodes/usertags/UserLoader'
import { JsonFile } from '../core/JsonFile'
import { LiveDB } from '../db/LiveDB'
import { ComfyImporter } from '../importers/ComfyImporter'
import { ComfyWorkflowL } from '../models/ComfyWorkflow'
import { ComfySchemaL, EnumValue } from '../models/Schema'
import { CushyLayoutManager } from '../panels/router/Layout'
import { GitManagedFolder } from '../updater/updater'
import { ElectronUtils } from '../utils/electron/ElectronUtils'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { exhaust } from '../utils/misc/ComfyUtils'
import { DanbooruTags } from '../widgets/prompter/nodes/booru/BooruLoader'
import { AuthState } from './AuthState'
import { Uploader } from './Uploader'
import { mkSupa } from './supa'
import { SafetyChecker } from 'src/safety/Safety'

export class STATE {
    /** hack to help closing prompt completions */
    currentPromptFocused: Maybe<HTMLDivElement> = null

    __TEMPT__maxStepsToShow = 10

    //file utils that need to be setup first because
    resolveFromRoot = (relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(this.rootPath, relativePath))
    resolve = (from: AbsolutePath, relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(from, relativePath))
    themeMgr: ThemeManager
    layout: CushyLayoutManager
    uid = nanoid() // front uid to fix hot reload
    db: LiveDB // core data
    shortcuts: ShortcutWatcher
    uploader: Uploader

    supabase: SupabaseClient<Database>
    auth: AuthState

    _udpateTime = () => {
        const now = Date.now()
        // console.log(`time is now ${now}`)
        this.liveTime = Math.round(now / 1000)
    }

    /** mobx hack to make things refresh every few seconds */
    liveTime: number = (() => {
        const store = this.hotReloadPersistentCache
        if (store.liveTimeInterval != null) clearInterval(store.liveTimeInterval)
        store.liveTimeInterval = setInterval(() => this._udpateTime, 1000)
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

    get wildcards(): Wildcards {
        const wcdsPath = this.resolveFromRoot(asRelativePath('src/widgets/prompter/nodes/wildcards/wildcards.json'))
        const wcds = this.readJSON<Wildcards>(wcdsPath)
        Object.defineProperty(this, 'wildcards', { value: wcds })
        return wcds
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
    get schema(): ComfySchemaL {
        return this.mainHost.schema
    }

    comfySessionId = 'temp' /** send by ComfyUI server */

    // paths
    cacheFolderPath: AbsolutePath
    // comfyJSONPath: AbsolutePath
    // embeddingsPath: AbsolutePath

    libraryFolderPathAbs: AbsolutePath
    libraryFolderPathRel: RelativePath

    outputFolderPath: AbsolutePath
    status: ComfyStatus | null = null
    graphHovered: Maybe<{ graph: ComfyWorkflowL; pctTop: number; pctLeft: number }> = null
    sid: Maybe<string> = null
    comfyStatus: Maybe<ComfyStatus> = null
    configFile: JsonFile<ConfigFile>
    updater: GitManagedFolder
    hovered: Maybe<StepOutput> = null
    electronUtils: ElectronUtils
    library: Library
    danbooru = DanbooruTags.build()
    userTags = UserTags.build()
    actionTags: ActionTagMethodList = []
    importer: ComfyImporter
    typecheckingConfig: JsonFile<TsConfigCustom>

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
    get historySize() { return this.configFile.value.historyAppSize ?? 32 } // prettier-ignore

    // latent size pct
    get latentSizeStr() { return `${this.latentSize}%` } // prettier-ignore
    set latentSize(v: number) { this.configFile.update({ latentPreviewSize: v }) } // prettier-ignore
    get latentSize() { return this.configFile.value.latentPreviewSize ?? 25 } // prettier-ignore

    //
    get githubUsername(): Maybe<GithubUserName> { return this.configFile.value.githubUsername as Maybe<GithubUserName> } // prettier-ignore
    get favoriteApps(): CushyAppID[] { return this.configFile.value.favoriteApps ?? [] } // prettier-ignore

    getConfigValue = <K extends keyof ConfigFile>(k: K) => this.configFile.value[k]
    setConfigValue = <K extends keyof ConfigFile>(k: K, v: ConfigFile[K]) => this.configFile.update({ [k]: v })
    isConfigValueEq = <K extends keyof ConfigFile>(k: K, val: ConfigFile[K]) => this.configFile.value[k] === val

    get showPreviewInPanel() { return this.configFile.value.showPreviewInPanel ?? true } // prettier-ignore
    set showPreviewInPanel(v: boolean) { this.configFile.update({ showPreviewInPanel: v }) } // prettier-ignore

    droppedFiles: File[] = []

    _allPublishedApps: Maybe<PostgrestSingleResponse<Database['public']['Tables']['published_apps']['Row'][]>> = null
    fetchAllPublishedApps = async () => {
        const x = await this.supabase.from('published_apps').select('*')
        this._allPublishedApps = x
        return x
    }

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
        const initialGraph = this.db.graphs.create({ comfyPromptJSON: {}, metadata: {} })
        const defaultAppPath = asAppPath('library/CushyStudio/default/SDUI.ts')
        // const initialDraft = this.db.drafts.create({
        //     appParams: {},
        //     title: 'initial draft',
        //     appPath: defaultAppPath,
        //     isOpened: SQLITE_true,
        // })
        const project = this.db.projects.create({
            rootGraphID: initialGraph.id,
            name: 'new project',
            currentApp: defaultAppPath,
            filterNSFW: SQLITE_false,
            autostartDelay: 0,
            autostartMaxDelay: 100,
            // currentDraftID: initialDraft.id,
        })
        return project
    }

    safetyChecker = new SafetyChecker(this)
    draftsFolded = false

    allOpenDrafts = new LiveFind<DraftT, DraftL>({
        remoteTable: () => this.db.drafts,
        remoteQuery: () => ({ isOpened: SQLITE_true }),
    })

    get currentDraft(): Maybe<DraftL> {
        return this.project.draft.item
    }
    set currentDraft(draft: DraftL | null) {
        this.project.update({ currentDraftID: draft ? draft.id : draft })
        draft?.file?.load()
        this.closeFullLibrary()
    }

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
        console.log(`[🍻] FIXUP TSConfig`)
        const mandatory = mandatoryTSConfigIncludes
        if (this.configFile.value.enableTypeCheckingBuiltInApps) {
            mandatory.push('library/built-in')
            mandatory.push('library/sdk-examples')
        }
        const startTSConfig = this.typecheckingConfig.value
        const hasAllMandatoryIncludes = mandatory.every((mandatory) => startTSConfig.include.includes(mandatory))
        if (hasAllMandatoryIncludes) return // console.log(startTSConfig.include, mandatory)
        this.typecheckingConfig.update((x) => {
            const current = x.include
            for (const inc of mandatory) {
                if (current.includes(inc)) continue
                console.log(`[👙] adding`, inc)
                current.push(inc)
            }
        })
    }

    project: ProjectL
    primarySdkDtsPath: AbsolutePath
    constructor(
        /** path of the workspace */
        public rootPath: AbsolutePath,
    ) {
        console.log('[🛋️] starting Cushy')
        this.cacheFolderPath = this.resolve(this.rootPath, asRelativePath('outputs'))
        this.primarySdkDtsPath = this.resolve(this.rootPath, asRelativePath('schema/global.d.ts'))
        // this.comfyJSONPath = this.resolve(this.rootPath, asRelativePath('schema/object_info.json'))
        // this.embeddingsPath = this.resolve(this.rootPath, asRelativePath('schema/embeddings.json'))
        this.outputFolderPath = this.cacheFolderPath // this.resolve(this.cacheFolderPath, asRelativePath('outputs'))

        this.libraryFolderPathRel = asRelativePath('library')
        this.libraryFolderPathAbs = this.resolve(this.rootPath, this.libraryFolderPathRel)

        // config files
        this.typecheckingConfig = mkTypescriptConfig()
        this.configFile = mkConfigFile()
        this.updateTsConfig()

        // core instances
        this.db = new LiveDB(this)
        // this.schema = this.db.schema
        this.supabase = mkSupa()
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
        })
        this.importer = new ComfyImporter(this)
        this.library = new Library(this)
        this.project = this.getProject()
        this.auth = new AuthState(this)

        this.virtualHostBase // ensure getters are called at least once so we upsert the two core virtual hosts
        this.virtualHostFull // ensure getters are called at least once so we upsert the two core virtual hosts
        this.standardHost // ensure getters are called at least once so we upsert the two core virtual hosts

        this.mainHost.CONNECT()

        makeAutoObservable(this, {
            comfyUIIframeRef: false,
            wildcards: false,
        })
        ;(window as any).st = this
    }

    get mainComfyHostID(): HostID {
        return (
            this.configFile.value.mainComfyHostID ?? //
            vIRTUAL_HOST_ID__BASE
        )
    }

    get virtualHostBase(): HostL {
        return this.db.hosts.upsert({
            id: asHostID(vIRTUAL_HOST_ID__BASE),
            hostname: 'localhost',
            useHttps: SQLITE_false,
            port: 8188,
            name: 'virtual-ComfyUI-base',
            isLocal: SQLITE_true,
            isVirtual: SQLITE_true,
            isReadonly: SQLITE_true,
        })
    }

    get standardHost(): HostL {
        return this.db.hosts.upsert({
            id: asHostID(STANDARD_HOST_ID),
            hostname: 'localhost',
            useHttps: SQLITE_false,
            port: 8188,
            name: 'standard',
            isLocal: SQLITE_true,
            isVirtual: SQLITE_false,
            isReadonly: SQLITE_true,
        })
    }

    get virtualHostFull(): HostL {
        return this.db.hosts.upsert({
            id: asHostID(vIRTUAL_HOST_ID__FULL),
            hostname: 'localhost',
            useHttps: SQLITE_false,
            port: 8188,
            name: 'virtual-ComfyUI-full',
            isLocal: SQLITE_true,
            isVirtual: SQLITE_true,
            isReadonly: SQLITE_true,
        })
    }
    // ------------------------------------------------------------
    wipeOuputTopLevelImages = () => {
        const outputFolderPath = this.outputFolderPath
        const files = readdirSync(outputFolderPath)
        const confirm = window.confirm(`Are you sure you want to delete ${files.length} files in ${outputFolderPath}?`)
        if (!confirm) return
        for (const file of files) {
            if (!file.endsWith('.png')) continue
            const absPath = join(outputFolderPath, file)
            console.log(`[🧹] deleting ${absPath}`)
            rmSync(absPath)
            // fs.rmSync(absPath)
        }
    }
    // ------------------------------------------------------------
    /**
     * main host websocket
     * (exposed here for legacy reasons)
     * */
    get ws() {
        return this.mainHost.ws
    }

    hosts = new LiveCollection<HostL>({
        table: () => this.db.hosts,
        where: () => ({}),
    })

    /** main host */
    get mainHost(): HostL {
        const selectedHost = this.db.hosts.get(this.mainComfyHostID)
        return selectedHost ?? this.virtualHostBase
    }

    /** todo: rename */
    getServerHostHTTP(): string {
        return this.mainHost.getServerHostHTTP()
    }

    /** todo: rename */
    getWSUrl = (): string => {
        return this.mainHost.getServerHostHTTP()
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

    get schemaStatusEmoji() {
        if (this.schema.nodes.length > 10) return '🟢'
        return '🔴'
    }

    focusedStepOutput: Maybe<StepOutput> = null
    focusedStepID: Maybe<StepID> = null
    get focusedStepL(): Maybe<StepL> {
        if (this.focusedStepID) return this.db.steps.get(this.focusedStepID) ?? this.db.steps.last()
        return this.db.steps.last()
    }

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
