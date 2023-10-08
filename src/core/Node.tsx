import type { ComfyNodeJSON } from '../types/ComfyPrompt'
import type { NodeProgress, _WsMsgExecutedData } from '../types/ComfyWsApi'
import type { GraphL } from '../models/Graph'

import { configure, extendObservable, makeAutoObservable, toJS } from 'mobx'
import { ComfyNodeID } from '../types/NodeUID'
import { exhaust } from '../utils/ComfyUtils'
import { ComfyNodeSchema, NodeInputExt, NodeOutputExt } from '../models/Schema'
import { Slot } from './Slot'
import { comfyColors } from './Colors'
import { auto_ } from './autoValue'

configure({ enforceActions: 'never' })

type NodeExecutionStatus = 'executing' | 'done' | 'error' | 'waiting' | 'cached' | null

/** ComfyNode
 * - correspond to a signal in the graph
 * - belongs to a script
 */
export class ComfyNode<ComfyNode_input extends object> {
    // artifacts: _WsMsgExecutedData[] = []
    // images: GeneratedImage[] = []
    progress: NodeProgress | null = null
    $schema: ComfyNodeSchema
    status: NodeExecutionStatus = null
    json: ComfyNodeJSON

    get isExecuting() { return this.status === 'executing' } // prettier-ignore
    get statusEmoji() {
        const s = this.status
        if (s === 'executing') return '🔥'
        if (s === 'cached') return '✅' //'💾'
        if (s === 'done') return '✅'
        if (s === 'error') return '❌'
        if (s === 'waiting') return '⏳'
        if (s == null) return '❓'
        return exhaust(s)
    }

    disabled: boolean = false
    disable() {
        this.disabled = true
    }

    get inputs(): ComfyNode_input {
        return this.json.inputs as any
    }

    /** update a node */
    set(p: Partial<ComfyNode_input>) {
        const cyto = this.graph.cyto
        for (const [key, value] of Object.entries(p)) {
            const next = this.serializeValue(key, value)
            const prev = this.json.inputs[key]
            if (next === prev) continue
            // 🔴
            if (cyto && Array.isArray(next) && Array.isArray(prev)) {
                cyto?.removeEdge(`${prev[0]}-${key}->${this.uid}`)
                cyto?.addEdge({ sourceUID: next[0], targetUID: this.uid, input: key })
            }
            this.json.inputs[key] = next as any // 🔴
        }
        // 🔴 wrong resonsibility
        // console.log('CHANGES', changes)
    }

    get color(): string {
        return comfyColors[this.$schema.category]
    }

    // static X: number = 1
    uidNumber: number
    $outputs: Slot<any>[] = []
    constructor(
        //
        public graph: GraphL,
        public uid: string, //  = graph.getUID(),
        jsonExt: ComfyNodeJSON,
    ) {
        this.uidNumber = this.graph._uidNumber++
        if (jsonExt == null) throw new Error('invariant violation: jsonExt is null')
        // this.json = graph.data.comfyPromptJSON[uid]
        // if (this.json == null) graph.data.comfyPromptJSON = {}
        // console.log('CONSTRUCTING', xxx.class_type, uid)

        // this.uidNumber = parseInt(uid) // 🔴 ugly
        this.$schema = graph.schema.nodesByNameInComfy[jsonExt.class_type]
        let ix = 0

        // 🔶 1 this declare the json locally,
        // but Node are not live instances, they're local subinstances to a LiveGraph
        this.json = this._convertPromptExtToPrompt(jsonExt)
        // 🔶 2 so we need to ensure the json is properly synced with the LiveGraph data
        // register node ensure this
        this.graph.registerNode(this)

        makeAutoObservable(this)

        // dynamically add properties for every outputs
        const extensions: { [key: string]: any } = {}
        for (const x of this.$schema.outputs) {
            const output = new Slot(this, ix++, x.nameInCushy)
            extensions[x.nameInCushy] = output
            this.$outputs.push(output)
            // console.log(`  - .${x.nameInCushy} as ComfyNodeOutput(${ix})`)
        }

        // implements the _<typeName> property
        for (const x of this.$schema.singleOuputs) {
            extensions[`_${x.typeName}`] = extensions[x.nameInCushy]
        }

        extendObservable(this, extensions)
        // console.log(Object.keys(Object.getOwnPropertyDescriptors(this)).join(','))
        // makeObservable(this, { artifacts: observable })
    }

