import type { ComfyStatus } from '../core-types/ComfyWsPayloads'

import { Graph } from '../core-shared/Graph'
import { Schema } from '../core-shared/Schema'
import { makeAutoObservable } from 'mobx'
import { MessageFromExtensionToWebview, MessageFromWebviewToExtension } from '../core-types/MessageFromExtensionToWebview'
import { logger } from '../logger/logger'
import { exhaust } from '../utils/ComfyUtils'
import { Maybe } from '../utils/types'
import { ResilientSocketToExtension } from './ResilientCushySocket'
import { nanoid } from 'nanoid'
import { KnownWorkflow } from '../core-shared/KnownWorkflow'

export class FrontState {
    uid = nanoid()
    received: MessageFromExtensionToWebview[] = []

    flowDirection: 'down' | 'up' = 'up'
    showAllMessageReceived: boolean = false

    get itemsToShow() {
        const max = 100
        const len = this.received.length
        const start = this.showAllMessageReceived ? 0 : Math.max(0, len - max)
        const items = this.received.slice(start)
        return this.flowDirection === 'up' ? items.reverse() : items
    }

    showImageAs: 'grid' | 'list' | 'carousel' = 'list'
    activeTab: 'home' | 'news' | 'import' | 'about' = 'home'
    setActiveTab = (tab: 'home' | 'news' | 'import' | 'about') => {
        this.activeTab = tab
    }

    answerString = (value: string) => this.sendMessageToExtension({ type: 'answer-string', value })
    answerPaint = (base64Img: string) => this.sendMessageToExtension({ type: 'answer-paint', value: base64Img })
    answerBoolean = (value: boolean) => this.sendMessageToExtension({ type: 'answer-boolean', value })
    gallerySize: number = 100
    cushySocket: ResilientSocketToExtension
    constructor() {
        // if (typeof acquireVsCodeApi === 'function') this.vsCodeApi = acquireVsCodeApi()
        // console.log('a')
        this.cushySocket = new ResilientSocketToExtension({
            url: () => 'ws://localhost:8288',
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
    imageURLs: string[] = []
    sid: Maybe<string> = null
    status: Maybe<ComfyStatus> = null
    knownWorkflows: KnownWorkflow[] = []
    selectedWorkflowID: Maybe<KnownWorkflow['id']> = null
    runningFlowId: Maybe<string> = null

    // runs: { flowRunId: string; graph: Graph }[]
    XXXX = new Map<MessageFromExtensionToWebview['uid'], Graph>()

    /** this is for the UI only; process should be very thin / small */
    onMessageFromExtension = (message: MessageFromExtensionToWebview) => {
        // 1. enqueue the message
        const msg: MessageFromExtensionToWebview =
            typeof message === 'string' //
                ? JSON.parse(message)
                : message

        console.log('💬', msg.type) //, { message })

        this.received.push(msg)

        // 2. process the info
        if (msg.type === 'flow-code') return
        if (msg.type === 'ask-boolean') return
        if (msg.type === 'ask-string') return
        if (msg.type === 'ask-paint') return
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
            this.schema = new Schema(msg.schema)
            return
        }

        if (msg.type === 'status') {
            if (msg.data.sid) this.sid = msg.data.sid
            this.status = msg.data.status
            return
        }

        if (msg.type === 'prompt') {
            if (this.schema == null) throw new Error('missing schema')
            this.graph = new Graph(this.schema, msg.graph)
            return
        }

        if (msg.type === 'images') {
            this.imageURLs.push(...msg.images.map((i) => i.comfyURL))
            return
        }

        if (msg.type === 'ls') {
            this.knownWorkflows = msg.workflowNames

            if (this.selectedWorkflowID == null && this.knownWorkflows.length > 0)
                this.selectedWorkflowID = this.knownWorkflows[0].id

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
