import type { LiveInstance } from 'src/db/LiveInstance'
import { asComfySchemaID, type HostT } from 'src/db/TYPES.gen'
import type { ComfySchemaL, EmbeddingName } from './Schema'

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { ResilientWebSocketClient } from 'src/back/ResilientWebsocket'
import { extractErrorMessage } from 'src/utils/formatters/extractErrorMessage'
import { readableStringify } from 'src/utils/formatters/stringifyReadable'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { ManualPromise } from 'src/utils/misc/ManualPromise'

export interface HostL extends LiveInstance<HostT, HostL> {}

export class HostL {
    // INIT -----------------------------------------------------------------------------
    /** folder where file related to the host config will be cached */
    fileCacheFolder: AbsolutePath = null as any /**  'null' is here for a reason */
    comfyJSONPath: AbsolutePath = null as any /**  'null' is here for a reason */
    embeddingsPath: AbsolutePath = null as any /**  'null' is here for a reason */
    nodesTSPath: AbsolutePath = null as any /**  'null' is here for a reason */
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
        this.nodesTSPath = this.st.resolve(this.fileCacheFolder, asRelativePath(`sdk.dts.txt`))
        const associatedSchemaID = asComfySchemaID(this.id)
        this.schema = this.st.db.comfy_schemas.getOrCreate(associatedSchemaID, () => ({
            id: associatedSchemaID,
            embeddings: [],
            spec: {},
            hostID: this.id,
        }))
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

    CONNECT = () => {
        this.fetchAndUdpateSchema()
        if (this.data.isVirtual) return
        this.initWebsocket()
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

    isUpdatingSchema: boolean = false
    schemaUpdateResult: Maybe<{ type: 'success' } | { type: 'error'; error: any }> = null

    updateSchemaFromFileCache = () => {
        const object_info_json = this.st.readJSON<any>(this.comfyJSONPath)
        const embeddings_json = this.st.readJSON<any>(this.embeddingsPath)

        // update schema
        this.schema.update({ spec: object_info_json, embeddings: embeddings_json })
        this.schema.RUN_BASIC_CHECKS()

        // regen sdk
        const comfySchemaTs = this.schema.codegenDTS()
        writeFileSync(this.nodesTSPath, comfySchemaTs, 'utf-8')
    }

    /** retrieve the comfy spec from the schema*/
    fetchAndUdpateSchema = async (): Promise<void> => {
        try {
            // ------------------------------------------------------------------------------------
            if (this.data.isVirtual) {
                this.updateSchemaFromFileCache()
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
            const comfySchemaTs = this.schema.codegenDTS()
            writeFileSync(this.nodesTSPath, comfySchemaTs, 'utf-8')

            // debug for rvion
            if (this.st.githubUsername === 'rvion') {
                writeFileSync('tmp/docs/ex/a.md', '```ts\n' + comfySchemaTs + '\n```\n', 'utf-8')
                writeFileSync('tmp/docs/ex/b.md', '```json\n' + object_info_str + '\n```\n', 'utf-8')
            }
            this.isUpdatingSchema = false
            this.schemaUpdateResult = { type: 'success' }
        } catch (error) {
            this.isUpdatingSchema = false
            this.schemaUpdateResult = { type: 'error', error: error }

            console.error(error)
            console.error('🔴 FAILURE TO GENERATE nodes.d.ts', extractErrorMessage(error))

            const schemaExists = existsSync(this.nodesTSPath)
            if (!schemaExists) {
                const comfySchemaTs = this.schema.codegenDTS()
                writeFileSync(this.nodesTSPath, comfySchemaTs, 'utf-8')
            }
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
