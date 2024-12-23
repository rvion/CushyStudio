import type { LiteGraphNode } from '../comfyui/litegraph/LiteGraphNode'

export class UnknownCustomNode extends Error {
   constructor(public node: LiteGraphNode) {
      super(
         `❌ node ${node.id}(${node.type}) has no known schema; you probably need to install some custom node`,
      )
   }
}
