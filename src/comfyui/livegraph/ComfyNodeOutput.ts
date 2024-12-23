import type { ComfyNode } from './ComfyNode'

export class ComfyNodeOutput<
   //
   T extends keyof Comfy.Signal,
   Ix extends number = number,
> {
   constructor(
      public node: ComfyNode<any>,
      public slotIx: Ix,
      public type: T,
      /**
       * as of 2024-11-16, output slots have no name in comfy, only a type.
       * Problem is that some nodes have multiple outputs of the same type.
       * so subsequent outputs with a previous used name will be suffixed
       * and have named like `output_2`, `output_3`, etc.
       */
      public name: string,
   ) {}
}
