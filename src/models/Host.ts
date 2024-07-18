import type { LiveInstance } from '../db/LiveInstance'
import type { PluginInfo } from '../manager/custom-node-list/custom-node-list-types'
import type { KnownCustomNode_File } from '../manager/custom-node-list/KnownCustomNode_File'
import type { KnownCustomNode_Title } from '../manager/custom-node-list/KnownCustomNode_Title'
import type { Requirements } from '../manager/REQUIREMENTS/Requirements'
import type { ComfySchemaL, EmbeddingName } from './ComfySchema'

import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'

import { ResilientWebSocketClient } from '../back/ResilientWebsocket'
import { extractErrorMessage } from '../csuite/formatters/extractErrorMessage'
import { readableStringify } from '../csuite/formatters/stringifyReadable'
import { toastError, toastSuccess } from '../csuite/utils/toasts'
import { asComfySchemaID, type TABLES } from '../db/TYPES.gen'
import { ComfyManager } from '../manager/ComfyManager'
import { downloadFile } from '../utils/fs/downloadFile'
import { asRelativePath } from '../utils/fs/pathUtils'

export interface HostL extends LiveInstance<TABLES['host']> {}

export class HostL {
    // 🔶 can't move frame ref here because no way to override mobx
    // comfyUIIframeRef = createRef<HTMLIFrameElement>()

    matchRequirements = (requirements: Requirements[]): boolean => {
        const manager = this.manager
        const repo = manager.repository
        for (const req of requirements) {
            if (req.optional) continue
            if (req.type === 'customNodesByNameInCushy') {
                const plugins: PluginInfo[] = repo.plugins_byNodeNameInCushy.get(req.nodeName) ?? []
                if (!plugins.find((i) => this.manager.isPluginInstalled(i.title))) {
                    // console.log(`[❌ A] ${JSON.stringify(req)} NOT MATCHED`)
                    return false
                }
            } else if (req.type === 'customNodesByTitle') {
                const plugin: PluginInfo | undefined = repo.plugins_byTitle.get(req.title)
                if (plugin == null) continue
                if (!this.manager.isPluginInstalled(plugin.title)) {
                    // console.log(`[❌ B] ${JSON.stringify(req)} NOT MATCHED`)
                    return false
                }
            } else if (req.type === 'customNodesByURI') {
                const plugin: PluginInfo | undefined = repo.plugins_byFile.get(req.uri)
                if (plugin == null) continue
                if (!this.manager.isPluginInstalled(plugin.title)) {
                    // console.log(`[❌ C] ${JSON.stringify(req)} NOT MATCHED`)
                    return false
                }
            } else if (req.type === 'modelInManager') {
                if (!this.manager.isModelInstalled(req.modelName)) {
                    // console.log(`[❌ D] ${JSON.stringify(req)} NOT MATCHED`)
                    return false
                }
            } else {
                // exhaust(req.type)
            }
        }
        return true
    }

    // Rotating srever logs --------------------------------------------
    private wantLog: boolean = true
    enableServerLogs(): Promise<any> {
        this.wantLog = true
        return this.manager.configureLogging(this.wantLog)
    }
    disableServerLogs = () => {
        this.wantLog = false
        return this.manager.configureLogging(this.wantLog)
    }
    toggleServerLogs = () => {
        this.wantLog = !this.wantLog
        return this.manager.configureLogging(this.wantLog)
    }
    maxLogs = 200
    serverLogs: { at: string; content: string; id: number }[] = []
    logId: number = 0
    addLog = (content: string) => {
        if (this.serverLogs.length > this.maxLogs) this.serverLogs.shift()
        const d = new Date().toISOString().slice(11, 19)
        this.serverLogs.push({ content, id: this.logId++, at: d })
    }

    get isReadonly(): boolean {
        return this.data.isReadonly ? true : false
    }

    /** root install of ComfyUI on the host filesystem */
    get absolutePathToComfyUI() {
        return this.data.absolutePathToComfyUI
    }

    /** prefered location to download models */
    get absolutPathToDownloadModelsTo() {
        return (
            this.data.absolutPathToDownloadModelsTo ?? //
            `${this.data.absolutePathToComfyUI}/models/checkpoints`
        )
    }

    observabilityConfig = {
        manager: false,
    }

