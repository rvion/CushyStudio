type ObjMap<T> = { [key: string]: T }

export type TNode = string
export type TEdge = [TNode, TNode]

export function toposort(nodes: TNode[], edges: TEdge[]): TNode[] {
   return toposortAlgo(nodes, edges)
}

function toposortAlgo(nodes: TNode[], edges: TEdge[]) {
   let cursor = nodes.length
   const sorted = new Array(cursor)
   const visited: ObjMap<boolean> = {}
   let k = cursor

   while (k--) {
      if (!visited[k]) visit(BONG(nodes[k]), k, [])
   }

   return sorted

   function visit(node: TNode, ix: number, predecessors: TNode[]) {
      let i = ix
      if (predecessors.indexOf(node) >= 0) {
         console.log(predecessors, node)
         throw new Error('Cyclic dependency: ' + JSON.stringify(node))
      }

      if (nodes.indexOf(node) == -1) {
         throw new Error(
            '[toposort] Found unknown node. Make sure to provided all involved nodes. Unknown node: ' +
               JSON.stringify(node) +
               '; known nodes are ' +
               JSON.stringify(nodes),
         )
      }

      if (visited[i]) return
      visited[i] = true

      // outgoing edges
      const outgoing = edges.filter((edge) => edge[0] === node)
      i = outgoing.length
      if (i) {
         const preds = predecessors.concat(node)
         do {
            const child = BONG(outgoing[--i])[1]
            visit(child, nodes.indexOf(child), preds)
         } while (i)
      }

      sorted[--cursor] = node
   }
}

function BONG<T>(x: T): NonNullable<T> {
   if (x == null) throw new Error('BONG')
   return x
}
