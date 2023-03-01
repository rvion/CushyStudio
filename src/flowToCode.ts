import { nodes, NodeType } from './builder.ts'
import flow from './flow.json' assert { type: 'json' }
import { TEdge, toposort } from './toposort.ts'

const ids = flow.nodes.map((n) => n.id.toString())
const edges: TEdge[] = []
for (const link of flow.links) {
    edges.push([link[1].toString(), link[3].toString()] as TEdge)
}

const sortedNodes = toposort(ids, edges)
let out: string = `import * as rt from './builder.ts'\n`
const p = (text: string) => out += text + '\n'
const pi = (text: string) => out += text

for (const nodeID of sortedNodes) {
    const node = flow.nodes.find((n) => nodeID === n.id.toString())!
    const cls = nodes[node.type as NodeType]
    if (node == null) throw new Error('node not found')
    pi(`const node${nodeID} = new rt.${node.type}({`)
    for (const x of cls.inputs) {
        pi(`${x.name}: 0 as any,`)
    }
    // for (const i of (node.inputs ?? [])) {
    //     p(`${i.name}: 0 as any,`)
    // }
    p(`})`)
}

console.log(out)
Deno.writeTextFileSync('./src/flowAsCode.ts', out)
// links have this shape:
// [
//     9, //id
//     8, // from id
//     0,// from output ix
//     9, // to id
//     0, // to input ix
//     "IMAGE" // type
// ]
