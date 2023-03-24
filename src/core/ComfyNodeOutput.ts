import { ComfyNode } from './CSNode'

export class ComfyNodeOutput<T, Ix extends number = number> {
    constructor(
        //
        public node: ComfyNode<any>,
        public slotIx: Ix,
        public type: T,
    ) {}
}
