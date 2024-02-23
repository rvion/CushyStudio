import type { Cyto } from '../core/AutolayoutV1'
import type { ComfyNodeID, ComfyNodeMetadata } from '../types/ComfyNodeID'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'
import type { ApiPromptInput, PromptInfo, WsMsgExecuting, WsMsgExecutionCached, WsMsgProgress } from '../types/ComfyWsApi'
import type { VisEdges, VisNodes } from '../widgets/misc/VisUI'
import type { ComfyPromptL } from './ComfyPrompt'
import type { ComfyNodeSchema, ComfySchemaL } from './Schema'
import type { StepL } from './Step'
import type { MouseEvent } from 'react'
import type { IDNaminScheemeInPromptSentToComfyUI } from 'src/back/IDNaminScheemeInPromptSentToComfyUI'
import type { LiveInstance } from 'src/db/LiveInstance'
import type { GraphT } from 'src/db/TYPES.gen'
import type { HTMLContent, MDContent } from 'src/types/markdown'

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { marked } from 'marked'
import { join } from 'pathe'

import { ComfyWorkflowBuilder } from '../back/NodeBuilder'
import { CytoJSON, runAutolayout } from '../core/AutolayoutV2'
import { comfyColors } from '../core/Colors'
import { ComfyNode } from '../core/ComfyNode'
import { convertFlowToLiteGraphJSON, LiteGraphJSON } from '../core/LiteGraph'
import { asHTMLContent, asMDContent } from '../types/markdown'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { InvalidPromptError } from 'src/back/RuntimeError'
import { LiveRefOpt } from 'src/db/LiveRefOpt'
import { bang } from 'src/utils/misc/bang'
import { deepCopyNaive } from 'src/utils/misc/ComfyUtils'

export type ProgressReport = {
    percent: number
    isDone: boolean
    countDone: number
    countTotal: number
}

export type PromptSettings = {
    saveFormat?: ImageSaveFormat
    idMode?: IDNaminScheemeInPromptSentToComfyUI
}
/**
 * ComfyWorkflowL
 * - holds the nodes
 * - holds the cyto graph
 * - can be instanciated in both extension and webview
 *   - so no link to workspace or run
 */

export const GraphIDCache = new Map<string, number>()

export interface ComfyWorkflowL extends LiveInstance<GraphT, ComfyWorkflowL> {}
export class ComfyWorkflowL {
    /** number of node in the graph */
    get size(): number {
        return this.nodes.length
    }

