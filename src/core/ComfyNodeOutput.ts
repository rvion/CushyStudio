import { ComfyNode } from './ComfyNode'

export class ComfyNodeOutput<T> {
    constructor(
        //
        public node: ComfyNode<any>,
        public slotIx: number,
        public type: T,
    ) {}
}
