import type { VisEdges, VisNodes } from '../ui/VisUI'
import type { ComfyNodeUID } from './ComfyNodeUID'
import type { ComfyProject } from './ComfyProject'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { ScriptExecution } from './ScriptExecution'
import type { Maybe } from './ComfyUtils'

// import { BranchUserApi, GitgraphUserApi } from '@gitgraph/core'
import { makeObservable, observable } from 'mobx'
import { WsMsgExecuted } from './ComfyAPI'
import { ComfyClient } from './ComfyClient'
import { comfyColors } from './ComfyColors'
import { ComfyNode } from './ComfyNode'
import { ComfyNodeSchema, ComfySchema } from './ComfySchema'
import { nanoid } from 'nanoid'

export type RunMode = 'fake' | 'real'

export class ComfyGraph {
    uid = nanoid()
    get client(): ComfyClient { return this.project.client } // prettier-ignore
    get schema() { return this.client.schema } // prettier-ignore
    get nodesArray() { return Array.from(this.nodes.values()) } // prettier-ignore
    nodes = new Map<string, ComfyNode<any>>()
    isRunning = false

    /** return the coresponding comfy prompt  */
    get json(): ComfyPromptJSON {
        const json: ComfyPromptJSON = {}
        for (const node of this.nodesArray) json[node.uid] = node.json
        return json
    }

    /** temporary proxy */
    askBoolean = (msg: string, def?: Maybe<boolean>): Promise<boolean> => this.executionContext.askBoolean(msg, def)
    askString = (msg: string, def?: Maybe<string>): Promise<string> => this.executionContext.askString(msg, def)

    constructor(
        //
        public project: ComfyProject,
        public executionContext: ScriptExecution,
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

    outputs: WsMsgExecuted[] = []

    /** wether it should really send the prompt to the backend */
    get runningMode(): RunMode {
        return this.executionContext.opts?.mock ? 'fake' : 'real'
    }

    // COMMIT --------------------------------------------
    async get() {
        const step = this.executionContext.sendPromp()
        await step.finished
    }

    // JSON_forGitGraphVisualisation = (gitgraph: GitgraphUserApi<any>) => {
    //     // extract graph
    //     const ids: TNode[] = []
    //     const edges: TEdge[] = []
    //     for (const node of this.nodesArray) {
    //         ids.push(node.uid)
    //         for (const fromUID of node._incomingNodes()) edges.push([fromUID, node.uid])
    //     }
    //     // sort it
    //     const sortedIds = toposort(ids, edges)
    //     // renderit
    //     const invisible = { renderDot: () => null, renderMessage: () => null }
    //     const cache: { [key: string]: BranchUserApi<any> } = {}
    //     const master = gitgraph.branch('master').commit(invisible)
    //     for (const id of sortedIds) {
    //         const node = this.nodes.get(id)!
    //         const branch = master.branch(node.uid)
    //         cache[id] = branch.commit({ body: node.$schema.name, renderDot: () => null, renderMessage: () => null })
    //         for (const fromUID of node._incomingNodes())
    //             cache[id] = branch.merge({ fastForward: true, branch: fromUID, commitOptions: invisible })
    //         cache[id] = branch.commit({ body: node.$schema.name })
    //     }
    // }

    /** visjs JSON format (network visualisation) */
    get JSON_forVisDataVisualisation(): { nodes: VisNodes[]; edges: VisEdges[] } {
        const json: ComfyPromptJSON = this.json
        const schemas: ComfySchema = this.schema
        const nodes: VisNodes[] = []
        const edges: VisEdges[] = []
        if (json == null) return { nodes: [], edges: [] }
        for (const [uid, node] of Object.entries(json)) {
            const schema: ComfyNodeSchema = schemas.nodesByName[node.class_type]
            const color = comfyColors[schema.category]
            nodes.push({ id: uid, label: node.class_type, color, font: { color: 'white' }, shape: 'box' })
            for (const [name, val] of Object.entries(node.inputs)) {
                if (val instanceof Array) {
                    const [from, slotIx] = val
                    const edgeID = `${from}-${uid}-${slotIx}`
                    edges.push({ id: edgeID, from, to: uid, arrows: 'to', label: name, labelHighlightBold: false, length: 200 })
                }
            }
        }
        return { nodes, edges }
    }
}
