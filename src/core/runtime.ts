import type { NodeProgress } from '../client/api'

import { NodeOutput } from './NodeOutput'
import { ComfyBase } from './ComfyBase'
import { sleep } from '../utils/sleep'

export type NodeUID = string

let nextUID = 1

/** base node api */
export abstract class ComfyNode<ComfyNode_input extends object> {
    outputs: { images: string[] }[] = []
    progress: NodeProgress | null = null

    async get() {
        await this.comfy.get()
        await sleep(1000)

        // const out: ApiPromptInput = {
        //     client_id: 'dd78de15f4fb45d29166925ed85b44c0',
        //     extra_data: { extra_pnginfo: { it: 'works' } },
        //     prompt: this.comfy.toJSON(),
        // }
        // const res = await fetch('http://192.168.1.19:8188/prompt', {
        //     method: 'POST',
        //     body: JSON.stringify(out),
        // })
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
