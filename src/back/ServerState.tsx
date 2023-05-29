// import type { EmbeddingName } from '../models/Schema'
// import type { ComfySchemaJSON } from '../types/ComfySchemaJSON'
// import type { Maybe } from '../utils/types'
// import type { ComfyStatus, WsMsg } from '../types/ComfyWsApi'

// import { LiveDB } from '../db/LiveDB'
// import { asAbsolutePath } from '../utils/fs/pathUtils'

// import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
// import { makeAutoObservable } from 'mobx'
// // import fetch from 'node-fetch'
// import { join, relative } from 'path'
// import { PayloadID } from 'src/core/PayloadID'
// import { logger } from '../logger/logger'
// import { ActionID, ActionL } from '../models/Action'
// import { PromptL } from '../models/Prompt'
// import { SchemaL } from '../models/Schema'
// import { MessageFromExtensionToWebview_ } from '../types/MessageFromExtensionToWebview'
// import { sdkStubDeps } from '../typings/sdkStubDeps'
// import { sdkTemplate } from '../typings/sdkTemplate'
// import { CodePrettier } from '../utils/CodeFormatter'
// import { extractErrorMessage } from '../utils/extractErrorMessage'
// import { AbsolutePath, RelativePath } from '../utils/fs/BrandedPaths'
// import { asRelativePath } from '../utils/fs/pathUtils'
// import { readableStringify } from '../utils/stringifyReadable'
// import { ConfigFileWatcher } from './ConfigWatcher'
// import { CushyFile } from './CushyFile'
// import { CushyFileWatcher } from './CushyFileWatcher'
// import { ResilientWebSocketClient } from './ResilientWebsocket'
// import { Runtime } from './Runtime'
// import { CushyServer } from './server'

// export class ServerState {
//     schema: SchemaL
//     comfySessionId = 'temp' /** send by ComfyUI server */
//     activePrompt: Maybe<PromptL> = null
//     runs: Runtime[] = []
//     cacheFolderPath: AbsolutePath
//     vscodeSettings: AbsolutePath
//     comfyJSONPath: AbsolutePath
//     embeddingsPath: AbsolutePath
//     nodesTSPath: AbsolutePath
//     cushyTSPath: AbsolutePath
//     tsConfigPath: AbsolutePath
//     outputFolderPath: AbsolutePath
//     knownActions = new Map<ActionID, ActionL>()
//     knownFiles = new Map<AbsolutePath, CushyFile>()

//     /** write a binary file to given absPath */
//     writeBinaryFile(absPath: AbsolutePath, content: Buffer) {
//         // ensure folder exists
//         const folder = join(absPath, '..')
//         mkdirSync(folder, { recursive: true })
//         writeFileSync(absPath, content)
//     }

//     /** read text file, optionally provide a default */
//     readJSON = <T extends any>(absPath: AbsolutePath, def?: T): T => {
//         console.log(absPath)
//         const exists = existsSync(absPath)
//         if (!exists) {
//             if (def != null) return def
//             throw new Error(`file does not exist ${absPath}`)
//         }
//         const str = readFileSync(absPath, 'utf8')
//         const json = JSON.parse(str)
//         return json
//     }

//     /** read text file, optionally provide a default */
//     readTextFile = (absPath: AbsolutePath, def: string): string => {
//         const exists = existsSync(absPath)
//         if (!exists) return def
//         const x = readFileSync(absPath)
//         const str = x.toString()
//         return str
//     }

//     writeTextFile(
//         //
//         absPath: AbsolutePath,
//         content: string,
//         open = false,
//     ) {
//         // ensure folder exists
//         const folder = join(absPath, '..')
//         mkdirSync(folder, { recursive: true })
//         writeFileSync(absPath, content, 'utf-8')
//     }

//     // flows = new Map<FlowID, Runtime>()
//     // getOrCreateFlow = (flowID: FlowID): Runtime => {
//     //     const prev = this.flows.get(flowID)
//     //     if (prev != null) return prev
//     //     console.log(`Creating new flow (id=${flowID})`)
//     //     const flow = new Runtime(this, flowID)
//     //     this.flows.set(flowID, flow)
//     //     return flow
//     // }
//     /** wrapper around vscode.tests.createTestController so logic is self-contained  */
//     // clients = new Map<string, CushyClient>()
//     // registerClient = (id: string, client: CushyClient) => this.clients.set(id, client)
//     // unregisterClient = (id: string) => this.clients.delete(id)

