import { CodeBuffer } from '../utils/CodeBuffer'
import { Workspace } from '../core-back/Workspace'
import { ComfyPromptJSON } from '../core-types/ComfyPrompt'
import { ComfyNodeSchema } from '../core-shared/Schema'
import { jsEscapeStr } from '../utils/jsEscapeStr'
import { TEdge, toposort } from '../utils/toposort'
import { loggerExt } from '../logger/LoggerBack'

/** Converts Comfy JSON prompts to ComfyScript code */
type RuleInput = { nodeName: string; inputName: string; valueStr: string }

export class ComfyImporter {
    constructor(public client: Workspace) {}
    UI_ONLY_ATTRIBUTES = [
        //
        'Random seed after every gen',
    ]
    RULES: ((p: RuleInput) => void)[] = [
        (p) => {
            if (
                //
                p.nodeName === 'KSampler' &&
                p.inputName === 'sampler_name' &&
                p.valueStr.startsWith('sample_')
            ) {
                p.valueStr = p.valueStr.replace('sample_', '')
            }
        },
    ]

    knownAliaes: { [key: string]: string } = {
        LatentUpscaleBy: 'Latent Upscale by Factor (WAS)',
    }

    convertFlowToCode = (
        //
        title: string,
        flow: ComfyPromptJSON,
        opts: { preserveId: boolean },
    ): string => {
        const flowNodes = Object.entries(flow)
        const ids = Object.keys(flow)
        const edges: TEdge[] = []
        for (const [id, node] of flowNodes) {
            // const cls: ComfyNodeSchema = schema.nodesByName[node.class_type]
            const inputs = Object.entries(node.inputs)
            for (const [_name, input] of inputs) {
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
        p(`WORKFLOW('${title}', async (C) => {\n`)
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
            const schema: ComfyNodeSchema =
                this.client.schema.nodesByNameInComfy[classType] ?? //
                this.client.schema.nodesByNameInComfy[this.knownAliaes[classType]]
            if (schema == null) {
                const msg = `schema not found for ${classType}`
                loggerExt.error('🔥', msg)
                throw new Error(msg)
            }
            let outoutIx = 0
            for (const o of schema.outputs ?? []) {
                availableSignals.set(`${nodeID}-${outoutIx++}`, `${varName}.${o.name}`)
            }

            if (node == null) throw new Error('node not found')
            pi(`    const ${varName} = C.${classType}({`)
            for (const [name, value] of Object.entries(node.inputs) ?? []) {
                const isValidJSIdentifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)
                if (this.UI_ONLY_ATTRIBUTES.includes(name)) continue

                const valueStr = Array.isArray(value) //
                    ? availableSignals.get(value.join('-'))
                    : value

                // apply rules
                let draft: RuleInput = { inputName: name, nodeName: classType, valueStr }
                for (const rule of this.RULES) rule(draft)

                // escape name if needed
                const name2 = isValidJSIdentifier ? name : `'${name}'`

                if (Array.isArray(value)) {
                    // const signal = availableSignals.get(value.join('-'))
                    pi(`${name2}: ${draft.valueStr}, `)
                } else {
                    pi(`${name2}: ${jsEscapeStr(draft.valueStr)}, `)
                }
            }
            p(`}, '${nodeID}')`)
        }

        p('    await flow.PROMPT()')
        p('})')
        // b.writeTS('./src/compiler/entry.ts')
        return b.content
    }
}
