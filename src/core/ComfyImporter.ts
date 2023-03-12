// import flow from '../compiler/entry.in.json' assert { type: 'json' }
import { CodeBuffer } from './CodeBuffer'
import { ComfyNodeType } from './Comfy'
import { ComfyClient } from './ComfyClient'
import { ComfyPromptJSON } from './ComfyPrompt'
import { ComfyNodeSchema } from './ComfySchema'
import { jsEscapeStr } from './ComfyUtils'
import { TEdge, toposort } from './toposort'

/** Converts Comfy JSON prompts to ComfyScript code */
export class ComfyImporter {
    constructor(public client: ComfyClient) {}
    convertFlowToCode = (flow: ComfyPromptJSON): string => {
        const flowNodes = Object.entries(flow)
        const ids = Object.keys(flow)
        const edges: TEdge[] = []
        const schema = this.client.schema
        for (const [id, node] of flowNodes) {
            // const cls: ComfyNodeSchema = schema.nodesByName[node.class_type]
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
        p(`export {}`)
        // p(`import { Comfy } from '../core/dsl'\n`)
        // p(`export const demo = new Comfy()`)

        // const nodeCounter: { [nodeType: string]: number } = {}
        const generatedName = new Map<string, string>()
        const availableSignals = new Map<string, string>()

        for (const nodeID of sortedNodes) {
            // @ts-ignore
            const node = flow[nodeID]
            const classType = node.class_type
            const varName = `${classType}_${nodeID}`
            generatedName.set(nodeID, varName)
            const schema: ComfyNodeSchema = this.client.schema.nodesByName[classType as ComfyNodeType]
            let outoutIx = 0
            for (const o of schema.outputs ?? []) {
                availableSignals.set(`${nodeID}-${outoutIx++}`, `${varName}.${o.name}`)
            }

            if (node == null) throw new Error('node not found')
            pi(`const ${varName} = C.${classType}({`)
            for (const [name, value] of Object.entries(node.inputs) ?? []) {
                const isValidJSIdentifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)
                const name2 = isValidJSIdentifier ? name : `'${name}'`
                if (Array.isArray(value)) {
                    const signal = availableSignals.get(value.join('-'))
                    pi(`${name2}: ${signal}, `)
                } else {
                    pi(`${name2}: ${jsEscapeStr(value)}, `)
                }
            }
            p(`}, '${nodeID}')`)
        }

        p('await C.get()')
        // b.writeTS('./src/compiler/entry.ts')
        return b.content
    }
}
