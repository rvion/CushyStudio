import { nodes, NodeType } from '../lib/builder'
import { TEdge, toposort } from '../utils/toposort'
import { jsEscapeStr } from '../utils/jsEscapeStr'

import flow from './ui.json' assert { type: 'json' }
import { CodeBuffer } from '../generator/CodeBuffer'

const ids = flow.nodes.map((n) => n.id.toString())
const edges: TEdge[] = []
for (const link of flow.links) {
    edges.push([link[1].toString(), link[3].toString()] as TEdge)
}

const sortedNodes = toposort(ids, edges)
const b = new CodeBuffer()
b.w(`import * as rt from './builder.ts'\n`)

for (const nodeID of sortedNodes) {
    const node = flow.nodes.find((n) => nodeID === n.id.toString())!
    const cls = nodes[node.type as NodeType]
    if (node == null) throw new Error('node not found')
    b.w(`const node${nodeID} = new rt.${node.type}({`)

    const filled = new Set()
    for (const x of node.inputs ?? []) {
        b.w(`${x.name}: 0 as any,`)
        filled.add(x.name)
    }
    let ix = 0
    for (const x of cls.inputs) {
        if (filled.has(x.name)) continue
        const val = node.widgets_values?.[ix++]
        const valStr = jsEscapeStr(val)
        b.w(`${x.name}: ${valStr},`)
    }
    // for (const i of (node.inputs ?? [])) {
    //     p(`${i.name}: 0 as any,`)
    // }
    b.w(`})`)
}

b.writeTS('./src/flowAsCode.ts')
// links have this shape:
// [
//     9, //id
//     8, // from id
//     0,// from output ix
//     9, // to id
//     0, // to input ix
//     "IMAGE" // type
// ]
