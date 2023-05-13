import type WebSocket from 'ws'
import type { ServerState } from './ServerState'

import { nanoid } from 'nanoid'
import { MessageFromExtensionToWebview, MessageFromWebviewToExtension } from '../types/MessageFromExtensionToWebview'
import { logger } from '../logger/logger'
import { exhaust } from '../utils/ComfyUtils'
import { ScriptStep_ask } from '../controls/ScriptStep_ask'
import open from 'open'
import { asRelativePath } from '../utils/fs/pathUtils'
import { ActionDefinition } from './ActionDefinition'

export class CushyClient {
    clientID = nanoid(6)

    constructor(
        //
        public serverState: ServerState,
        public ws: WebSocket,
    ) {
        logger().info(`🐼 Client ${this.clientID} connected`)
        ws.on('message', (message: string) => {
            // logger().info(message)
            // logger().info(jsonMsg)
            const jsonMsg = JSON.parse(message)
            this.onMessageFromWebview(jsonMsg)
        })
        ws.on('open', () => {
            const lastStatus = this.serverState.lastMessagesPerType.get('cushy_status')
            if (lastStatus) this.sendMessage(lastStatus)
            // this.sendMessage(this.serverState.allActionsRefs)
        })
        ws.onerror = (err) => {
            console.log('ws error', err)
        }
        ws.on('close', () => {
            this.serverState.unregisterClient(this.clientID)
            console.log('Client disconnected')
        })

        this.serverState.registerClient(this.clientID, this)
    }

    /** wether or not the webview is up and running and react is mounted */
    ready = false

    queue: MessageFromExtensionToWebview[] = []
    flushQueue = () => {
        const queue = this.queue
        logger().info(`🐼 Client ${this.clientID} flushing queue of ${queue.length} messages`)
        console.log('coucou')
        this.sendMessage({ type: 'sync-history', history: this.serverState.db.data, uid: nanoid() })
        this.sendMessage(this.serverState.allActionsRefs())
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

        if (msg.type === 'image') {
            // save base64 image
            // console.log('🔴', msg.base64.slice(0, 100))
            const payload = msg.base64.split(';base64,').pop()!
            const img = Buffer.from(payload, 'base64')
            const imageID = msg.imageID
            // abs path
            const absPath = this.serverState.resolve(
                //
                this.serverState.outputFolderPath,
                asRelativePath(`${imageID}.png`),
            )
            console.log(`🟢 saved image at`, absPath)
            // save
            this.serverState.writeBinaryFile(absPath, img)
            // url
            const baseURL = this.serverState.server.baseURL
            const cacheFolderPath = this.serverState.cacheFolderPath
            const localURL = baseURL + absPath.replace(cacheFolderPath, '')
            this.serverState.broadCastToAllClients({
                type: 'images',
                images: [
                    {
                        //
                        uid: msg.imageID,
                        // comfyRelativePath:'',
                        // comfyURL:'',
                        localAbsolutePath: absPath,
                        localURL,
                    },
                ],
            })
            return
        }

        if (msg.type === 'open-external') {
            console.log('open external', msg.uriString, msg.uriString)
            return void open(msg.uriString)
        }

        if (msg.type === 'answer') {
            const run = this.serverState.activeRun
            if (run == null) throw new Error('no active run')
            const step = run.step
            if (!(step instanceof ScriptStep_ask)) throw new Error('not a string request step')
            step.answer(msg.value)
            return
        }

        if (msg.type === 'run-action') {
            logger().info(`🐙 run-flow request: ${msg.actionID}`)
            const action: ActionDefinition | undefined = this.serverState.knownActions.get(msg.actionID)
            if (action == null) return logger().info('no action found for id:' + msg.actionID)
            const flow = this.serverState.getOrCreateFlow(msg.flowID)
            return flow.runAction(action)
        }

        if (msg.type === 'reset') {
            this.serverState.db.reset()
            return
        }

        if (msg.type === 'say-ready') {
            // window.showInformationMessage(msg.message)
            logger().info(`🐼 Client ${this.clientID} ready`)
            this.ready = true

            // send the last known workflow list
            const lastLs = this.serverState.lastMessagesPerType.get('ls')
            if (lastLs) this.sendMessage(lastLs)

            // then flush
            this.flushQueue()
            return
        }

        exhaust(msg)
    }
}
