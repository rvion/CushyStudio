import { nodes, NodeType } from '../2-lib/builder.ts'
import { TEdge, toposort } from '../0-utils/toposort.ts'
import { jsEscapeStr } from '../0-utils/jsEscapeStr.ts'

import flow from './ui.json' assert { type: 'json' }

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

    const filled = new Set()
    for (const x of node.inputs ?? []) {
        pi(`${x.name}: 0 as any,`)
        filled.add(x.name)
    }
    let ix = 0
    for (const x of cls.inputs) {
        if (filled.has(x.name)) continue
        const val = node.widgets_values?.[ix++]
        const valStr = jsEscapeStr(val)
        pi(`${x.name}: ${valStr},`)
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
