import type { ComfyStatus } from '../core-types/ComfyWsPayloads'

// inspirations:
// https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/frameworks/hello-world-react-vite/webview-ui/src/utilities/vscode.ts
// https://codebycorey.com/blog/building-a-vscode-extension-part-four
import { makeObservable, observable } from 'mobx'
import { Schema } from '../core-shared/Schema'
import { exhaust } from '../utils/ComfyUtils'
import { Maybe } from '../utils/types'
import { Graph } from '../core-shared/Graph'
import { MessageFromExtensionToWebview, MessageFromWebviewToExtension } from '../core-types/MessageFromExtensionToWebview'
import { logger } from '../logger/logger'
import { ResilientCushySocket } from './ResilientCushySocket'
// import { toaster } from 'rsuite'
import { nanoid } from 'nanoid'

/**
 * A utility wrapper around the acquireVsCodeApi() function, which enables
 * message passing and state management between the webview and extension
 * contexts.
 *
 * This utility also enables webview code to be run in a web browser-based
 * dev server by using native web browser features that mock the functionality
 * enabled by acquireVsCodeApi.
 */
class FrontState {
    uid = nanoid()
    // private readonly vsCodeApi: WebviewApi<unknown> | undefined
    received: MessageFromExtensionToWebview[] = []

    answerString = (value: string) => this.sendMessageToExtension({ type: 'answer-string', value })
    answerBoolean = (value: boolean) => this.sendMessageToExtension({ type: 'answer-boolean', value })

    cushySocket: ResilientCushySocket
    constructor() {
        // if (typeof acquireVsCodeApi === 'function') this.vsCodeApi = acquireVsCodeApi()
        // console.log('a')
        this.cushySocket = new ResilientCushySocket({
            url: () => 'ws://localhost:8288',
            onConnectOrReconnect: () => {
                // toaster.push('Connected to CushyStudio')
            },
            onMessage: (msg) => {
                // console.log('received', msg.data)
                const json = JSON.parse(msg.data)
                this.onMessageFromExtension(json)
            },
        })
        // console.log('b')

        makeObservable(this, {
            received: observable,
            images: observable,
            status: observable,
        })
        // window.addEventListener('message', this.onMessageFromExtension)
        this.sendMessageToExtension({ type: 'say-ready', frontID: this.uid })
    }

    graph: Maybe<Graph> = null
    schema: Maybe<Schema> = null
    images: string[] = []
    sid: Maybe<string> = null
    status: Maybe<ComfyStatus> = null

    /** this is for the UI only; process should be very thin / small */
    onMessageFromExtension = (message: MessageFromExtensionToWebview) => {
        // const xxx = JSON.stringify(message.data).slice(0, 100)
        // console.log(xxx)
        // alert('CAUGHT THE MESSAGE')
        // 1. enqueue the message
        const msg: MessageFromExtensionToWebview =
            typeof message === 'string' //
                ? JSON.parse(message)
                : message

        console.log('💬', msg.type) //, { message })

        this.received.push(msg)

        // 2. process the info
        if (msg.type === 'ask-boolean') return
        if (msg.type === 'ask-string') return
        if (msg.type === 'ask-paint') return

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
            this.images.push(...msg.uris)
            return
        }

        if (msg.type === 'show-html') {
            // return console.log('🐰', 'show-html', msg)
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
            if (msg.data.node == null) this.graph = null // done
            logger().debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
            return graph.onExecuting(msg)
        }

        if (msg.type === 'executed') {
            logger().info(`${msg.type} ${JSON.stringify(msg.data)}`)
            // return graph.onExecuted(msg)
            return
        }

        if (msg.type === 'print') {
            // logger().info( `${msg.type} ${JSON.stringify(msg.data)}`)
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

// no hot reload in webview, so global is not so big of a deal

// Exports class singleton to prevent multiple invocations of acquireVsCodeApi.
export const vscode = new FrontState()
