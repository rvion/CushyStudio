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

let number = 1

export abstract class ComfyNode<ComfyNode_input> {
    uid = number++
    toJSON() {
        return {}
    }
    constructor(
        //
        public comfy: ComfyBase,
        public p: ComfyNode_input,
    ) {
        this.comfy
    }
}

export type NodeJSON = {
    inputs: { [key: string]: any }
    class_type: string
}