    get manager() {
        const manager = new ComfyManager(this)
        Object.defineProperty(this, 'manager', { value: manager })
        return manager
    }

    // INIT -----------------------------------------------------------------------------
    /** folder where file related to the host config will be cached */
    fileCacheFolder: AbsolutePath = null as any /**  'null' is here for a reason */
    comfyJSONPath: AbsolutePath = null as any /**  'null' is here for a reason */
    embeddingsPath: AbsolutePath = null as any /**  'null' is here for a reason */
    sdkDTSPath: AbsolutePath = null as any /**  'null' is here for a reason */
    schema: ComfySchemaL = null as any /**  'null' is here for a reason */
    onHydrate = () => {
        this.fileCacheFolder = this.st.resolve(this.st.rootPath, asRelativePath(`schema/hosts/${this.id}`))
        const exists = existsSync(this.fileCacheFolder)
        if (!exists) {
            console.log('🟢 creating folder', this.fileCacheFolder)
            mkdirSync(this.fileCacheFolder)
        }
        this.comfyJSONPath = this.st.resolve(this.fileCacheFolder, asRelativePath(`object_info.json`))
        this.embeddingsPath = this.st.resolve(this.fileCacheFolder, asRelativePath(`embeddings.json`))
        this.sdkDTSPath = this.st.resolve(this.fileCacheFolder, asRelativePath(`sdk.dts.txt`))
        const associatedSchemaID = asComfySchemaID(this.id)
        this.schema = this.st.db.comfy_schema.getOrCreate(associatedSchemaID, () => ({
            id: associatedSchemaID,
            embeddings: [],
            spec: {},
            hostID: this.id,
        }))
    }

    electAsPrimary = (): void => {
        toastSuccess(`Primary host set to ${this.data.name}`)
        this.st.configFile.update({ mainComfyHostID: this.id })
        this._copyGeneratedSDKToGlobalDTS()
        this.CONNECT()
    }

    /**  */
    downloadFileIfMissing = async (url: string, to: AbsolutePath | string): Promise<true> => {
        const exists = existsSync(to)
        if (exists) return true
        if (this.data.isLocal) {
            // return await https.get(url, (res) => res.pipe(require('fs').createWriteStream(to)))
            return downloadFile(url, to)
        }
        //
        toastError(`[🔴] NOT IMPLEMENTED`)
        console.log(`[🔴] NOT IMPLEMENTED`)
        return true
    }

    restartComfyUI = async (): Promise<true> => {
        toastError(`[🔴] NOT IMPLEMENTED`)
        console.log(`[🔴] NOT IMPLEMENTED`)
        return true
    }

    installCustomNodeByFile = async (customNodeFile: KnownCustomNode_File) => {
        const manager = this.manager.repository
        const plugin: PluginInfo | undefined = manager.plugins_byFile.get(customNodeFile)
        if (plugin == null) throw new Error(`Unknown custom node for file: "${customNodeFile}"`)
        return this.manager.installPlugin(plugin)
    }

    installCustomNodeByTitle = async (customNodeTitle: KnownCustomNode_Title) => {
        const manager = this.manager.repository
        const plugin: PluginInfo | undefined = manager.plugins_byTitle.get(customNodeTitle)
        if (plugin == null) throw new Error(`Unknown custom node for title: "${customNodeTitle}"`)
        return this.manager.installPlugin(plugin)
    }

    installCustomNode = async (customNode: PluginInfo) => {
        return this.manager.installPlugin(customNode)
    }

    _copyGeneratedSDKToGlobalDTS = (): void => {
        const exists = existsSync(this.sdkDTSPath)
        if (!exists) return void toastError(`No SDK found for ${this.data.name}`)
        copyFileSync(this.sdkDTSPath, this.st.primarySdkDtsPath)
    }

    // URLS -----------------------------------------------------------------------------
    getServerHostHTTP(): string {
        const method = this.data.useHttps ? 'https' : 'http'
        const host = this.data.hostname
        const port = this.data.port
        return `${method}://${host}:${port}`
    }

    getWSUrl = (): string => {
        const method = this.data.useHttps ? 'wss' : 'ws'
        const host = this.data.hostname
        const port = this.data.port
        return `${method}://${host}:${port}/ws`
    }

