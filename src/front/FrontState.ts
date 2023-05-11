import type { ComfyStatus } from '../types/ComfyWsApi'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { ImageInfos } from '../core/GeneratedImageSummary'
import { WorkspaceHistoryJSON, newWorkspaceHistory } from '../core/WorkspaceHistoryJSON'
import { Graph } from '../core/Graph'
import { KnownWorkflow } from '../core/KnownWorkflow'
import { Schema } from '../core/Schema'
import { logger } from '../logger/logger'
import {
    FromExtension_CushyStatus,
    FromExtension_ask,
    MessageFromExtensionToWebview,
    MessageFromWebviewToExtension,
} from '../types/MessageFromExtensionToWebview'
import { renderMsgUI } from '../ui/flow/flowRenderer1'
import { exhaust } from '../utils/ComfyUtils'
import { Maybe } from '../utils/types'
import { ResilientSocketToExtension } from './ResilientCushySocket'
import { UIAction } from './UIAction'

export type MsgGroup = {
    groupType: string
    messages: MessageFromExtensionToWebview[]
    uis: JSX.Element[]
    wrap: boolean
}
const newMsgGroup = (groupType: string, wrap?: boolean): MsgGroup => ({
    groupType,
    messages: [],
    uis: [],
    wrap: wrap ?? false,
})

export class FrontState {
    uid = nanoid()

    get received(): MessageFromExtensionToWebview[] {
        return this.history.msgs.map((x) => x.msg)
    }

    expandNodes: boolean = false
    flowDirection: 'down' | 'up' = 'up'
    showAllMessageReceived: boolean = true

    currentAction: UIAction | null = null

    get itemsToShow() {
        // return this.received
        const max = 200
        const len = this.received.length
        const start = this.showAllMessageReceived ? 0 : Math.max(0, len - max)
        const items = this.received.slice(start)
        const ordered = this.flowDirection === 'up' ? items.reverse() : items
        return ordered
    }

    // group sequential items with similar types together
    get groupItemsToShow(): MsgGroup[] {
        const ordered = this.itemsToShow

        const grouped: MsgGroup[] = []
        let currentGroup: MsgGroup | null = null
        let currentType: string | null = null
        for (const item of ordered) {
            let x = renderMsgUI(item)
            if (x == null) continue
            let groupType = x.group ?? item.type
            // if (currentGroup == null) currentGroup = newMsgGroup(groupType, x.wrap)
            if (groupType !== currentType) {
                if (currentGroup?.messages.length) grouped.push(currentGroup)
                currentGroup = newMsgGroup(groupType, x.wrap)
                currentType = groupType
            }
            currentGroup!.messages.push(item)
            currentGroup!.uis.push(x.ui)
        }
        if (currentGroup?.messages.length) grouped.push(currentGroup)
        return grouped
    }

    activeTab: 'view' | 'segment' | 'import' | 'paint' = 'view'
    setActiveTab = (tab: 'view' | 'segment' | 'import' | 'paint') => {
        this.activeTab = tab
    }

    // this is the new way
    answerInfo = (value: any) => this.sendMessageToExtension({ type: 'answer', value })

    gallerySize: number = 256
    cushySocket: ResilientSocketToExtension
    constructor() {
        // if (typeof acquireVsCodeApi === 'function') this.vsCodeApi = acquireVsCodeApi()
        // console.log('a')
        this.cushySocket = new ResilientSocketToExtension({
            url: () => 'ws://localhost:8388',
            onConnectOrReconnect: () => {
                this.sendMessageToExtension({ type: 'say-ready', frontID: this.uid })
                // toaster.push('Connected to CushyStudio')
            },
            onMessage: (msg) => {
                // console.log('received', msg.data)
                const json = JSON.parse(msg.data)
                this.onMessageFromExtension(json)
            },
        })
        // console.log('b')

        makeAutoObservable(this)
        // window.addEventListener('message', this.onMessageFromExtension)
        // this.sendMessageToExtension({ type: 'say-ready', frontID: this.uid })
    }

    graph: Maybe<Graph> = null
    schema: Maybe<Schema> = null
    images: ImageInfos[] = []
    sid: Maybe<string> = null
    comfyStatus: Maybe<ComfyStatus> = null
    cushyStatus: Maybe<FromExtension_CushyStatus> = null
    knownWorkflows: KnownWorkflow[] = []
    selectedWorkflowID: Maybe<KnownWorkflow['id']> = null
    runningFlowId: Maybe<string> = null

    // runs: { flowRunId: string; graph: Graph }[]
    XXXX = new Map<MessageFromExtensionToWebview['uid'], Graph>()

    pendingAsk: FromExtension_ask[] = []

    history: WorkspaceHistoryJSON = newWorkspaceHistory()

    /** this is for the UI only; process should be very thin / small */
    onMessageFromExtension = (message: MessageFromExtensionToWebview) => {
        // 1. enqueue the message
        const msg: MessageFromExtensionToWebview =
            typeof message === 'string' //
                ? JSON.parse(message)
                : message

        // this message must not be logged
        if (msg.type === 'sync-history') {
            this.history = msg.history
            return
        }

        console.log('💬', msg.type) //, { message })

        this.history.msgs.push({ at: Date.now(), msg })

        // 2. process the info
        if (msg.type === 'flow-code') return
        if (msg.type === 'ask') {
            this.pendingAsk.push(msg)
            return
        }
        if (msg.type === 'show-html') return
        if (msg.type === 'print') return
        if (msg.type === 'flow-start') {
            this.runningFlowId = msg.flowRunID
            return
        }
        if (msg.type === 'flow-end') {
            this.runningFlowId = null
            return
        }

        if (msg.type === 'schema') {
            this.schema = new Schema(msg.schema, msg.embeddings)
            return
        }

        if (msg.type === 'status') {
            if (msg.data.sid) this.sid = msg.data.sid
            this.comfyStatus = msg.data.status
            return
        }
        if (msg.type === 'execution_cached') {
            // 🔴
            return
        }

        if (msg.type === 'prompt') {
            if (this.schema == null) throw new Error('missing schema')
            this.graph = new Graph(this.schema, msg.graph)
            return
        }

        if (msg.type === 'images') {
            this.images.push(...msg.images)
            return
        }

        if (msg.type === 'ls') {
            this.knownWorkflows = msg.knownFlows

            if (this.selectedWorkflowID == null && this.knownWorkflows.length > 0)
                this.selectedWorkflowID = this.knownWorkflows[0].id

            return
        }

        if (msg.type === 'cushy_status') {
            this.cushyStatus = msg
            return
        }

        const graph = this.graph
        if (graph == null) throw new Error('missing graph')

        // defer accumulation to ScriptStep_prompt
        if (msg.type === 'progress') {
            logger().debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            return graph.onProgress(msg)
        }

        if (msg.type === 'executing') {
            if (graph == null) throw new Error('missing graph')
            this.XXXX.set(msg.uid, graph)
            if (msg.data.node == null) this.graph = null // done
            logger().debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            return graph.onExecuting(msg)
        }

        if (msg.type === 'executed') {
            logger().info(`${msg.type} ${JSON.stringify(msg.data)}`)
            // return graph.onExecuted(msg)
            return
        }

        exhaust(msg)
    }

    /** Post a message (i.e. send arbitrary data) to the owner of the webview (the extension).
     * @remarks When running webview code inside a web browser, postMessage will instead log the given message to the console.
     */
    public sendMessageToExtension(message: MessageFromWebviewToExtension) {
        this.cushySocket.send(JSON.stringify(message))
        // else console.log(message)
    }
}
