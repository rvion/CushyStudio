import { CodeBuffer } from '../utils/CodeBuffer'
import { ComfyPromptJSON } from '../types/ComfyPrompt'
import { ComfyNodeSchema, NodeInputExt } from '../models/Schema'
import { jsEscapeStr } from '../utils/jsEscapeStr'
import { TEdge, toposort } from '../utils/toposort'
import { normalizeJSIdentifier } from '../core/normalizeJSIdentifier'
import { STATE } from 'src/front/state'
import { asJSAccessor, escapeJSKey } from '../models/escapeJSKey'
import { Namer } from './Namer'
import { ComfyPrimitiveMapping } from '../core/Primitives'

/** Converts Comfy JSON prompts to ComfyScript code */
type RuleInput = {
    nodeName: string
    inputName: string
    valueStr: string | number | boolean | null | undefined
}

export class ComfyImporter {
    constructor(public st: STATE) {}

    // -----------------------------------------------------------------------------
    // ATTRIBUTE TO IGNORE
    UI_ONLY_ATTRIBUTES = [
        //
        'Random seed after every gen',
        'choose file to upload',
    ]

    // ATTRIBUTE THAT HAD AN OTHER NAME BEFORE
    RULES: ((p: RuleInput) => void)[] = [
        (p) => {
            if (
                //
                p.nodeName === 'KSampler' &&
                p.inputName === 'sampler_name' &&
                typeof p.valueStr === 'string' &&
                p.valueStr.startsWith('sample_')
            ) {
                p.valueStr = p.valueStr.replace('sample_', '')
            }
        },
    ]

    knownAliaes: { [key: string]: string } = {
        LatentUpscaleBy: 'Latent Upscale by Factor (WAS)',
    }
    // -----------------------------------------------------------------------------

