import type { VisEdges, VisNodes } from '../ui/VisUI'

import { makeObservable, observable } from 'mobx'
import { ApiPromptInput, ComfyStatus, WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from './ComfyAPI'
import { ComfyClient } from './ComfyClient'
import { comfyColors } from './ComfyColors'
import { ComfyNode } from './ComfyNode'
import { ComfyNodeUID } from './ComfyNodeUID'
import { ComfyProject } from './ComfyProject'
import { ComfyPromptJSON } from './ComfyPrompt'
import { ComfyNodeSchema, ComfySchema } from './ComfySchema'
import { deepCopyNaive, sleep } from './ComfyUtils'

export type RunMode = 'fake' | 'real'

export class ComfyGraph {
    get client(): ComfyClient { return this.project.client } // prettier-ignore
    get schema() { return this.client.schema } // prettier-ignore
    get nodesArray() { return Array.from(this.nodes.values()) } // prettier-ignore
    nodes = new Map<string, ComfyNode<any>>()
    isRunning = false

    get json() {
        const json: ComfyPromptJSON = {}
        for (const node of this.nodesArray) {
            json[node.uid] = node.json
        }
        console.log('🔴', 'json', json) //JSON.stringify(json, null, 3))
        return json
    }

    constructor(
        //
        public project: ComfyProject,
        json: ComfyPromptJSON = {},
    ) {
        // console.log('COMFY GRAPH')
        makeObservable(this, { outputs: observable })
        for (const [uid, node] of Object.entries(json)) {
            new ComfyNode(this, uid, node)
        }
        // inject properties:
        // TODO: rewrite with a single defineProperties call
        // with propery object being defined on the client
        // to remove all this extra work
        const schema = project.schema
        for (const node of schema.nodes) {
            // console.log(`node: ${node.name}`)
            Object.defineProperty(this, node.name, {
                value: (inputs: any) =>
                    new ComfyNode(this, this.getUID(), {
                        class_type: node.name as any,
                        inputs,
                    }),
            })
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

    runningMode: RunMode = 'fake' // 🔴

    // COMMIT --------------------------------------------
    async get() {
        const currentJSON = deepCopyNaive(this.json)
        console.log('[🚀] got', this.runningMode)
        console.log('[🚀] got', currentJSON)
        this.project.graphs.push(new ComfyGraph(this.project, currentJSON))
        if (this.runningMode === 'fake') return null
        const out: ApiPromptInput = {
            client_id: this.client.sid,
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: currentJSON,
        }
        const res = await fetch(`http://${this.client.serverHost}/prompt`, {
            method: 'POST',
            body: JSON.stringify(out),
        })
        await sleep(1000)
        return res
    }

    /** visjs JSON format (network visualisation) */
    get visData(): { nodes: VisNodes[]; edges: VisEdges[] } {
        const json: ComfyPromptJSON = this.json
        const schemas: ComfySchema = this.schema
        const nodes: VisNodes[] = []
        const edges: VisEdges[] = []
        if (json == null) return { nodes: [], edges: [] }
        for (const [uid, node] of Object.entries(json)) {
            const schema: ComfyNodeSchema = schemas.nodesByName[node.class_type]
            const color = comfyColors[schema.category]
            nodes.push({
                id: uid,
                label: node.class_type,
                color,
                font: { color: 'white' },
                shape: 'box',
            })
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
}

// OUTPUTS --------------------------------------------
/** Comfy Prompt JSON format */
// toJSON(): ComfyPromptJSON {
//     const nodes = Array.from(this.nodes.values())
//     const out: { [key: string]: ComfyNodeJSON } = {}
//     for (const node of nodes) {
//         out[node.uid] = node.toJSON()
//     }
//     return out
// }
