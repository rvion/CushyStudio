import flow from './entry.in.json' assert { type: 'json' }
import { nodes, NodeType } from '../lib/builder'
import { TEdge, toposort } from '../utils/toposort'
import { jsEscapeStr } from '../utils/jsEscapeStr'
import { CodeBuffer } from '../generator/CodeBuffer'

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
            // console.log(from, to)
            edges.push([from, to] as TEdge)
        }
    }
}
console.log(`1. toposrt (${edges.map((e) => e.join('->')).join(',')})`)
const sortedNodes = toposort(ids, edges)
const b = new CodeBuffer()
const p = b.w
const pi = b.append
p(`import {Comfy} from '../2-lib/builder.ts'`)
p(`export const demo = new Comfy()`)

// const nodeCounter: { [nodeType: string]: number } = {}
const generatedName = new Map<string, string>()
const availableSignals = new Map<string, string>()

for (const nodeID of sortedNodes) {
    // @ts-ignore
    const node = flow[nodeID]
    const classType = node.class_type
    const varName = `${classType}_${nodeID}`
    generatedName.set(nodeID, varName)
    const cls = nodes[classType as NodeType]
    let outoutIx = 0
    for (const o of cls.outputs ?? []) {
        availableSignals.set(`${nodeID}-${outoutIx++}`, `${varName}.${o.name}`)
    }

    if (node == null) throw new Error('node not found')
    pi(`export const ${varName} = demo.${classType}({`)
    for (const [name, value] of Object.entries(node.inputs) ?? []) {
        if (Array.isArray(value)) {
            const signal = availableSignals.get(value.join('-'))
            pi(`${name}: ${signal}, `)
        } else pi(`${name}: ${jsEscapeStr(value)}, `)
    }
    p(`}, '${nodeID}')`)
}

b.writeTS('./src/loader/b.ts')
