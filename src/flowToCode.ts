import flow from './flow.json' assert { type: 'json' }
import { TEdge, toposort } from './toposort.ts'

const ids = flow.nodes.map((n) => n.id.toString())
const edges: TEdge[] = []

flow.links.forEach((link) => {
    edges.push(
        [
            //
            link[1].toString(),
            link[3].toString(),
        ] as TEdge,
    )
})

const order = toposort(ids, edges)
// console.log({ order })
let out: string = `import * as rt from './builder.ts'\n`
const p = (text: string) => out += text + '\n'

for (const nodeID of order) {
    // console.log(nodeID)
    const node = flow.nodes.find((n) => nodeID === n.id.toString())
    if (node == null) throw new Error('node not found')
    p(`const node${nodeID} = new rt.${node.type}({`)
    for (const i of (node.inputs ?? [])) {
        p(`${i.name}: 0 as any,`)
    }
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