    menuAction_openInFullScreen = async (ev: MouseEvent) => {
        ev.preventDefault()
        ev.stopPropagation()
        const prompt = this.json_workflow()
        if (prompt == null) return
        this.st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson: prompt }, 'full')
    }
    menuAction_openInTab = async (ev: MouseEvent) => {
        ev.preventDefault()
        ev.stopPropagation()
        const prompt = this.json_workflow()
        if (prompt == null) return
        this.st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson: prompt })
    }
    menuAction_downloadPrompt = async (ev: MouseEvent) => {
        ev.preventDefault()
        ev.stopPropagation()
        const jsonPrompt = this.json_forPrompt('use_class_name_and_number')
        // ensure folder exists
        const folderExists = existsSync(this.cacheFolder)
        if (!folderExists) mkdirSync(this.cacheFolder, { recursive: true })
        // save file
        const path = this.getTargetPromptFilePath()
        // console.log('>>>🟢', { path })
        // open folder containing file
        window.require('electron').shell.openExternal(`file://${path}/..`)
        writeFileSync(path, JSON.stringify(jsonPrompt, null, 3))
    }

    menuAction_downloadWorkflow = async (ev: MouseEvent) => {
        ev.preventDefault()
        ev.preventDefault()
        const jsonWorkflow = await this.json_workflow()
        console.log('>>>🟢', { jsonWorkflow })
        // ensure folder exists
        const folderExists = existsSync(this.cacheFolder)
        if (!folderExists) mkdirSync(this.cacheFolder, { recursive: true })
        // save file
        const path = this.getTargetWorkflowFilePath()
        console.log('>>>🟢', { path })
        // open folder containing file
        window.require('electron').shell.openExternal(`file://${path}/..`)
        writeFileSync(path, JSON.stringify(jsonWorkflow, null, 3))
    }

    get comfyPromptJSON() {
        return this.data.comfyPromptJSON
    }

    /** ❓ UNTESTED */
    setMetadata = (nodeID: ComfyNodeID, meta: ComfyNodeMetadata) => {
        this.data.metadata[nodeID] = meta
    }

    /** ❓ UNTESTED */
    getMetadata = (nodeID: ComfyNodeID): Maybe<ComfyNodeMetadata> => {
        return this.data.metadata[nodeID] ?? null
    }

    _problems: { title: string; data?: any }[] = []
    recordProblem = (title: string, data?: any) => {
        this._problems.push({ title, data })
    }

    private _builder: ComfyWorkflowBuilder | null = null
    get builder(): ComfyWorkflowBuilder {
        if (this._builder) return this._builder
        this._builder = new ComfyWorkflowBuilder(this)
        return this._builder
    }

    onUpdate = (prev: Maybe<GraphT>, next: GraphT) => {
        const prevSize = this.size
        if (prev != null) {
            this.nodes = []
            this.nodesIndex.clear()
            this.currentExecutingNode = null
        }
        for (const [uid, node] of Object.entries(bang(next.comfyPromptJSON))) {
            const meta: Maybe<ComfyNodeMetadata> = next.metadata?.[uid]
            new ComfyNode(this, uid, node, meta)
        }
        // console.log(`[📈] GRAPH: manually updated ${prevSize} => ${this.size}`)
        // if (this.id === 'hMVVgKmyYZ-baEQtdibSx') {
        //     console.log(`[👙] GRAPH.onUpdate`, prev, next, this.nodes.length)
        // }
    }

    /** cytoscape instance to live update graph */
    cyto?: Cyto

    get summary1(): string[] {
        return this.nodes.map((n) => n.$schema.nameInCushy)
    }

    // drafts = new LiveCollection<DraftL>(this, 'graphID', 'drafts')
    // childSteps = new LiveCollection<StepL>(this, 'parentGraphID', 'steps')
    // parentSteps = new LiveCollection<StepL>(this, 'outputGraphID', 'steps')

    /** focus step and update selected Draft */
    // ⏸️ focusStepAndUpdateDraft = (step: StepL) => {
    // ⏸️     this.update({ focusedStepID: step.id })
    // ⏸️     if (this.focusedDraft.item == null) return
    // ⏸️     this.focusedDraft.item.update({
    // ⏸️         toolID: step.data.toolID,
    // ⏸️         // params: deepCopyNaive(step.data.params),
    // ⏸️     })
    // ⏸️ }

    /** @internal every node constructor must call this */
    registerNode = (node: ComfyNode<any>) => {
        if (this.data.comfyPromptJSON == null) throw new Error('graph not hydrated')
        this.data.comfyPromptJSON[node.uid] = node.json
        this.data.metadata[node.uid] = node.meta
        this.nodesIndex.set(node.uid, node)
        this.nodes.push(node)
        this.cyto?.trackNode(node)
        // this.graph.run.cyto.addNode(this)
    }

    /** proxy to this.db.schema */
    get schema() {
        return this.st.schema
    }

    /** nodes, in creation order */
    nodes: ComfyNode<any>[] = []
    get pendingNodes() {
        return this.nodes.filter((n) => n.status == null || n.status === 'waiting')
    }
    get nodesByUpdatedAt() {
        return this.nodes //
            .filter((n) => n.status != null && n.status !== 'waiting')
            .sort((a, b) => b.updatedAt - a.updatedAt)
        // return this.nodes.slice().sort((a, b) => b.updatedAt - a.updatedAt)
    }

    findNodeByType = <T extends keyof ComfySetup>(nameInCushy: T): Maybe<ReturnType<ComfySetup[T]>> => {
        return this.nodes.find((n) => n.$schema.nameInCushy === nameInCushy) as any
    }

    /** nodes, indexed by nodeID */
    nodesIndex = new Map<string, ComfyNode<any>>()

    /** convert to mermaid DSL expression for nice graph rendering */
    toMermaid = (): string => {
        const out = [
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
        // console.log(out)
        return out
    }

    get json_cyto(): CytoJSON {
        const cytoJSON = runAutolayout(this)
        return cytoJSON
    }

    get json_cyto_small(): CytoJSON {
        const PX = 15
        const cytoJSON = runAutolayout(this, {
            width: (node) => {
                const max = 20
                // ⏸️ console.log(`[👙] `, node.$schema.nameInComfy, node.$schema.nameInComfy.length)
                let len = node.$schema.nameInComfy.length
                const prims = node._primitives()
                for (const p of prims) {
                    const x = p.inputName.length + (p.value?.length ?? 0)
                    // ⏸️ console.log(`[👙] x`, x)
                    if (x > max) {
                        // ⏸️ console.log(`[👙] MAX`, x)
                        return max * PX
                    }
                    if (x > len) len = x
                }
                // ⏸️ console.log(`[👙] OUT`, len)
                return len * PX
            },
            height: (node) => {
                // return PX * (node._primitives().length + 2)
                return PX * (node.$schema.inputs.length + 2)
            },
        })
        return cytoJSON
    }

    json_workflow = (): LiteGraphJSON => {
        const cytoJSON = this.json_cyto
        const liteGraphJSON = convertFlowToLiteGraphJSON(this, cytoJSON)
        return liteGraphJSON
        // this.st.writeTextFile(workflowJSONPath, JSON.stringify(liteGraphJSON, null, 4))
    }
    /** return the coresponding comfy prompt  */
    json_forPrompt = (ns: IDNaminScheemeInPromptSentToComfyUI): ComfyPromptJSON => {
        const json: ComfyPromptJSON = {}
        for (const node of this.nodes) {
            if (node.disabled) continue
            // console.log(`🦊 ${node.uid}`)
            if (ns === 'use_stringified_numbers_only') {
                json[node.uid] = node.json
            } else {
                json[node.uidPrefixed] = node.json
            }
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

    get progressCurrentNode(): Maybe<ProgressReport> {
        const node = this.currentExecutingNode
        if (node == null) return null
        const percent = node.status === 'done' ? 100 : node.progressRatio * 100
        const isDone = node.status === 'done'
        return { percent, isDone, countDone: node.progressRatio * 100, countTotal: 100 }
    }
    get progressGlobal(): ProgressReport {
        const totalNode = this.nodes.length
        const doneNodes = this.nodes.filter((n) => n.status === 'done' || n.status === 'cached').length
        const bonus = this.currentExecutingNode?.progressRatio ?? 0
        const score = (doneNodes + bonus) / totalNode
        const percent = this.done ? 100 : score * 100
        const isDone = this.done
        return { percent, isDone, countDone: doneNodes + bonus, countTotal: totalNode }
    }
    /** @internal update the progress value of the currently focused onde */
    onProgress = (msg: WsMsgProgress) => {
        if (this.currentExecutingNode == null) return console.log('❌ no current executing node', msg)
        this.currentExecutingNode.progress = msg.data
        this.currentExecutingNode.progressRatio = (msg.data.value ?? 0) / (msg.data.max || 1)
    }

    getTargetWorkflowFilePath = () => {
        return asAbsolutePath(join(this.st.cacheFolderPath, 'workflow.json'))
    }
    getTargetPromptFilePath = () => {
        return asAbsolutePath(join(this.st.cacheFolderPath, 'prompt.json'))
    }

    get cacheFolder(): AbsolutePath {
        return this.st.cacheFolderPath
    }

    // private outputs: WsMsgExecuted[] = []
    // images: ImageL[] = []

    done = false

    /** @internal update pointer to the currently executing node */
    onExecuting = (msg: WsMsgExecuting) => {
        // 1. mark currentExecutingNode as done
        if (this.currentExecutingNode) {
            this.currentExecutingNode.status = 'done'
            // this.currentExecutingNode.updatedAt = Date.now() + 1000
        }
        // 2. then two cases:
        // 2.A. no node => the prompt is done
        if (msg.data.node == null) {
            this.currentExecutingNode = null
            this.done = true
            return
        }

        this.done = false
        // 2.B. a node => node evaluation is starting
        const node = this.getNodeOrCrash(msg.data.node)
        this.currentExecutingNode = node
        node.status = 'executing'
        node.updatedAt = Date.now()
    }

    onExecutionCached = (msg: WsMsgExecutionCached) => {
        for (const x of msg.data.nodes) {
            const node = this.getNodeOrCrash(x)
            node.status = 'cached'
        }
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

    // @deprecated
    get flowSummaryMd(): MDContent {
        return asMDContent([`<pre class="mermaid">`, this.toMermaid(), `</pre>`].join('\n'))
    }

    // @deprecated
    get flowSummaryHTML(): HTMLContent {
        // https://mermaid.js.org/config/usage.html
        return asHTMLContent(marked(this.flowSummaryMd) as string)
    }

    _uidNumber = 0
    // private _nextUID = 1
    // getUID = () => (this._nextUID++).toString()
    getNodeOrCrash = (nodeID: ComfyNodeID): ComfyNode<any> => {
        const node = this.nodesIndex.get(nodeID)
        if (node == null) throw new Error('Node not found:' + nodeID)
        return node
    }
    getNode = (nodeID: ComfyNodeID): Maybe<ComfyNode<any>> => {
        const node = this.nodesIndex.get(nodeID)
        return node
    }

    /** visjs JSON format (network visualisation) */
    get JSON_forVisDataVisualisation(): { nodes: VisNodes[]; edges: VisEdges[] } {
        const json: ComfyPromptJSON = this.json_forPrompt('use_stringified_numbers_only')
        const schemas: ComfySchemaL = this.schema
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

    // ------------------------

    /** workflows are created by steps (app/draft/step) */
    stepRef = new LiveRefOpt<this, StepL>(this, 'stepID', () => this.st.db.steps)

    /** workflows are created by steps (app/draft/step) */
    get step(): Maybe<StepL> {
        return this.stepRef.item
    }

    sendPromptAndWaitUntilDone = async (p: PromptSettings = {}) => {
        const prompt = await this.sendPrompt(p)
        await prompt.finished
        return prompt
    }

    sendPrompt = async (p: PromptSettings = {}): Promise<ComfyPromptL> => {
        const step = this.step
        const liveGraph = this
        const currentJSON = deepCopyNaive(liveGraph.json_forPrompt(p.idMode ?? 'use_stringified_numbers_only'))
        const debugWorkflow = liveGraph.json_workflow()
        console.info('checkpoint:' + JSON.stringify(currentJSON))

        const out: ApiPromptInput = {
            client_id: this.st.comfySessionId,
            extra_data: {
                extra_pnginfo: {
                    // regular ComfyUI metadat
                    workflow: debugWorkflow,

                    // Cushy metadata
                    cushy_app_id: this.step?.data.appID,
                    // cushy_draft_result: this.step?.data.formResult,
                    cushy_draft_serial: this.step?.data.formSerial,
                },
            },
            prompt: currentJSON,
        }

        // 🔶 not waiting here, because output comes back from somewhere else
        // TODO: but we may want to catch error here to fail early
        // otherwise, we might get stuck
        const promptEndpoint = `${this.st.getServerHostHTTP()}/prompt`
        console.info('sending prompt to ' + promptEndpoint)

        // meh  --------------------------------------------
        // this.update({ comfyPromptJSON: currentJSON })
        // -------------------------------------------------

        const graph = this.st.db.graphs.create({
            //
            comfyPromptJSON: currentJSON,
            metadata: this.data.metadata,
            stepID: step?.id,
        })
        const res = await fetch(promptEndpoint, {
            method: 'POST',
            body: JSON.stringify(out),
        })
        const prompmtInfo: PromptInfo = await res.json()
        // console.log('prompt status', res.status, res.statusText, prompmtInfo)
        // this.step.addOutput({ type: 'prompt', promptID: prompmtInfo.prompt_id })
        if (res.status !== 200) {
            const err = new InvalidPromptError('ComfyUI Prompt request failed', graph, prompmtInfo)
            return Promise.reject(err)
        } else {
            const prompt = this.st.db.comfy_prompts.create({
                id: prompmtInfo.prompt_id,
                executed: 0,
                graphID: graph.id,
                stepID: bang(step).id, // 🔴
                // quality: p.saveFormat?.quality,
                // format: p.saveFormat?.format,
            })

            // 🔶 only live while app is running
            prompt.saveFormat = p.saveFormat
            return prompt
        }
    }
}
