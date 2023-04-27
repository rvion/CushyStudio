import type WebSocket from 'ws'
import * as vscode from 'vscode'
import type { Workspace } from './Workspace'

import { nanoid } from 'nanoid'
import { ScriptStep_askBoolean, ScriptStep_askString } from '../controls/ScriptStep_ask'
import { MessageFromExtensionToWebview, MessageFromWebviewToExtension } from '../core-types/MessageFromExtensionToWebview'
import { logger } from '../logger/logger'
import { exhaust } from '../utils/ComfyUtils'

export class CushyClient {
    clientID = nanoid(6)
    constructor(
        //
        public workspace: Workspace,
        public ws: WebSocket,
    ) {
        logger().info(`🐼 Client ${this.clientID} connected`)
        ws.on('message', (message: string) => {
            // logger().info(message)
            // logger().info(jsonMsg)
            const jsonMsg = JSON.parse(message)
            this.onMessageFromWebview(jsonMsg)
        })
        ws.onerror = (err) => {
            console.log('ws error', err)
        }
        ws.on('close', () => {
            this.workspace.unregisterClient(this.clientID)
            console.log('Client disconnected')
        })

        this.workspace.registerClient(this.clientID, this)
    }

    /** wether or not the webview is up and running and react is mounted */
    ready = false

    queue: MessageFromExtensionToWebview[] = []
    flushQueue = () => {
        const queue = this.queue
        logger().info(`🐼 Client ${this.clientID} flushing queue of ${queue.length} messages`)
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
            vscode.window.showInformationMessage(`🛋️ ${msg.message}`)
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

        if (msg.type === 'run-flow') {
            logger().info(`🐙 run-flow request: ${msg.flowID}`)
            let validTestIte: vscode.TestItem | undefined
            const allTests = this.workspace.vsTestController.items.forEach((i) => {
                i.children.forEach((c) => {
                    if (c.id === msg.flowID) {
                        validTestIte = c
                    }
                })
                // console.log(i.id, i.label, { i })
            })
            if (validTestIte == null) return logger().info('🔴 test not found')
            // manually run the test
            this.workspace.startTestRun({
                exclude: [],
                include: [validTestIte],
                profile: this.workspace.xxx,
            })

            // this.workspace.vsTestController.createTestRun({
            //     exclude: [],
            //     include: [validTestIte],
            //     profile: this.workspace.xxx,
            // })
            // const flow = this.workspace.vsTestController.
            // logger().info(`🐙 run-flow: ${flow?.id}`)
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
            logger().info(`🐼 Client ${this.clientID} ready`)
            this.ready = true

            // send the last known workflow list
            const lastLs = this.workspace.lastMessages.get('ls')
            if (lastLs) this.sendMessage(lastLs)

            // then flush
            this.flushQueue()
            return
        }

        exhaust(msg)
    }
}
