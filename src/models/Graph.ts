import type { VisEdges, VisNodes } from '../front/ui/VisUI'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'
import type { WsMsgExecuted, WsMsgExecuting, WsMsgProgress } from '../types/ComfyWsApi'
import type { ComfyNodeID } from '../types/NodeUID'
import type { Cyto } from '../core/AutolayoutV1'
import type { ComfyNodeSchema, SchemaL } from './Schema'
import type { LiveInstance } from 'src/db/LiveInstance'
import type { HTMLContent, MDContent } from 'src/utils/markdown'
import type { Branded, Maybe } from 'src/utils/types'

import { marked } from 'marked'
import { asHTMLContent, asMDContent } from '../utils/markdown'
import { comfyColors } from '../core/Colors'
import { ComfyNode } from '../core/Node'
import { ImageL } from './Image'

export type RunMode = 'fake' | 'real'

/**
 * graph abstraction
 * - holds the nodes
 * - holds the cyto graph
 * - can be instanciated in both extension and webview
 *   - so no link to workspace or run
 */

export type GraphID = Branded<string, 'GraphID'>
export const asGraphID = (s: string): GraphID => s as any

export type GraphT = {
    id: GraphID
    comfyPromptJSON: ComfyPromptJSON
}

export interface GraphL extends LiveInstance<GraphT, GraphL> {}
export class GraphL {
    /** number of node in the graph */
    get size(): number {
        return this.nodes.length
    }

    onUpdate = (prev: Maybe<GraphT>, next: GraphT) => {
        const prevSize = this.size
        if (prev != null) {
            this.nodes = []
            this.nodesIndex.clear()
            this.currentExecutingNode = null
        }
        for (const [uid, node] of Object.entries(next.comfyPromptJSON)) {
            new ComfyNode(this, uid, node)
        }
        console.log(`📈 graph manually updated ${prevSize} => ${this.size}`)
    }

    /** cytoscape instance to live update graph */
    cyto?: Cyto

    get summary1(): string[] {
        return this.nodes.map((n) => n.$schema.nameInCushy)
    }

    /** @internal every node constructor must call this */
    registerNode = (node: ComfyNode<any>) => {
        this.data.comfyPromptJSON[node.uid] = node.json
        this.nodesIndex.set(node.uid, node)
        this.nodes.push(node)
        this.cyto?.trackNode(node)
        // this.graph.run.cyto.addNode(this)
    }

    /** proxy to this.db.schema */
    get schema() {
        return this.db.schema
    }

    /** nodes, in creation order */
    nodes: ComfyNode<any>[] = []

    /** nodes, indexed by nodeID */
    nodesIndex = new Map<string, ComfyNode<any>>()

    /** convert to mermaid DSL expression for nice graph rendering */
    toMermaid = () => {
        const out = [
            //
            // 'graph TD',
            'graph LR',
            this.nodes.map((n) => `${n.uid}[${n.$schema.nameInCushy}]`).join('\n'),
            this.nodes
                .map((n) =>
                    n
                        ._incomingEdges()
                        .map((i) => {
                            const from = this.nodesIndex.get(i.from)

                            return `${from?.uid ?? i.from}[${from?.$schema.nameInCushy ?? i.from}] --> |${i.inputName}|${n.uid}[${
                                n.$schema.nameInCushy
                            }]`
                        })
                        .join('\n'),
                )
                .join('\n'),
        ].join('\n')
        console.log(out)
        return out
    }

    /** return the coresponding comfy prompt  */
    get jsonForPrompt(): ComfyPromptJSON {
        const json: ComfyPromptJSON = {}
        for (const node of this.nodes) {
            if (node.disabled) continue
            json[node.uid] = node.json
        }
        return json
    }

    // 🔴 => move this elsewhere
    // convertToImageInput = (x: GeneratedImage): string => {
    //     return `../outputs/${x.data.filename}`
    //     // return this.LoadImage({ image: name })
    // }

    /** temporary proxy */
    // convertToImageInputOLD1 = async (x: PromptOutputImage): Promise<string> => {
    //     const name = await x.makeAvailableAsInput()
    //     console.log('[convertToImageInput]', { name })
    //     // @ts-ignore
    //     return name
    //     // return this.LoadImage({ image: name })
    // }

    /** @internal pointer to the currently executing node */
    currentExecutingNode: ComfyNode<any> | null = null

    /** @internal update the progress value of the currently focused onde */
    onProgress = (msg: WsMsgProgress) => {
        if (this.currentExecutingNode) {
            this.currentExecutingNode.progress = msg.data
            return
        }
        console.log('❌ no current executing node', msg)
    }

    private outputs: WsMsgExecuted[] = []
    images: ImageL[] = []

    /** @internal update pointer to the currently executing node */
    onExecuting = (msg: WsMsgExecuting) => {
        // 1. mark currentExecutingNode as done
        if (this.currentExecutingNode) this.currentExecutingNode.status = 'done'
        // 2. then two cases:
        // 2.A. no node => the prompt is done
        if (msg.data.node == null) {
            this.currentExecutingNode = null
            return
        }
        // 2.B. a node => node evaluation is starting
        const node = this.getNodeOrCrash(msg.data.node)
        this.currentExecutingNode = node
        node.status = 'executing'
    }

    // onExecuted = (msg: WsMsgExecuted) => {
    //     const node = this.getNodeOrCrash(msg.data.node)
    //     const images = msg.data.output.images.map((i) => new PromptOutputImage(this, i))

    //     // console.log(`🟢 `, images.length, `CushyImages`)
    //     // accumulate in self
    //     this.outputs.push(msg)
    //     this.images.push(...images)
    //     // console.log(`🟢 `, this.uid, 'has', this.images.length, `CushyImages`)

    //     // accumulate in node
    //     node.artifacts.push(msg.data)
    //     node.images.push(...images)
    // }

    get flowSummaryMd(): MDContent {
        return asMDContent(
            [
                //
                // '# Flow summary\n',
                `<pre class="mermaid">`,
                this.toMermaid(),
                `</pre>`,
            ].join('\n'),
        )
    }
    get flowSummaryHTML(): HTMLContent {
        // https://mermaid.js.org/config/usage.html
        return asHTMLContent(marked.parse(this.flowSummaryMd))
    }

    private _nextUID = 1
    getUID = () => (this._nextUID++).toString()
    getNodeOrCrash = (nodeID: ComfyNodeID): ComfyNode<any> => {
        const node = this.nodesIndex.get(nodeID)
        if (node == null) throw new Error('Node not found:' + nodeID)
        return node
    }

    /** visjs JSON format (network visualisation) */
    get JSON_forVisDataVisualisation(): { nodes: VisNodes[]; edges: VisEdges[] } {
        const json: ComfyPromptJSON = this.jsonForPrompt
        const schemas: SchemaL = this.db.schema
        const nodes: VisNodes[] = []
        const edges: VisEdges[] = []
        if (json == null) return { nodes: [], edges: [] }
        for (const [uid, node] of Object.entries(json)) {
            const schema: ComfyNodeSchema = schemas.nodesByNameInComfy[node.class_type]
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

/** all images generated by nodes in this graph */
// get allImages(): GeneratedImage[] {
//     return this.nodes.flatMap((a) => a.images)
// }

/** wether it should really send the prompt to the backend */
// get runningMode(): RunMode {
//     return this.run.opts?.mock ? 'fake' : 'real'
// }

// COMMIT --------------------------------------------

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
