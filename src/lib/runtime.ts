export type NodeUID = string
export class NodeOutput<T> {
    constructor(
        //
        public node: ComfyNode<any>,
        public slotIx: number,
        public type: T,
    ) {}
}

export abstract class ComfyBase {
    nodes = new Map<string, ComfyNode<any>>()
    toJSON() {
        const nodes = Array.from(this.nodes.values())
        const out: { [key: string]: any } = {}
        for (const node of nodes) {
            out[node.uid] = node.toJSON()
        }
        return out
    }
}

let nextUID = 1

export abstract class ComfyNode<ComfyNode_input extends object> {
    toJSON() {
        const out: any = {}
        for (const [k, v] of Object.entries(this.p)) {
            out[k] = v instanceof NodeOutput ? [v.node.uid, v.slotIx] : v
        }
        return {
            inputs: out,
            class_type: this.constructor.name,
        }
    }
    constructor(
        //
        public comfy: ComfyBase,
        public uid: string = (nextUID++).toString(),
        public p: ComfyNode_input,
    ) {
        this.comfy.nodes.set(this.uid.toString(), this)
    }
}

export type NodeJSON = {
    inputs: { [key: string]: any }
    class_type: string
}
