import { ComfyNode } from './ComfyNode'

export class NodeOutput<T> {
    constructor(
        //
        public node: ComfyNode<any>,
        public slotIx: number,
        public type: T,
    ) {}
}
