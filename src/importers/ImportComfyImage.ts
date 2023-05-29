import { CodeBuffer } from '../utils/CodeBuffer'
import { ComfyPromptJSON } from '../types/ComfyPrompt'
import { ComfyNodeSchema } from '../models/Schema'
import { jsEscapeStr } from '../utils/jsEscapeStr'
import { TEdge, toposort } from '../utils/toposort'
import { normalizeJSIdentifier } from '../core/normalizeJSIdentifier'
import { logger } from '../logger/logger'
import { STATE } from 'src/front/FrontState'

/** Converts Comfy JSON prompts to ComfyScript code */
type RuleInput = { nodeName: string; inputName: string; valueStr: string }

export class ComfyImporter {
    constructor(public client: STATE) {}

    // ATTRIBUTE TO IGNORE
    UI_ONLY_ATTRIBUTES = [
        //
        'Random seed after every gen',
    ]

    // ATTRIBUTE THAT HAD AN OTHER NAME BEFORE
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

    naneDedupeCache: { [key: string]: number } = {}

    /** handles hygenic naming  */

    mkVarNameForNodeType = (
        //
        nodeType: string,
        nameOfInputsItsPluggedInto: string[],
    ): string => {
        if (nodeType === 'CheckpointLoaderSimple') return this.finalizeName('ckpt')
        if (nameOfInputsItsPluggedInto.length === 1) {
            return this.finalizeName(nameOfInputsItsPluggedInto[0])
        }
        return this.finalizeName(nodeType)
    }

    private finalizeName = (rawName: string) => {
        const final = this.smartTrim(this.smartDownCase(rawName))
        if (this.naneDedupeCache[final] == null) {
            this.naneDedupeCache[final] = 1
            return final
        } else {
            return `${final}_${this.naneDedupeCache[final]++}`
        }
    }

    private smartDownCase = (x: string) => {
        const isAllCaps = x === x.toUpperCase()
        if (isAllCaps) return x.toLowerCase()
        return x[0].toLowerCase() + x.slice(1)
    }

    /** trim useless suffixes, like _name */
    private smartTrim = (x: string) => {
        if (x !== 'Loader' && x.endsWith('Loader')) return x.slice(0, -6)
        if (x !== 'Image' && x.endsWith('Image')) return x.slice(0, -5)
        return x
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
        p(`WORKFLOW('${title}', async ({graph, flow}) => {\n`)
        // p(`import { Comfy } from '../core/dsl'\n`)
        // p(`export const demo = new Comfy()`)

        // const nodeCounter: { [nodeType: string]: number } = {}
        const generatedName = new Map<string, string>()
        const availableSignals = new Map<string, string>()

        for (const nodeID of sortedNodes) {
            // @ts-ignore
            const node = flow[nodeID]
            const classType = normalizeJSIdentifier(node.class_type)

            const varName = this.mkVarNameForNodeType(classType, []) //`${classType}_${nodeID}`

            generatedName.set(nodeID, varName)
            const schema: ComfyNodeSchema =
                this.client.schema.nodesByNameInCushy[classType] ?? //
                this.client.schema.nodesByNameInCushy[this.knownAliaes[classType]]
            if (schema == null) {
                const msg = `schema not found for ${classType}`
                logger().error('🔥', msg)
                logger().error('🔥', `known schemas: ${Object.keys(this.client.schema.nodesByNameInCushy).join(', ')}`)
                throw new Error(msg)
            }
            let outoutIx = 0
            for (const o of schema.outputs ?? []) {
                availableSignals.set(`${nodeID}-${outoutIx++}`, `${varName}.${o.name}`)
            }

            if (node == null) throw new Error('node not found')
            pi(`    const ${varName} = graph.${classType}({`)
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
            if (opts.preserveId) p(`}, '${nodeID}')`)
            else p(`})`)
        }

        p('    await flow.PROMPT()')
        p('})')
        // b.writeTS('./src/compiler/entry.ts')
        return b.content
    }
}
