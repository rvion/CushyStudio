import type { ImageID, ImageT } from 'src/models/Image'
import type { ComfyStatus } from '../types/ComfyWsApi'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { startServerState } from '../back/main'
import { LiveDB } from '../db/LiveDB'
import { GraphL } from '../models/Graph'
import { ProjectL, asProjectID } from '../models/Project'
import { SchemaL } from '../models/Schema'
import { asStepID } from '../models/Step'
import { FromExtension_CushyStatus, MessageFromExtensionToWebview } from '../types/MessageFromExtensionToWebview'
import { Maybe } from '../utils/types'
import { UIAction } from './UIAction'
import { LightBoxState } from './ui/LightBox'

export type MsgGroup = {
    groupType: string
    messages: MessageFromExtensionToWebview[]
    uis: JSX.Element[]
    wrap: boolean
}

export class STATE {
    uid = nanoid()
    hovered: Maybe<ImageT> = null
    lightBox = new LightBoxState(() => this.images, true)

    serverState = startServerState()
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
    constructor() {
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
        makeAutoObservable(this)
        // window.addEventListener('message', this.onMessageFromExtension)
        // this.sendMessageToExtension({ type: 'say-ready', frontID: this.uid })
    }

    graph: Maybe<GraphL> = null
    // schema: Maybe<Schema> = null
    images: ImageT[] = []
    imagesById: Map<ImageID, ImageT> = new Map()
    get imageReversed() {
        return this.images.slice().reverse()
    }
    db = new LiveDB()
    get schema(): SchemaL {
        return this.db.schema
    }
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
    //         logger().debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
    //         return graph.onProgress(msg)
    //     }

    //     if (msg.type === 'executing') {
    //         if (graph == null) throw new Error('missing graph')
    //         this.XXXX.set(msg.uid, graph)
    //         if (msg.data.node == null) this.graph = null // done
    //         logger().debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
    //         return graph.onExecuting(msg)
    //     }

    //     if (msg.type === 'executed') {
    //         logger().info(`${msg.type} ${JSON.stringify(msg.data)}`)
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
