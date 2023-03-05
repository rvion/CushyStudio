export type NodeUID = string
export class NodeOutput<T> {
    constructor(
        //
        public node: ComfyNode<any>,
        public slotIx: number,
        public type: T,
    ) {}
}

/** top level base class */
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

type ApiPromptInput = {
    client_id: '608cdd92650d442297aa857f5f93a27f'
    extra_data: { extra_pnginfo: any }
    prompt: any
}
/** base node api */
export abstract class ComfyNode<ComfyNode_input extends object> {
    async get() {
        const out: ApiPromptInput = {
            client_id: '608cdd92650d442297aa857f5f93a27f',
            extra_data: { extra_pnginfo: { it: 'works' } },
            prompt: this.comfy.toJSON(),
        }
        const res = await fetch('http://192.168.1.19:8188/prompt', {
            method: 'POST',
            body: JSON.stringify(out),
        })
        // console.log(res)
    }

    toJSON(): NodeJSON {
        const out: { [key: string]: any } = {}
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
