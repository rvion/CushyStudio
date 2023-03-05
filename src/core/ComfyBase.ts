import WebSocket, { MessageEvent } from 'ws'
import { ApiPromptInput, ComfyStatus, WsMsg, WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from '../client/api'
import { ComfyNode, NodeUID } from './runtime'

/** top level base class */
export abstract class ComfyBase {
    serverIP = '192.168.1.19'
    serverPort = 8188
    serverHost = `${this.serverIP}:${this.serverPort}`
    nodes = new Map<string, ComfyNode<any>>()

    constructor() {
        const ws = new WebSocket(`ws://${this.serverHost}/ws`)
        ws.binaryType = 'arraybuffer'
        ws.onopen = () => console.log('connected')
        ws.onmessage = (e: MessageEvent) => {
            const msg: WsMsg = JSON.parse(e.data as any)
            // console.log('🟢 msg', msg)
            if (msg.type === 'status') return this.onStatus(msg)
            if (msg.type === 'progress') return this.onProgress(msg)
            if (msg.type === 'executing') return this.onExecuting(msg)
            if (msg.type === 'executed') return this.onExecuted(msg)
            throw new Error('Unknown message type: ' + msg)
        }
    }

    getNodeOrCrash = (nodeID: NodeUID): ComfyNode<any> => {
        const node = this.nodes.get(nodeID)
        if (node == null) throw new Error('Node not found')
        return node
    }

    currentExecutingNode: ComfyNode<any> | null = null
    clientID: string | null = '06dd0f88-5af0-4527-b460-5f5b16d31782'
    status: ComfyStatus | null = null
    onStatus = (msg: WsMsgStatus) => {
        if (msg.data.sid) this.clientID = msg.data.sid
        if (msg.data.status) this.status = msg.data.status
    }
    onProgress = (msg: WsMsgProgress) => {
        if (this.currentExecutingNode) this.currentExecutingNode.progress = msg.data
    }
    onExecuting = (msg: WsMsgExecuting) => {
        if (msg.data.node == null) return // 🔴 @comfy: why is that null sometimes ?
        this.currentExecutingNode = this.getNodeOrCrash(msg.data.node)
    }
    onExecuted = (msg: WsMsgExecuted) => {
        this.currentExecutingNode = null
        const node = this.getNodeOrCrash(msg.data.node)
        node.outputs.push(msg.data.output)
        console.log(node.outputs)
    }

    async get() {
        const out: ApiPromptInput = {
            client_id: 'super',
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: this.toJSON(),
        }
        const res = await fetch(`http://${this.serverHost}/prompt`, {
            method: 'POST',
            body: JSON.stringify(out),
        })
        return res
    }

    toJSON() {
        const nodes = Array.from(this.nodes.values())
        const out: { [key: string]: any } = {}
        for (const node of nodes) {
            out[node.uid] = node.toJSON()
        }
        return out
    }
}
