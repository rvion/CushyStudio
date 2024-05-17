// VERY IMPORTANT: Dependency Injection for runtime
import '../models/asyncRuntimeStorage'

import type { ActionTagMethodList } from '../cards/App'
import type { FormSerial } from '../controls/FormSerial'
import type { MediaImageL } from '../models/MediaImage'
import type { TreeNode } from '../panels/libraryUI/tree/xxx/TreeNode'
import type { RevealState } from '../rsuite/reveal/RevealState'
import type { CSCriticalError } from '../widgets/CSCriticalError'
import type { Wildcards } from '../widgets/prompter/nodes/wildcards/wildcards'

import { SupabaseClient } from '@supabase/supabase-js'
import { closest } from 'fastest-levenshtein'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { makeAutoObservable, observable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { join } from 'pathe'
import { createRef } from 'react'
import { fromZodError } from 'zod-validation-error'

import { commandManager, type CommandManager } from '../app/shortcuts/CommandManager'
import { createRandomGenerator } from '../back/random'
import { asAppPath } from '../cards/asAppPath'
import { GithubRepoName } from '../cards/githubRepo'
import { GithubUserName } from '../cards/GithubUser'
import { Library } from '../cards/Library'
import { recursivelyFindAppsInFolder } from '../cards/walkLib'
import { STANDARD_HOST_ID, vIRTUAL_HOST_ID__BASE, vIRTUAL_HOST_ID__FULL } from '../config/ComfyHostDef'
import { type ConfigFile, PreferedFormLayout } from '../config/ConfigFile'
import { mkConfigFile } from '../config/mkConfigFile'
import { CushyFormManager } from '../controls/FormBuilder'
import { JsonFile } from '../core/JsonFile'
import { LiveDB } from '../db/LiveDB'
import { quickBench } from '../db/quickBench'
import { SQLITE_false, SQLITE_true } from '../db/SQLITE_boolean'
import { asHostID } from '../db/TYPES.gen'
import { ComfyImporter } from '../importers/ComfyImporter'
import { ComfyManagerRepository } from '../manager/ComfyManagerRepository'
import { ComfySchemaL, EnumValue } from '../models/ComfySchema'
import { ComfyWorkflowL } from '../models/ComfyWorkflow'
import { createMediaImage_fromPath } from '../models/createMediaImage_fromWebFile'
import { CushyAppL } from '../models/CushyApp'
import { DraftL } from '../models/Draft'
import { HostL } from '../models/Host'
import { ProjectL } from '../models/Project'
import { StepL } from '../models/Step'
import { regionMonitor, RegionMonitor } from '../operators/RegionMonitor'
import { TreeApp } from '../panels/libraryUI/tree/nodes/TreeApp'
import { TreeDraft } from '../panels/libraryUI/tree/nodes/TreeDraft'
import { TreeAllApps, TreeAllDrafts, TreeFavoriteApps, TreeFavoriteDrafts } from '../panels/libraryUI/tree/nodes/TreeFavorites'
import { TreeFolder } from '../panels/libraryUI/tree/nodes/TreeFolder'
import { treeElement } from '../panels/libraryUI/tree/TreeEntry'
import { Tree } from '../panels/libraryUI/tree/xxx/Tree'
import { TreeView } from '../panels/libraryUI/tree/xxx/TreeView'
import { VirtualHierarchy } from '../panels/libraryUI/VirtualHierarchy'
import { CushyLayoutManager } from '../panels/router/Layout'
// import { Header_Playground } from '../panels/Panel_Playground/Panel_Playground'
import { SafetyChecker } from '../safety/Safety'
import { Database } from '../supa/database.types'
import { ThemeManager } from '../theme/ThemeManager'
import { type ComfyStatus, type PromptID, type PromptRelated_WsMsg, type WsMsg, WsMsg$Schema } from '../types/ComfyWsApi'
import { CleanedEnumResult } from '../types/EnumUtils'
import { StepOutput } from '../types/StepOutput'
import { GitManagedFolder } from '../updater/updater'
import { ElectronUtils } from '../utils/electron/ElectronUtils'
import { SearchManager } from '../utils/electron/findInPage'
import { openInVSCode } from '../utils/electron/openInVsCode'
import { asAbsolutePath, asRelativePath } from '../utils/fs/pathUtils'
import { exhaust } from '../utils/misc/exhaust'
import { DanbooruTags } from '../widgets/prompter/nodes/booru/BooruLoader'
import { UserTags } from '../widgets/prompter/nodes/usertags/UserLoader'
import { mandatoryTSConfigIncludes, mkTypescriptConfig, type TsConfigCustom } from '../widgets/TsConfigCustom'
import { AuthState } from './AuthState'
import { readJSON, writeJSON } from './jsonUtils'
import { Marketplace } from './Marketplace'
import { mkSupa } from './supa'
import { Uploader } from './Uploader'

export class STATE {
    // LEAVE THIS AT THE TOP OF THIS CLASS
    __INJECTION__ = (() => {
        //  globally register the state as this
        if ((window as any).CushyObservableCache == null) {
            ;(window as any).CushyObservableCache = observable({ st: this })
            ;(window as any).st = this // <- remove this once window.st usage has been cleend
        } else {
            ;(window as any).CushyObservableCache.st = this
            ;(window as any).st = this // <- remove this once window.st usage has been cleend
        }
        if ((window as any).cushy == null) {
            console.log(`[🛋️] window.cushy now defined`)
            Object.defineProperty(window, 'cushy', { get() { return (window as any).CushyObservableCache.st } }) // prettier-ignore
        }
        if ((window as any).toJS == null) {
            ;(window as any).toJS = toJS
        }
    })()

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
    uploader: Uploader
    supabase: SupabaseClient<Database>
    auth: AuthState
    managerRepository = new ComfyManagerRepository({ check: false, genTypes: false })
    search: SearchManager = new SearchManager(this)
    forms: CushyFormManager = CushyFormManager
    commands: CommandManager = commandManager
    region: RegionMonitor = regionMonitor

    _updateTime = () => {
        const now = Date.now()
        // console.log(`time is now ${now}`)
        this.liveTime = Math.round(now / 1000)
    }

    /** mobx hack to make things refresh every few seconds */
    liveTime: number = (() => {
        const store = this.hotReloadPersistentCache
        if (store.liveTimeInterval != null) clearInterval(store.liveTimeInterval)
        store.liveTimeInterval = setInterval(() => this._updateTime, 1000)
        return Date.now()
    })()

    tree1: Tree
    tree1View: TreeView
    tree2: Tree
    tree2View: TreeView

    get clickAndSlideMultiplicator(): number {
        return cushy.configFile.get('numberSliderSpeed') ?? 1
    }

    startupFileIndexing = async () => {
        const allFiles = recursivelyFindAppsInFolder(this.library, this.libraryFolderPathAbs)
        console.log(`[🚧] startupFileIndexing: found ${allFiles.length} files`)
        for (const x of allFiles) await x.extractScriptFromFile()
    }

    forceRefreshAllApps = async () => {
        const allFiles = recursivelyFindAppsInFolder(this.library, this.libraryFolderPathAbs)
        console.log(`[🚧] forceRefreshAllApps: found ${allFiles.length} files`)
        for (const x of allFiles) await x.extractScriptFromFileAndUpdateApps({ force: true })
    }
    /**
     * global hotReload persistent cache that should survive hot reload
     * useful to ensure various singleton stuff (e.g. dbHealth)
     */
    get hotReloadPersistentCache(): { [key: string]: any } {
        const globalRef = globalThis as any
        if (globalRef.__hotReloadPersistentCache == null) globalRef.__hotReloadPersistentCache = {}
        return globalRef.__hotReloadPersistentCache
    }

    hasWildcard = (name: string): boolean => (this.wildcards as { [k: string]: any })[name] != null
    get wildcards(): Wildcards {
        const wcdsPath = this.resolveFromRoot(asRelativePath('src/widgets/prompter/nodes/wildcards/wildcards.json'))
        const wcds = this.readJSON_<Wildcards>(wcdsPath)
        Object.defineProperty(this, 'wildcards', { value: wcds })
        return wcds
    }

    get defaultImage(): MediaImageL {
        const def = this.db.media_image.select((t) => t.where('path', '=', 'public/CushyLogo-512.png').limit(1))
        // const def = this.db.media_images.find({ path: 'public/CushyLogo-512.png' }, { limit: 1 })
        if (def[0] == null) return createMediaImage_fromPath(this, 'public/CushyLogo-512.png')
        return def[0]
    }

    openInVSCode = (filePathWithinWorkspace: RelativePath) => {
        openInVSCode(this, filePathWithinWorkspace)
    }

    getKnownCheckpoints = () => this.managerRepository.getKnownCheckpoints()

    reloadCushyMainWindow = () => {
        window.location.reload()
    }

    fullReset_eraseConfigAndSchemaFilesAndDB = () => {
        this.configFile.erase()
        this.typecheckingConfig.erase()
        this.db.erase()
        this.reloadCushyMainWindow()
    }

    resizeWindowForVideoCapture = () => {
        const ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.send('resize-for-video-capture')
    }
    resizeWindowForLaptop = () => {
        const ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.send('resize-for-laptop')
    }

    partialReset_eraseConfigAndSchemaFiles = () => {
        this.configFile.erase()
        this.typecheckingConfig.erase()
        this.reloadCushyMainWindow()
    }

    // main state api
    get schema(): ComfySchemaL {
        return this.mainHost.schema
    }

    comfySessionId = 'temp' /** send by ComfyUI server */

    // paths
    cacheFolderPath: AbsolutePath

    /**
     * get the configured trigger words for the given lora
     * (those are user defined; hover your lora in any rich text prompt to edit them)
     */
    getLoraAssociatedTriggerWords = (loraName: string): Maybe<string> => {
        return this.configFile.value?.loraPrompts?.[loraName]?.text
    }

    /** helper to chose radomly any item from a list */
    chooseRandomly = <T>(key: string, seed: number, arr: T[]): T => {
        return createRandomGenerator(`${key}:${seed}`).randomItem(arr)!
    }

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
    danbooru: DanbooruTags
    userTags = UserTags.build()
    actionTags: ActionTagMethodList = []
    importer: ComfyImporter
    typecheckingConfig: JsonFile<TsConfigCustom>

    // showPreviewInFullScreen
    // get showPreviewInFullScreen() { return this.configFile.value.showPreviewInFullScreen ?? false } // prettier-ignore
    // set showPreviewInFullScreen(v: boolean) { this.configFile.update({ showPreviewInFullScreen: v }) } // prettier-ignore

    // get galleryHoverOpacity() { return this.configFile.value.galleryHoverOpacity ?? .9 } // prettier-ignore
    // set galleryHoverOpacity(v: number) { this.configFile.update({ galleryHoverOpacity: v }) } // prettier-ignore

    // gallery size
    get gallerySizeStr() { return `${this.gallerySize}px` } // prettier-ignore
    set gallerySize(v: number) { this.galleryConf.fields.gallerySize.value =  v } // prettier-ignore
    get gallerySize() { return this.galleryConf.root.get(`gallerySize`) ?? 48 } // prettier-ignore

    get preferedFormLayout() { return this.configFile.value.preferedFormLayout ?? 'auto' } // prettier-ignore
    set preferedFormLayout(v: PreferedFormLayout) { this.configFile.update({ preferedFormLayout: v }) } // prettier-ignore

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

    // ---------------------------------------------------
    get favoriteApps(): CushyAppL[] { return this.db.cushy_app.select((q) => q.where('isFavorite', '=', SQLITE_true), ['cushy_app.isFavorite']) } // prettier-ignore
    get favoriteDrafts(): DraftL[] { return this.db.draft.select((q) => q.where('isFavorite', '=', SQLITE_true), ['draft.isFavorite']) } // prettier-ignore
    get canvasTools(): DraftL[] { return this.db.draft.select((q) => q.where('canvasToolCategory', '!=', 'null'), ['draft.canvasToolCategory']) } // prettier-ignore
    getCanvasToolsInCategory = (category: string) =>
        this.db.draft.select((q) => q.where('canvasToolCategory', '=', category), ['draft.canvasToolCategory'])
    /** list of all unified canvas tool categories */
    get canvasCategories(): string[] {
        return this.db.draft
            .selectRaw((q) => q.select('canvasToolCategory').distinct(), ['draft.canvasToolCategory'])
            .map((x) => x.canvasToolCategory!)
            .filter(Boolean)
    }
    get allDrafts(): DraftL[] { return this.db.draft.select() } // prettier-ignore
    get allApps(): CushyAppL[] { return this.db.cushy_app.select() } // prettier-ignore
    get allImageApps(): CushyAppL[] { return this.db.cushy_app.select(q => q.where('canStartFromImage','=', SQLITE_true)) } // prettier-ignore

    virtualDraftHierarchy = new VirtualHierarchy(() => this.allDrafts)
    virtualAppHierarchy = new VirtualHierarchy(() => this.allApps)
    // ---------------------------------------------------
    // --------------------------------------------------

    getConfigValue = <K extends keyof ConfigFile>(k: K) => this.configFile.value[k]
    setConfigValue = <K extends keyof ConfigFile>(k: K, v: ConfigFile[K]) => this.configFile.update({ [k]: v })
    isConfigValueEq = <K extends keyof ConfigFile>(k: K, val: ConfigFile[K]) => this.configFile.value[k] === val

    get showPreviewInPanel() { return this.configFile.value.showPreviewInPanel ?? true } // prettier-ignore
    set showPreviewInPanel(v: boolean) { this.configFile.update({ showPreviewInPanel: v }) } // prettier-ignore

    droppedFiles: File[] = []

    // _allPublishedApps: Maybe<> = null

    // showCardPicker: boolean = false
    closeFullLibrary = () => (this.layout.fullPageComp = null)
    openFullLibrary = () => (this.layout.fullPageComp = { props: {}, panel: 'FullScreenLibrary' })
    toggleFullLibrary = () => {
        if (
            this.layout.fullPageComp == null || //
            this.layout.fullPageComp.panel !== 'FullScreenLibrary'
        ) {
            this.layout.fullPageComp = { props: {}, panel: 'FullScreenLibrary' }
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
        if (this.db.project.size > 0) {
            return this.db.project.firstOrCrash()
        }
        console.log(`[🛋️] creating project`)
        const initialGraph = this.db.comfy_workflow.create({ comfyPromptJSON: {}, metadata: {} })
        const defaultAppPath = asAppPath('library/CushyStudio/default/SDUI.ts')
        // const initialDraft = this.db.drafts.create({
        //     appParams: {},
        //     title: 'initial draft',
        //     appPath: defaultAppPath,
        //     isOpened: SQLITE_true,
        // })
        const project = this.db.project.create({
            rootGraphID: initialGraph.id,
            name: 'new project',
            currentApp: defaultAppPath,
            filterNSFW: SQLITE_false,
            autostartDelay: 0,
            autostartMaxDelay: 100,
        })
        return project
    }

    safetyChecker = new SafetyChecker(this)
    draftsFolded = false

    fixEnumValue = (
        //
        candidateValue: Maybe<EnumValue>,
        enumName: string,
    ): CleanedEnumResult<any> => {
        // 0. retrieve enum dev
        const possibleValues = this.schema.knownEnumsByName.get(enumName)?.values ?? []

        // 1. when enum is empty
        if (possibleValues.length == 0) {
            return {
                finalValue: candidateValue ?? '❌ no value',
                ENUM_HAS_NO_VALUES: true,
                isSubstitute: candidateValue != null,
                candidateValue,
            }
        }

        // 2. when value is null
        if (candidateValue == null) {
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

    showConfettiAndBringFun = async () => {
        const confetti = (await import('https://cdn.skypack.dev/canvas-confetti' as any)).default
        confetti()
    }

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

    get autolayoutOpts() {
        const fv = this.graphConf.value
        return { node_hsep: fv.hsep, node_vsep: fv.vsep }
    }
    graphConf = CushyFormManager.fields(
        (ui) => ({
            spline: ui.float({ min: 0.5, max: 4, default: 2 }),
            vsep: ui.int({ min: 0, max: 100, default: 20 }),
            hsep: ui.int({ min: 0, max: 100, default: 20 }),
        }),
        {
            name: 'Graph Visualisation',
            initialSerial: () => readJSON('settings/graph-visualization.json'),
            onSerialChange: (form) => writeJSON('settings/graph-visualization.json', form.serial),
        },
    )
    civitaiConf = CushyFormManager.fields(
        (ui) => ({
            imgSize1: ui.int({ min: 64, max: 1024, step: 64, default: 512 }),
            imgSize2: ui.int({ min: 64, max: 1024, step: 64, default: 128 }),
            apiKey: ui.string({ label: 'API Key' }),
            defaultQuery: ui.string({ label: '(debug) default query' }),
            // civitaiApiSecret: ui.string({ label: 'API Secret' }),
        }),
        {
            name: 'Civitai Conf',
            initialSerial: () => readJSON('settings/civitai.json'),
            onSerialChange: (form) => writeJSON('settings/civitai.json', form.serial),
        },
    )
    favbar = CushyFormManager.fields(
        (f) => ({
            size: f.int({ label: false, alignLabel: false, text: 'Size', min: 24, max: 128, default: 48, suffix: 'px', step: 4 }),
            visible: f.bool(),
            grayscale: f.boolean({ label: 'Grayscale' }),
            appIcons: f
                .int({
                    label: false,
                    alignLabel: false,
                    text: 'App Icons',
                    default: 100,
                    step: 10,
                    min: 1,
                    max: 100,
                    suffix: '%',
                })
                .optional(true),
        }),
        {
            name: 'SideBar Conf',
            initialSerial: () => readJSON('settings/sidebar.json'),
            onSerialChange: (form) => writeJSON('settings/sidebar.json', form.serial),
        },
    )

    /* TODO: This should be in a separate register_internal_forms file probably, along with any other headers we register in the future. After we can register them that is. */
    // playgroundHeader = Header_Playground
    // playgroundWidgetDisplay = FORM_PlaygroundWidgetDisplay

    displacementConf = CushyFormManager.fields(
        (form) => ({
            camera: form.choice({
                appearance: 'tab',
                items: { orbit: form.group(), fly: form.group({}) /* wasd:  form.group({}) */ },
            }),
            menu: form.choice({
                appearance: 'tab',
                items: { menu: form.group(), left: form.group(), right: form.group({}) },
            }),
            displacementScale: form.number({ label: 'displacement', min: 0, max: 5, step: 0.1, default: 1 }),
            cutout: form.number({ label: 'cutout', min: 0, max: 1, step: 0.01, default: 0.08 }),
            removeBackground: form.number({ label: 'remove bg', min: 0, max: 1, step: 0.01, default: 0.2 }),
            ambientLightIntensity: form.number({ label: 'light', min: 0, max: 8, default: 1.5 }),
            ambientLightColor: form.color({ label: 'light color' }),
            isSymmetric: form.boolean({ label: 'Symmetric Model' }),
            takeScreenshot: form.inlineRun({ label: 'Screenshot' }),
            metalness: form.float({ min: 0, max: 1 }),
            roughness: form.float({ min: 0, max: 1 }),
            skyBox: form.bool({}),
            ground: form.bool({}),
            usePoints: form.boolean({ label: 'Points', default: false }),
        }),
        {
            name: 'Displacement Conf',
            initialSerial: () => readJSON<FormSerial>('settings/displacement.json'),
            onSerialChange: (form) => writeJSON('settings/displacement.json', form.serial),
        },
    )

    galleryConf = CushyFormManager.fields(
        (f) => ({
            defaultSort: f.selectOneV2(['createdAt', 'updatedAt'] as const, {
                default: { id: 'createdAt', label: 'Created At' },
            }),
            gallerySize: f.int({ label: 'Preview Size', default: 48, min: 24, step: 8, softMax: 512, max: 1024, tooltip: 'Size of the preview images in px', unit: 'px' }), // prettier-ignore
            galleryMaxImages: f.int({ label: 'Number of items', min: 10, softMax: 300, default: 50, tooltip: 'Maximum number of images to display', }), // prettier-ignore
            galleryBgColor: f.color({ label: 'background' }),
            galleryHoverOpacity: f.number({ label: 'hover opacity', min: 0, max: 1, step: 0.01 }),
            showPreviewInFullScreen: f.boolean({ label: 'full-screen', tooltip: 'Show the preview in full screen' }),
            onlyShowBlurryThumbnails: f.boolean({
                alignLabel: false,
                text: 'Only Show Blurry Thumbnails',
                expand: true,
                display: 'button',
                icon: 'lock',
                label: false,
            }),
        }),
        {
            name: 'Gallery Conf',
            onSerialChange: (form) => writeJSON('settings/gallery.json', form.serial),
            initialSerial: () => readJSON('settings/gallery.json'),
        },
    )

    project: ProjectL
    primarySdkDtsPath: AbsolutePath
    marketplace: Marketplace
    constructor(
        /** path of the workspace */
        public rootPath: AbsolutePath,
    ) {
        // -----------------------------------------------------------
        // console.log('[🛋️] starting Cushy')
        this.cacheFolderPath = this.resolve(this.rootPath, asRelativePath('outputs'))
        this.primarySdkDtsPath = this.resolve(this.rootPath, asRelativePath('schema/global.d.ts'))
        this.outputFolderPath = this.cacheFolderPath // this.resolve(this.cacheFolderPath, asRelativePath('outputs'))
        this.libraryFolderPathRel = asRelativePath('library')
        this.libraryFolderPathAbs = this.resolve(this.rootPath, this.libraryFolderPathRel)

        // config files
        this.typecheckingConfig = mkTypescriptConfig()
        this.configFile = mkConfigFile()
        this.updateTsConfig()

        // core instances
        this.db = new LiveDB(this)
        this.supabase = mkSupa()
        this.marketplace = new Marketplace(this)
        this.electronUtils = new ElectronUtils(this)
        // this.shortcuts = new CommandManager(allCommands, this, { name: nanoid() })
        // console.log(`[🛋️] ${this.shortcuts.shortcuts.length} shortcuts loaded`)
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
        this.danbooru = DanbooruTags.build(this)

        this.virtualHostBase // ensure getters are called at least once so we upsert the two core virtual hosts
        this.virtualHostFull // ensure getters are called at least once so we upsert the two core virtual hosts
        this.standardHost // ensure getters are called at least once so we upsert the two core virtual hosts

        this.mainHost.CONNECT()
        this.tree1 = new Tree([
            //
            treeElement({ key: 'favorite-apps', ctor: TreeFavoriteApps, props: {} }),
            treeElement({ key: 'favorite-drafts', ctor: TreeFavoriteDrafts, props: {} }),
            treeElement({ key: 'all-drafts', ctor: TreeAllDrafts, props: {} }),
            treeElement({ key: 'all-apps', ctor: TreeAllApps, props: {} }),
            // '#apps',
        ])
        this.tree1View = new TreeView(this.tree1, {
            onFocusChange: (node?: TreeNode) => {
                if (node == null) return
                console.log(`[🌲] TreeView 1 selection changed to:`, node.path_v2)
                if (node.data instanceof TreeApp) return node.data.app?.revealInFileExplorer()
                if (node.data instanceof TreeDraft) return node.data.draft.revealInFileExplorer()
                return
            },
        })
        this.tree2 = new Tree([
            // treeElement({ key: 'library', ctor: TreeFolder, props: asRelativePath('library') }),
            treeElement({ key: 'built-in', ctor: TreeFolder, props: asRelativePath('library/built-in') }),
            treeElement({ key: 'local', ctor: TreeFolder, props: asRelativePath('library/local') }),
            treeElement({ key: 'sdk-examples', ctor: TreeFolder, props: asRelativePath('library/sdk-examples') }),
            treeElement({ key: 'installed', ctor: TreeFolder, props: asRelativePath('library/installed') }),
            //
            // 'path#library',
            // 'path#library/built-in',
            // 'path#library/local',
            // 'path#library/sdk-examples',
        ])
        this.tree2View = new TreeView(this.tree2, {
            onFocusChange: (node) => console.log(`[🌲] TreeView 2 selection changed to:`, node?.path_v2),
        })

        makeAutoObservable(this, {
            comfyUIIframeRef: false,
            wildcards: false,
        })
        this.startupFileIndexing()
        setTimeout(() => quickBench.printAllStats(), 1000)
    }

    get mainComfyHostID(): HostID {
        return (
            this.configFile.value.mainComfyHostID ?? //
            vIRTUAL_HOST_ID__BASE
        )
    }

    get virtualHostBase(): HostL {
        return this.db.host.upsert({
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
        return this.db.host.upsert({
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
        return this.db.host.upsert({
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

    get hosts() {
        return this.db.host.select()
    }

    /** main host */
    get mainHost(): HostL {
        const selectedHost = this.db.host.get(this.mainComfyHostID)
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
        const prompt = this.db.comfy_prompt.get(prompt_id)

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
        promtID: Maybe<PromptID>
        receivedAt: Timestamp
        blob: Blob
        url: string
    }> = null

    onMessage = (e: MessageEvent, host: HostL) => {
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
                    this.latentPreview = {
                        blob: imageBlob,
                        url: imagePreview,
                        receivedAt: Date.now(),
                        promtID: this.activePromptID,
                    }
                    break
                default:
                    throw new Error(`Unknown binary websocket message of type ${eventType}`)
            }
            return
        }
        // 🔴 console.info(`[👢] WEBSOCKET: received ${e.data}`)
        const msg: WsMsg = JSON.parse(e.data as any)

        const shouldCheckPAYLOADS = true
        if (shouldCheckPAYLOADS) {
            const match = WsMsg$Schema.safeParse(msg)
            if (!match.success) {
                console.log(`[🔴] /!\\ Websocket payload does not match schema.`)
                console.log('🔴 payload', msg)
                console.log('🔴error: ❌', fromZodError(match.error))
            }
        }

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

        if (msg.type === 'manager-terminal-feedback') {
            host.addLog(msg.data.data)
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
        if (this.focusedStepID) return this.db.step.get(this.focusedStepID) ?? this.db.step.last()
        return this.db.step.last()
    }

    // get imageToDisplayold(): MediaImageL[] {
    //     const maxImages = this.galleryConf.value.galleryMaxImages ?? 20
    //     // let query =
    //     // const stmt = this.db.db.prepare(`select * from media_image order by createdAt desc limit ? where tags like ?`)
    //     // this.db.prepareAll(this.infos, `select * from ${this.name} order by createdAt desc limit ?`)
    //     return this.db.media_images.getLastN(maxImages)
    // }

    galleryFilterPath: Maybe<string> = null
    galleryFilterTag: Maybe<string> = null
    galleryFilterAppName: Maybe<{ id: CushyAppID; name?: Maybe<string> }> = null
    get imageToDisplay() {
        const conf = this.galleryConf.value
        return this.db.media_image.select(
            (query) => {
                let x =
                    conf.defaultSort.id === 'createdAt'
                        ? query.orderBy('media_image.createdAt', 'desc')
                        : query.orderBy('media_image.updatedAt', 'desc')

                x = x.limit(this.galleryConf.value.galleryMaxImages ?? 20).select('media_image.id')

                if (this.galleryFilterPath) x = x.where('media_image.path', 'like', '%' + this.galleryFilterPath + '%')
                if (this.galleryFilterTag) x = x.where('media_image.tags', 'like', '%' + this.galleryFilterTag + '%')
                if (this.galleryFilterAppName) {
                    x = x
                        .innerJoin('step', 'media_image.stepID', 'step.id')
                        .innerJoin('cushy_app', 'cushy_app.id', 'step.appID')
                        .where('cushy_app.id', 'in', [this.galleryFilterAppName.id])
                }
                return x
            },
            ['media_image.id'],
        )
    }

    // FILESYSTEM UTILS --------------------------------------------------------------------
    /** write a binary file to given absPath */
    writeBinaryFile(absPath: AbsolutePath, content: Buffer) {
        // ensure folder exists
        const folder = join(absPath, '..')
        mkdirSync(folder, { recursive: true })
        writeFileSync(absPath, content)
    }

    readJSON = readJSON
    writeJSON = writeJSON
    /** read text file, optionally provide a default */
    readJSON_ = <T extends any>(absPath: AbsolutePath, def?: T): T => {
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