    _convertPromptExtToPrompt(promptExt: ComfyNodeJSON) {
        const inputs: { [inputName: string]: any } = {}
        const _done = new Set<string>()
        for (const i of this.$schema.inputs) {
            _done.add(i.nameInComfy)
            const value = this.serializeValue(i.nameInComfy, promptExt.inputs[i.nameInComfy])
            inputs[i.nameInComfy] = value
        }
        for (const [nameInComfy, rawVal] of Object.entries(promptExt.inputs)) {
            if (_done.has(nameInComfy)) continue
            const value = this.serializeValue(nameInComfy, rawVal)
            inputs[nameInComfy] = value
        }
        return { class_type: this.$schema.nameInComfy, inputs }
    }

    /** return the list of nodes piped into this node */
    _incomingNodes() {
        const incomingNodes: ComfyNodeID[] = []
        for (const [_name, val] of Object.entries(this.inputs)) {
            if (val instanceof Array) {
                const [from, _slotIx] = val
                incomingNodes.push(from)
            }
        }
        return incomingNodes
    }
    _incomingEdges() {
        const incomingEdges: { from: ComfyNodeID; inputName: string }[] = []
        for (const [inputName, val] of Object.entries(this.inputs)) {
            if (val instanceof Array) {
                const [from, _slotIx] = val
                incomingEdges.push({ from, inputName })
            }
        }
        return incomingEdges
    }

    // dimensions for autolayout algorithm
    get width() { return 300 } // prettier-ignore
    get height() {
        const inputHeights = this.$schema.inputs.map((i) => {
            if (i.opts == null) return 30
            const opts = typeof i.opts === 'object' ? i.opts : {}
            return opts?.multiline ? 40 : 30
        })
        const total = inputHeights.reduce((a, b) => a + b, 0)
        return total + 30
    }

    serializeValue(field: string, value: unknown): unknown {
        if (value == null) {
            const schema = this.$schema.inputs.find((i: NodeInputExt) => i.nameInComfy === field)
            if (schema == null) throw new Error(`🔴 no schema for field "${field}" (of node ${this.$schema.nameInCushy})`)
            // console.log('def1=', field, schema.opts.default)
            const opts = schema.opts == null || typeof schema.opts !== 'object' ? undefined : schema.opts
            if (opts?.default != null) return opts.default
            // console.log('def2=', field, schema.required)
            if (!schema.required) return undefined
            throw new Error(`🔴 [serializeValue] field "${field}" (of node ${this.$schema.nameInCushy}) value is null`)
        }
        if (typeof value === 'function') {
            return this.serializeValue(field, value(this.graph.builder, this.graph))
        }
        if (value === auto_) {
            const expectedType = this._getExpecteTypeForField(field)
            console.info(`🔍 looking for type ${expectedType} for field ${field}`)
            for (const node of this.graph.nodes.slice().reverse()) {
                const output = node._getOutputForTypeOrNull(expectedType)
                if (output != null) return [node.uid, output.slotIx]
            }
            throw new Error(`🔴 [AUTO failed] field "${field}" (of node ${this.$schema.nameInCushy}) value is null`)
        }
        if (value instanceof Slot) return [value.node.uid, value.slotIx]
        if (value instanceof ComfyNode) {
            const expectedType = this._getExpecteTypeForField(field)
            const output = value._getOutputForTypeOrCrash(expectedType)
            return [value.uid, output.slotIx]
        }
        return value
    }

    private _getExpecteTypeForField(name: string): string {
        // console.log('>>name', name)
        const input = this.$schema.inputs.find((i: NodeInputExt) => i.nameInComfy === name)
        // console.log('>>name', name, input)
        if (input == null) throw new Error('🔴 input not found asdf')
        return input.type
    }

    private _getOutputForTypeOrCrash(type: string): Slot<any> {
        const i: NodeOutputExt = this.$schema.outputs.find((i: NodeOutputExt) => i.typeName === type)!
        const val = (this as any)[i.nameInCushy]
        // console.log(`this[i.name] = ${this.$schema.name}[${i.name}] = ${val}`)
        if (val instanceof Slot) return val
        throw new Error(`Expected ${i.nameInCushy} to be a NodeOutput`)
    }
    private _getOutputForTypeOrNull(type: string): Slot<any> | null {
        const i: Maybe<NodeOutputExt> = this.$schema.outputs.find((i: NodeOutputExt) => i.typeName === type)
        if (i == null) return null
        const val = (this as any)[i.nameInCushy]
        if (val == null) return null
        if (val instanceof Slot) return val
        throw new Error(`Expected ${i.nameInCushy} to be a NodeOutput`)
    }
}
