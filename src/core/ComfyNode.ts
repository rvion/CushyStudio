import type { NodeProgress } from './ComfyAPI'
import type { ComfyGraph } from './ComfyGraph'
import type { ComfyNodeJSON } from './ComfyPrompt'

import { makeObservable, observable } from 'mobx'
import { ComfyNodeOutput } from './ComfyNodeOutput'
import { ComfyNodeSchema, NodeInputExt } from './ComfySchema'

/** ComfyNode
 * - correspond to a signal in the graph
 * - belongs to a script
 */
export class ComfyNode<ComfyNode_input extends object> {
    artifacts: { images: string[] }[] = []
    progress: NodeProgress | null = null
    $schema: ComfyNodeSchema

    constructor(
        //
        public graph: ComfyGraph,
        public uid: string = graph.getUID(),
        public json: ComfyNodeJSON,
    ) {
        this.$schema = graph.schema.nodesByName[json.class_type]
        this.graph.nodes.set(this.uid.toString(), this)
        makeObservable(this, { artifacts: observable })
    }

    get manager() { return this.graph.client } // prettier-ignore

    artifactsForStep(step: number): string[] {
        return this.artifacts[step]?.images.map((i) => `http://${this.manager.serverHost}/view/${i}`) ?? []
    }

    get allArtifactsImgs(): string[] {
        return this.artifacts //
            .flatMap((a) => a.images)
            .map((i) => `http://${this.manager.serverHost}/view/${i}`)
    }

    async get() {
        await this.graph.get()
    }

    getExpecteTypeForField(name: string): string {
        return this.$schema.inputs.find((i: NodeInputExt) => i.name === name)!.type
    }

    getOutputForType(type: string): ComfyNodeOutput<any> {
        const i: NodeInputExt = this.$schema.outputs.find((i: NodeInputExt) => i.type === type)!
        const val = (this as any)[i.name]
        if (val instanceof ComfyNodeOutput) return val
        throw new Error(`Expected ${i.name} to be a NodeOutput`)
    }

    serializeValue(field: string, value: unknown): unknown {
        if (value instanceof ComfyNodeOutput) return [value.node.uid, value.slotIx]
        if (value instanceof ComfyNode) {
            const expectedType = this.getExpecteTypeForField(field)
            const output = value.getOutputForType(expectedType)
            return [value.uid, output.slotIx]
        }
        return value
    }
}