//     // lastMessagesPerType = new Map<MessageFromExtensionToWebview['type'], MessageFromExtensionToWebview>()

//     // persistMessageInHistoryIfNecessary = (message: MessageFromExtensionToWebview) => {
//     //     if (message.type === 'action-start') this.db.recordEvent(message)
//     //     if (message.type === 'images') this.db.recordEvent(message)
//     //     if (message.type === 'print') this.db.recordEvent(message)
//     //     if (message.type === 'prompt') this.db.recordEvent(message)
//     //     return
//     // }

//     broadCastToAllClients = (message_: MessageFromExtensionToWebview_): PayloadID => {
//         return '🔴 temp'
//         // this.db.config
//         //     const uid = getPayloadID()
//         //     const message: MessageFromExtensionToWebview = { ...message_, uid }
//         //     const clients = Array.from(this.clients.values())
//         //     this.lastMessagesPerType.set(message.type, message)
//         //     this.persistMessageInHistoryIfNecessary(message)
//         //     console.log(`sending message ${message.type} to ${clients.length} clients`)
//         //     for (const client of clients) client.sendMessage(message)
//         //     return uid
//     }

//     relative = (absolutePath: AbsolutePath): RelativePath => {
//         return asRelativePath(relative(this.rootPath, absolutePath))
//     }

//     resolveFromRoot = (relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(this.rootPath, relativePath))
//     resolve = (from: AbsolutePath, relativePath: RelativePath): AbsolutePath => asAbsolutePath(join(from, relativePath))
//     configWatcher = new ConfigFileWatcher()
//     codePrettier: CodePrettier
//     server!: CushyServer
//     db = new LiveDB()

//     constructor(
//         /** path of the workspace */
//         public rootPath: AbsolutePath,
//         public opts: {
//             /**
//              * if set, no stub will be generated
//              * if unset, will generate self-contained stubs
//              * */
//             cushySrcPathPrefix?: string
//             /**
//              * true in prod, false when running from this local subfolder
//              * */
//             genTsConfig: boolean
//             /** true in prod, false when running from this local subfolder */
//         },
//     ) {
//         console.log(`🔴 🔴`)
//         this.codePrettier = new CodePrettier(this)
//         this.cacheFolderPath = this.resolve(this.rootPath, asRelativePath('.cushy/cache'))
//         this.vscodeSettings = this.resolve(this.rootPath, asRelativePath('.vscode/settings.json'))
//         this.comfyJSONPath = this.resolve(this.rootPath, asRelativePath('.cushy/nodes.json'))
//         this.embeddingsPath = this.resolve(this.rootPath, asRelativePath('.cushy/embeddings.json'))
//         this.nodesTSPath = this.resolve(this.rootPath, asRelativePath('global.d.ts'))
//         this.cushyTSPath = this.resolve(this.rootPath, asRelativePath('.cushy/cushy.d.ts'))
//         this.tsConfigPath = this.resolve(this.rootPath, asRelativePath('tsconfig.json'))
//         this.outputFolderPath = this.resolve(this.cacheFolderPath, asRelativePath('outputs'))

//         // this.server = new CushyServer(this)
//         this.schema = this.db.schema
//         // this.restoreSchemaFromCache()

//         // gen files for standalone mode
//         if (opts.genTsConfig) this.createTSConfigIfMissing()
//         if (opts.cushySrcPathPrefix == null) this.writeTextFile(this.cushyTSPath, `${sdkTemplate}\n${sdkStubDeps}`)

//         this.tsFilesMap.walk(this.rootPath)

//         this.ws = this.initWebsocket()
//         // this.autoDiscoverEveryWorkflow()
//         makeAutoObservable(this)
//         // this.configWatcher.startWatching(this.resolveFromRoot(asRelativePath('cushyconfig.json')))
//     }
// }

// /** notify front of all new actions */
// // allActionsRefs = (): MessageFromExtensionToWebview & { type: 'ls' } => {
// //     const actionDefs: ActionDefinition[] = Array.from(this.knownActions.values())
// //     const actionRefs = actionDefs.map((a) => a.ref)
// //     return { type: 'ls', actions: actionRefs, uid: getPayloadID() }
// // }

// // broadcastNewActionList = () => {
// //     const refs = this.allActionsRefs()
// //     console.log(`🔴 ${refs}`)
// //     this.broadCastToAllClients(refs)
// // }

// // updateActionListDebounced = debounce(this.updateActionList, 1000, 2000)
