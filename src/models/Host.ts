import type { LiveInstance } from 'src/db/LiveInstance'
import type { ComfySchemaL, EmbeddingName } from './Schema'

import https from 'https'

import { asComfySchemaID, type HostT } from 'src/db/TYPES.gen'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { ResilientWebSocketClient } from 'src/back/ResilientWebsocket'
import { extractErrorMessage } from 'src/utils/formatters/extractErrorMessage'
import { readableStringify } from 'src/utils/formatters/stringifyReadable'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { toastError, toastSuccess } from 'src/utils/misc/toasts'
import { downloadFile } from 'src/utils/fs/downloadFile'
export interface HostL extends LiveInstance<HostT, HostL> {}

export class HostL {
    // 🔶 can't move frame ref here because no way to override mobx
    // comfyUIIframeRef = createRef<HTMLIFrameElement>()

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
        this.schema = this.st.db.comfy_schemas.getOrCreate(associatedSchemaID, () => ({
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
    downloadFileIfMissing = async (url: string, to: AbsolutePath | string) => {
        if (this.data.isLocal) {
            // return await https.get(url, (res) => res.pipe(require('fs').createWriteStream(to)))
            return downloadFile(url, to)
        }
        //
        console.log(`[🔴] NOT IMPLEMENTED`)
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

    addLog = (...args: any[]) => {
        this.schemaRetrievalLogs.push(args.join(' '))
        console.info('[🐱] CONFY:', ...args)
    }

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
        // this.fetchAndUdpateSchema()
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

    initWebsocket = () => {
        console.log('[👢] WEBSOCKET: starting client to ComfyUI')
        this.ws = new ResilientWebSocketClient({
            onConnectOrReconnect: () => this.fetchAndUdpateSchema(),
            onMessage: this.st.onMessage,
            url: this.getWSUrl,
            onClose: () => {},
        })
        return this.ws
    }

    _isUpdatingSchema: boolean = false
    get isUpdatingSchema() { return this._isUpdatingSchema } // prettier-ignore
    set isUpdatingSchema(v: boolean) { this._isUpdatingSchema = v; } // prettier-ignore

    schemaUpdateResult: Maybe<{ type: 'success' } | { type: 'error'; error: any }> = null

    private updateSchemaFromFileCache = () => {
        const object_info_json = this.st.readJSON<any>(this.comfyJSONPath)
        const embeddings_json = this.st.readJSON<any>(this.embeddingsPath)

        // update schema
        this.schema.update({ spec: object_info_json, embeddings: embeddings_json })
        this.schema.RUN_BASIC_CHECKS()

        // regen sdk
        this.writeSDKToDisk()
    }

    /** retrieve the comfy spec from the schema*/
    fetchAndUdpateSchema = async (): Promise<void> => {
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
