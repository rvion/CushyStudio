import type { ComfyNode } from '../comfyui/livegraph/ComfyNode'

export class ComfyNodeOutput<
   //
   T extends keyof Comfy.Signal,
   Ix extends number = number,
> {
   constructor(
      public node: ComfyNode<any>,
      public slotIx: Ix,
      public type: T,
   ) {}
}
