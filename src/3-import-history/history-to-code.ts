import { nodes, NodeType } from '../2-lib/builder.ts'
import { TEdge, toposort } from '../0-utils/toposort.ts'
import { jsEscapeStr } from '../0-utils/jsEscapeStr.ts'

import flow from './history-entry.json' assert { type: 'json' }

const flowNodes = Object.entries(flow)
const ids = Object.keys(flow)

const edges: TEdge[] = []
for (const [id, node] of flowNodes) {
    const cls = nodes[node.class_type as NodeType]
    const inputs = Object.entries(node.inputs)
    for (const [name, input] of inputs) {
        if (Array.isArray(input)) {
            const from = input[0]
            const to = id
            console.log(from, to)
            edges.push([from, to] as TEdge)
        }
    }
}

const sortedNodes = toposort(ids, edges)
let out: string = `import * as rt from './builder.ts'\n`
const p = (text: string) => out += text + '\n'
const pi = (text: string) => out += text

// const nodeCounter: { [nodeType: string]: number } = {}
const generatedName = new Map<string, string>()
const availableSignals = new Map<string, string>()

for (const nodeID of sortedNodes) {
    // @ts-ignore
    const node = flow[nodeID]
    const classType = node.class_type
    // const nth = nodeCounter[classType] ??= 0
    const varName = `${classType}_${nodeID}`
    generatedName.set(nodeID, varName)
    // nodeCounter[classType]++
    console.log(nodeID, classType)
    const cls = nodes[classType as NodeType]
    console.log(classType, ' => ', cls.outputs)
    // const outputs = cls.outputs
    let outoutIx = 0
    for (const o of cls.outputs ?? []) {
        console.log('🟢', `${nodeID}-${outoutIx} = ${varName}.${o.name}`)
        availableSignals.set(`${nodeID}-${outoutIx++}`, `${varName}.${o.name}`)
    }

    if (node == null) throw new Error('node not found')
    pi(`const ${varName} = new rt.${classType}({`)
    for (const [name, value] of Object.entries(node.inputs) ?? []) {
        if (Array.isArray(value)) {
            const signal = availableSignals.get(value.join('-'))
            pi(`${name}: ${signal}, `)
        } else pi(`${name}: ${jsEscapeStr(value)}, `)
    }
    p(`})`)
}

console.log(out)
Deno.writeTextFileSync('.src/3-import-history/history-entry-as-code.ts', out)
// links have this shape:
// [
//     9, //id
//     8, // from id
//     0,// from output ix
//     9, // to id
//     0, // to input ix
//     "IMAGE" // type
// ]