    // LOGS -----------------------------------------------------------------------------
    schemaRetrievalLogs: string[] = []
    resetLog = () => {
        this.schemaRetrievalLogs.splice(0, this.schemaRetrievalLogs.length)
    }

    // addLog = (...args: any[]) => {
    //     this.schemaRetrievalLogs.push(args.join(' '))
    //     console.info('[🐱] CONFY:', ...args)
    // }

    // STARTING -----------------------------------------------------------------------------
    get isConnected() {
        return this.ws?.isOpen
    }

    // 🔶 TODO
    // 🔶 DISCONNECT = () => {
    // 🔶     this.ws?
    // 🔶 }

    CONNECT = () => {
        if (this.data.isVirtual) {
            this.updateSchemaFromFileCache()
        } else {
            this.initWebsocket()
        }
        // this.fetchAndUpdateSchema()
        if (this.data.isVirtual) return
    }

    get isPrimary(): boolean {
        return this.st.configFile.value.mainComfyHostID === this.id
    }

    private writeSDKToDisk = () => {
        const comfySchemaTs = this.schema.codegenDTS()
        writeFileSync(this.sdkDTSPath, comfySchemaTs, 'utf-8')
        if (this.isPrimary) writeFileSync(this.st.primarySdkDtsPath, comfySchemaTs, 'utf-8')
        // if (this.isPrimary) this._copyGeneratedSDKToGlobalDTS()
        if (this.st.githubUsername === 'rvion') {
            // prettier-ignore
            /* 💊 */ /* 💊 */ writeFileSync('tmp/docs/ex/a.md', '```ts\n' + comfySchemaTs + '\n```\n', 'utf-8')
            /* 💊 */ // writeFileSync('tmp/docs/ex/b.md', '```json\n' + object_info_str + '\n```\n', 'utf-8')
            /* 💊 */
        }
    }

    // WEBSCKET -----------------------------------------------------------------------------
    /**
     * will be created only after we've loaded cnfig file
     * so we don't attempt to connect to some default server
     * */
    ws: Maybe<ResilientWebSocketClient> = null

    private initWebsocket(): ResilientWebSocketClient {
        console.log(`[👢] WEBSOCKET: starting client to ComfyUI host ${this.data.name}`)
        this.ws = new ResilientWebSocketClient({
            onConnectOrReconnect: (): Promise<void> => this.fetchAndUpdateSchema(),
            onMessage: (e: MessageEvent): void => this.st.onMessage(e, this),
            url: this.getWSUrl,
            onClose: (): void => {},
        })
        return this.ws
    }

    _isUpdatingSchema: boolean = false
    get isUpdatingSchema() { return this._isUpdatingSchema } // prettier-ignore
    set isUpdatingSchema(v: boolean) { this._isUpdatingSchema = v; } // prettier-ignore

    schemaUpdateResult: Maybe<{ type: 'success' } | { type: 'error'; error: any }> = null

    private updateSchemaFromFileCache = () => {
        const object_info_json = this.st.readJSON_<any>(this.comfyJSONPath)
        const embeddings_json = this.st.readJSON_<any>(this.embeddingsPath)

        // update schema
        this.schema.update({ spec: object_info_json, embeddings: embeddings_json })
        this.schema.RUN_BASIC_CHECKS()

        // regen sdk
        this.writeSDKToDisk()
    }

    /** retrieve the comfy spec from the schema*/
    fetchAndUpdateSchema = async (): Promise<void> => {
        try {
            // ------------------------------------------------------------------------------------
            if (this.data.isVirtual) {
                // this.updateSchemaFromFileCache()
                return
            }
            this.isUpdatingSchema = true
            // ------------------------------------------------------------------------------------
            // 1. fetch schema$
            // let object_info_json: ComfySchemaJSON = this.schema.data.spec
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
            this.writeSDKToDisk()
            this.isUpdatingSchema = false
            this.schemaUpdateResult = { type: 'success' }
        } catch (error) {
            this.isUpdatingSchema = false
            this.schemaUpdateResult = { type: 'error', error: error }

            console.error(error)
            console.error('🔴 FAILURE TO GENERATE nodes.d.ts', extractErrorMessage(error))

            const schemaExists = existsSync(this.sdkDTSPath)
            if (!schemaExists) this.writeSDKToDisk()
        } finally {
            this.isUpdatingSchema = false
        }
    }
}

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
