import type WebSocket from 'ws'
import { nanoid } from 'nanoid'
import { ScriptStep_askBoolean, ScriptStep_askString } from '../controls/ScriptStep_ask'
import { MessageFromExtensionToWebview, MessageFromWebviewToExtension } from '../core-types/MessageFromExtensionToWebview'
import { logger } from '../logger/logger'
import { exhaust } from '../utils/ComfyUtils'
import { FrontWebview } from './FrontWebview'
import { Workspace } from './Workspace'

export class CushyClient {
    clientID = nanoid()
    constructor(
        //
        public workspace: Workspace,
        public ws: WebSocket,
    ) {
        this.workspace.registerClient(this.clientID, this)
    }

    /** wether or not the webview is up and running and react is mounted */
    ready = false

    queue: MessageFromExtensionToWebview[] = []
    flushQueue = () => {
        const queue = this.queue
        logger().info(`flushing queue of ${queue.length} messages`)
        queue.forEach((msg) => this.ws.send(JSON.stringify(msg)))
        queue.length = 0
    }

    sendMessage(message: MessageFromExtensionToWebview) {
        if (!this.ready) {
            logger().info(`queueing [${message.type}]`)
            this.queue.push(message)
            return
        }

        const msg = JSON.stringify(message)
        logger().debug(`sending ` + msg)
        this.ws.send(msg)

        // this.panel.webview.postMessage(msg)
    }

    onMessageFromWebview = (msg: MessageFromWebviewToExtension) => {
        // const command = smg.command
        // const text = smg.text

        if (msg.type === 'say-hello') {
            // vscode.window.showInformationMessage(`🛋️ ${msg.message}`)
            return
        }

        if (msg.type === 'answer-boolean') {
            const run = this.workspace.activeRun
            if (run == null) throw new Error('no active run')
            const step = run.step
            if (!(step instanceof ScriptStep_askBoolean)) throw new Error('not a string request step')
            step.answer(msg.value)
            return
        }

        if (msg.type === 'answer-string') {
            const run = this.workspace.activeRun
            if (run == null) throw new Error('no active run')
            const step = run.step
            if (!(step instanceof ScriptStep_askString)) throw new Error('not a string request step')
            step.answer(msg.value)
            return
        }

        if (msg.type === 'answer-paint') {
            const run = this.workspace.activeRun
            if (run == null) throw new Error('no active run')
            const step = run.step
            if (!(step instanceof ScriptStep_askString)) throw new Error('not a string request step')
            step.answer(msg.value)
            return
        }

        if (msg.type === 'say-ready') {
            // window.showInformationMessage(msg.message)
            this.ready = true
            this.flushQueue()
            return
        }

        exhaust(msg)
    }
}
