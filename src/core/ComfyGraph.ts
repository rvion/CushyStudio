import type { VisEdges, VisNodes } from '../ui/VisUI'

import { makeObservable, observable } from 'mobx'
import { ApiPromptInput, ComfyStatus, WsMsg, WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from './ComfyAPI'
import { sleep } from '../utils/sleep'
import { ComfyNode } from './ComfyNode'
import { ComfyNodeJSON, ComfyPromptJSON } from './ComfyNodeJSON'
import { ComfyNodeUID } from './ComfyNodeUID'
import { schemas } from './Comfy'
import { ComfyNodeSchema } from './ComfyNodeSchema'
import { comfyColors } from './ComfyColors'
import { ComfyManager } from './ComfyManager'
import { ComfyProject } from './ComfyProject'

export type RunMode = 'fake' | 'real'

export class ComfyGraph {
    // name: string = 'Default Project'
    nodes = new Map<string, ComfyNode<any>>()
    get manager(): ComfyManager { return this.project.manager } // prettier-ignore
    isRunning = false

    constructor(public project: ComfyProject) {
        makeObservable(this, { outputs: observable })
    }

    /** return json for visjs network visualisation */
    get visData(): { nodes: VisNodes[]; edges: VisEdges[] } {
        const json: ComfyPromptJSON = this.prompts[0]
        const nodes: VisNodes[] = []
        const edges: VisEdges[] = []
        if (json == null) return { nodes: [], edges: [] }
        for (const [uid, node] of Object.entries(json)) {
            const schema: ComfyNodeSchema = schemas[node.class_type]
            const color = comfyColors[schema.category]
            nodes.push({ id: uid, label: node.class_type, color, font: { color: 'white' }, shape: 'box' })
            for (const [name, val] of Object.entries(node.inputs)) {
                if (val instanceof Array) {
                    const [from, slotIx] = val
                    edges.push({
                        id: `${from}-${uid}-${slotIx}`,
                        from,
                        to: uid,
                        arrows: 'to',
                        label: name,
                        labelHighlightBold: false,
                        length: 200,
                    })
                }
            }
        }
        return { nodes, edges }
    }

    EVAL = async (code: string, mode: RunMode = 'fake'): Promise<boolean> => {
        if (this.isRunning) return false
        // this.runningMode = mode
        if (mode === 'real') this.isRunning = true
        if (code == null) {
            console.log('❌', 'no code to run')
            this.isRunning = false
            return false
        }
        try {
            const finalCode = code.replace(`export {}`, '')
            const BUILD = new Function('C', `return (async() => { ${finalCode} })()`)
            await BUILD(this)
            console.log('✅')
            this.isRunning = false
            return true
        } catch (error) {
            console.log('❌', error)
            this.isRunning = false
            return false
        }
    }

    private _nextUID = 1
    getUID = () => (this._nextUID++).toString()

    getNodeOrCrash = (nodeID: ComfyNodeUID): ComfyNode<any> => {
        const node = this.nodes.get(nodeID)
        if (node == null) throw new Error('Node not found:' + nodeID)
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
    currentStep = 0
    outputs: WsMsgExecuted[] = []
    onExecuted = (msg: WsMsgExecuted) => {
        this.outputs.push(msg)
        this.currentExecutingNode = null
        const node = this.getNodeOrCrash(msg.data.node)
        this.currentStep++
        node.artifacts.push(msg.data.output)
        console.log(node.artifacts)
    }

    async get() {
        const currentJSON = this.toJSON()
        this.prompts.push(currentJSON)
        if (this.runningMode === 'fake') return null
        const out: ApiPromptInput = {
            client_id: 'super',
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: currentJSON,
        }
        const res = await fetch(`http://${this.manager.serverHost}/prompt`, {
            method: 'POST',
            body: JSON.stringify(out),
        })
        await sleep(1000)
        return res
    }

    toJSON(): ComfyPromptJSON {
        const nodes = Array.from(this.nodes.values())
        const out: { [key: string]: ComfyNodeJSON } = {}
        for (const node of nodes) {
            out[node.uid] = node.toJSON()
        }
        return out
    }
}