    nameDedupeCache: { [key: string]: number } = {}

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
        if (this.nameDedupeCache[final] == null) {
            this.nameDedupeCache[final] = 1
            return final
        } else {
            return `${final}_${this.nameDedupeCache[final]++}`
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

    convertPromptToCode = (
        flow: ComfyPromptJSON,
        opts: {
            title: string
            author: string
            preserveId: boolean
            autoUI: boolean
        },
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
        const bRun = new CodeBuffer()
        const bUI = new CodeBuffer()
        const { w: p, append: pi } = b
        const { w: pRun, append: piRun } = bRun
        const { w: pUI, append: piUI } = bUI
        type UIVal = {
            typeofValue: string
            schema: NodeInputExt | undefined
            name: string
            nameEscaped: string
            default: string | number | boolean | null | undefined
        }
        const uiVals: UIVal[] = []

        p(`action('${opts.title}', { `)
        p(`    author: '${opts.author}',`)
        pRun(`    run: async (flow, p) => {`)
        pRun(`        const graph = flow.nodes`)
        // p(`import { Comfy } from '../core/dsl'\n`)
        // p(`export const demo = new Comfy()`)

        // const nodeCounter: { [nodeType: string]: number } = {}
        const generatedName = new Map<string, string>()
        const availableSignals = new Map<string, string>()
        const pNamer = new Namer()

        for (const nodeID of sortedNodes) {
            // @ts-ignore
            const node = flow[nodeID]
            const classType = normalizeJSIdentifier(node.class_type, ' ')
            const varName = this.mkVarNameForNodeType(classType, []) //`${classType}_${nodeID}`

            generatedName.set(nodeID, varName)
            const schema: ComfyNodeSchema =
                this.st.schema.nodesByNameInCushy[classType] ?? //
                this.st.schema.nodesByNameInCushy[this.knownAliaes[classType]]
            if (schema == null) {
                const msg = `schema not found for ${classType}`
                console.error('🔥', msg)
                console.error('🔥', `known schemas: ${Object.keys(this.st.schema.nodesByNameInCushy).join(', ')}`)
                throw new Error(msg)
            }
            let outoutIx = 0
            for (const o of schema.outputs ?? []) {
                const isValid1234 = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(o.nameInCushy)
                availableSignals.set(
                    `${nodeID}-${outoutIx++}`,
                    isValid1234 //
                        ? `${varName}.outputs.${o.nameInCushy}`
                        : `${varName}.outputs["${o.nameInCushy}"]`,
                )
            }

            if (node == null) throw new Error('node not found')
            piRun(`        const ${varName} = graph.${classType}({`)

            // name of the group of fields where primitive input for this node
            // will be added to the form
            const inputGroupName = pNamer.name(`${node.class_type}`)

            for (const [name, value] of Object.entries(node.inputs) ?? []) {
                const isValidJSIdentifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)
                if (this.UI_ONLY_ATTRIBUTES.includes(name)) continue

                const valueStr = Array.isArray(value) //
                    ? availableSignals.get(value.join('-'))
                    : value

                // apply rules
                let draft: RuleInput = {
                    inputName: name,
                    nodeName: classType,
                    valueStr,
                }
                for (const rule of this.RULES) rule(draft)

                // escape name if needed
                const name2 = isValidJSIdentifier ? name : `'${name}'`

                if (Array.isArray(value)) {
                    // const signal = availableSignals.get(value.join('-'))
                    piRun(`${name2}: ${draft.valueStr}, `)
                } else {
                    if (opts.autoUI) {
                        const inputSchema = schema.inputs.find((x) => x.nameInComfy === name)
                        // if (inputSchema == null) debugger
                        const inputName = pNamer.name(`${node.class_type}_${name}`)
                        const uiVal: UIVal = {
                            typeofValue: valueStr == null ? typeof valueStr : 'strOpt',
                            name: inputName,
                            schema: inputSchema,
                            nameEscaped: escapeJSKey(inputName),
                            default: valueStr,
                        }
                        uiVals.push(uiVal)
                        piRun(`${name2}: ${renderAdapterForInput(uiVal)}, `)
                    } else {
                        piRun(`${name2}: ${jsEscapeStr(draft.valueStr)}, `)
                    }
                }
            }
            if (opts.preserveId && false) pRun(`}, '${nodeID}')`)
            else pRun(`})`)
        }

        pRun('        await flow.PROMPT()')
        pRun('    },')
        pUI(`    ui: (ui) => ({`)

        function renderAdapterForInput(x: UIVal) {
            const s = x.schema
            const inputName = x.name
            if (s == null) return `null`
            if (s.type === 'Enum_LoadImage_image') return `await flow.loadImageAnswerAsEnum(p${asJSAccessor(inputName)})`
            return `p${asJSAccessor(inputName)}`
        }
        function renderUIForInput(x: UIVal) {
            const s = x.schema
            // no schema, let's try to infer the type from the value
            if (s == null) {
                return `ui.${x.typeofValue}({default: ${jsEscapeStr(x.default)}})`
            }
            if (s.type === 'Enum_LoadImage_image') {
                return `ui.image({default: ${jsEscapeStr(x.default)}})`
            }
            if (s.type.startsWith('Enum_')) {
                return `ui.enum({default: ${jsEscapeStr(x.default)}, enumName: ${JSON.stringify(s.type)}})`
            }
            if (s.type in ComfyPrimitiveMapping) {
                let builderFnName = ComfyPrimitiveMapping[s.type]
                if (!s.required) builderFnName += 'Opt'
                return `ui.${builderFnName}({default: ${jsEscapeStr(x.default)}})`
            }
        }
        for (const x of uiVals) {
            pUI(`         ${x.nameEscaped}: ${renderUIForInput(x)} /* ${x.schema?.type} */,`)
        }
        pUI(`    }),`)
        p(bUI.content)
        p(bRun.content)
        p('})')
        // b.writeTS('./src/compiler/entry.ts')
        return b.content
    }
}
