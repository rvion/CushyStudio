import type { Branded, Maybe } from 'src/utils/types'
import type { ComfyInputOpts, ComfySchemaJSON } from '../types/ComfySchemaJSON'

import { LiveInstance } from 'src/db/LiveInstance'
import { CodeBuffer } from '../utils/CodeBuffer'
import { ComfyPrimitiveMapping, ComfyPrimitives } from '../core/Primitives'
import { normalizeJSIdentifier } from '../core/normalizeJSIdentifier'
import { toJS } from 'mobx'

export type EnumHash = string
export type EnumName = string

export type NodeNameInComfy = string
export type NodeNameInCushy = string
export type EmbeddingName = Branded<string, 'Embedding'>

export type NodeInputExt = {
    nameInComfy: string
    nameInComfyEscaped: string
    type: string
    opts?: ComfyInputOpts
    isPrimitive: boolean
    required: boolean
    index: number
}
export type NodeOutputExt = {
    type: string
    nameInComfy: string
    nameInCushy: string
    isPrimitive: boolean
}

export type EnumValue = string | boolean | number

export type SchemaT = {
    id: 'main-schema'
    spec: ComfySchemaJSON
    embeddings: EmbeddingName[]
}

export interface SchemaL extends LiveInstance<SchemaT, SchemaL> {}
export class SchemaL {
    getLoraHierarchy = (): string[] => {
        const loras = this.getLoras()
        return []
    }

    getLoras = (): string[] => {
        const candidates = this.knownEnumsByName.get('Enum_LoraLoader_Lora_name') ?? []
        return candidates as string[]
    }

    getEnumOptionsForSelectPicker = (enumName: string) => {
        const candidates = this.knownEnumsByName.get(enumName) ?? []
        return candidates.map((x) => ({ label: x, value: x }))
    }

    knownTypes = new Set<string>()
    knownEnumsByName = new Map<EnumName, EnumValue[]>()
    knownEnumsByHash = new Map<
        EnumHash,
        {
            enumNameInComfy: string
            enumNameInCushy: EnumName
            values: EnumValue[]
            aliases: string[]
        }
    >()
    nodes: ComfyNodeSchema[] = []
    nodesByNameInComfy: { [key: string]: ComfyNodeSchema } = {}
    nodesByNameInCushy: { [key: string]: ComfyNodeSchema } = {}
    nodesByProduction: { [key: string]: NodeNameInCushy[] } = {}

    // components: ItemDataType[] = []

    // constructor(
    //     //
    //     public db: LiveDB,
    //     public spec: ComfySchemaJSON,
    //     public embeddings: EmbeddingName[],
    // ) {
    //     this.onUpdate(spec, embeddings)
    //     makeAutoObservable(this)
    // }

    /** on update is called automatically by live instances */
    onUpdate() {
        // reset spec
        // this.spec = this.data.spec
        // this.embeddings = this.data.embeddings
        this.knownTypes.clear()
        this.knownEnumsByHash.clear()
        this.knownEnumsByName.clear()
        this.nodes.splice(0, this.nodes.length)
        this.nodesByNameInComfy = {}
        this.nodesByNameInCushy = {}
        this.nodesByProduction = {}

        // compile spec
        const entries = Object.entries(this.data.spec)
        for (const [nodeNameInComfy, nodeDef] of entries) {
            // console.chanel?.append(`[${nodeNameInComfy}]`)
            // apply prefix
            const normalizedNodeNameInCushy = normalizeJSIdentifier(nodeNameInComfy)
            // prettier-ignore
            const nodeNameInCushy =
                nodeDef.category.startsWith('WAS Suite/') ? `WAS${normalizedNodeNameInCushy}` :
                nodeDef.category.startsWith('ImpactPack') ? `Impact${normalizedNodeNameInCushy}` :
                nodeDef.category.startsWith('Masquerade Nodes') ? `Masquerade${normalizedNodeNameInCushy}` :
                normalizedNodeNameInCushy
            // console.log('>>', nodeTypeDef.category, nodeNameInCushy)

            const inputs: NodeInputExt[] = []
            const outputs: NodeOutputExt[] = []
            const node = new ComfyNodeSchema(
                //
                nodeNameInComfy,
                nodeNameInCushy,
                // nodeTypeName,
                nodeDef.category,
                inputs,
                outputs,
            )

            // INDEX NODE
            this.nodesByNameInComfy[nodeNameInComfy] = node
            this.nodesByNameInCushy[nodeNameInCushy] = node
            this.nodes.push(node)

            // OUTPUTS
            const outputNamer: { [key: string]: number } = {}
            // console.info(JSON.stringify(nodeDef.output))
            for (const opt of nodeDef.output) {
                // index type

                const optNormalized = normalizeJSIdentifier(opt)
                this.knownTypes.add(optNormalized)
                // index production
                let arr = this.nodesByProduction[optNormalized]
                if (arr == null) this.nodesByProduction[optNormalized] = [nodeNameInCushy]
                else arr.push(nodeNameInCushy)

                const at = (outputNamer[opt] ??= 0)
                const nameInComfy = at === 0 ? opt : `${opt}_${at}`
                const nameInCushy = normalizeJSIdentifier(nameInComfy)
                outputs.push({
                    type: opt,
                    nameInComfy,
                    nameInCushy,
                    isPrimitive: false,
                })
                outputNamer[opt]++
            }

            // INPUTS
            const requiredInputs = Object.entries(nodeDef.input?.required ?? {}) //
                .map(([name, spec]) => ({ required: true, name, spec }))
            const optionalInputs = Object.entries(nodeDef.input?.optional ?? {}) //
                .map(([name, spec]) => ({ required: false, name, spec }))
            const allInputs = [
                //
                ...requiredInputs,
                ...optionalInputs,
            ]

            for (const ipt of allInputs) {
                const inputNameInComfy = ipt.name
                const inputNameInCushy = normalizeJSIdentifier(ipt.name)
                const typeDef = ipt.spec
                const typeStuff = typeDef[0]
                const typeOpts = typeDef[1]

                /** name of the type in cushy */
                let inputTypeNameInCushy: string | undefined

                if (typeof typeStuff === 'string') {
                    inputTypeNameInCushy = normalizeJSIdentifier(typeStuff)
                    this.knownTypes.add(inputTypeNameInCushy)
                } else if (
                    //
                    Array.isArray(typeStuff) &&
                    typeStuff.every(
                        (x) =>
                            typeof x === 'string' || //
                            typeof x === 'boolean' ||
                            typeof x === 'number',
                    )
                ) {
                    const enumValues: EnumValue[] = []
                    for (const enumValue of typeStuff) {
                        enumValues.push(enumValue)
                    }
                    const hash = enumValues.sort().join('|')
                    const similarEnum = this.knownEnumsByHash.get(hash)
                    const uniqueEnumName = `Enum_${nodeNameInCushy}_${inputNameInCushy}`
                    this.knownEnumsByName.set(uniqueEnumName, enumValues)
                    if (similarEnum != null) {
                        inputTypeNameInCushy = similarEnum.enumNameInCushy
                        similarEnum.aliases.push(uniqueEnumName)
                    } else {
                        inputTypeNameInCushy = uniqueEnumName
                        this.knownEnumsByHash.set(hash, {
                            enumNameInCushy: normalizeJSIdentifier(inputTypeNameInCushy),
                            enumNameInComfy: inputNameInComfy,
                            values: enumValues,
                            aliases: [],
                        })
                    }
                } else {
                    const hash = `___${nodeNameInCushy}`
                    const uniqueEnumName = `ERROR_${nodeNameInCushy}_${inputNameInComfy}`
                    inputTypeNameInCushy = uniqueEnumName
                    this.knownEnumsByName.set(uniqueEnumName, [])

                    const errMsg =
                        `node (${nodeNameInComfy} ${nodeNameInCushy}) schema for property ${ipt.name} contains an unsupported ` +
                        typeof typeStuff
                    console.error('🦊 skipping', errMsg, { invalid: toJS(typeStuff) })
                    // console.error('🦊', JSON.stringify())
                    // console.error('🦊 skipping')
                    // throw new Error(errMsg)
                    continue
                }

                if (inputTypeNameInCushy) {
                    node.inputs.push({
                        required: ipt.required,
                        nameInComfy: inputNameInComfy,
                        nameInComfyEscaped: escapeJSKey(inputNameInComfy),
                        type: inputTypeNameInCushy,
                        opts: typeOpts,
                        isPrimitive: ComfyPrimitives.includes(inputTypeNameInCushy),
                        index: node.inputs.length, // 🔴
                    })
                } else {
                    console.log(toJS({ ipt, typeDef, typeStuff }))
                    console.log(toJS({ typeStuff }))
                    throw new Error(`object type not supported`)
                }
            }
        }
        // this.updateComponents()
    }

    // updateComponents() {
    //     this.components = []
    //     this.knownEnums.forEach((enumDef) => {
    //         this.components.push({
    //             name: enumDef.enumNameInCushy,
    //             type: 'enum',
    //             // values: enumDef.values,
    //             children: enumDef.values.map((v) => ({ name: v, type: 'enum-value' })),
    //         })
    //     })
    // }
    get requirables(): {
        name: string
        kind: 'enum' | 'node' | 'prim'
    }[] {
        const out: { name: string; kind: 'enum' | 'node' | 'prim' }[] = []
        for (const n of this.knownTypes) out.push({ name: n, kind: 'prim' })
        for (const n of this.knownEnumsByName) out.push({ name: n[0], kind: 'enum' })
        for (const n of this.nodes) out.push({ name: n.nameInCushy, kind: 'node' })
        return out
    }

    codegenDTS = (opts: { cushySrcPathPrefix?: string }): string => {
        const prefix = opts.cushySrcPathPrefix ?? ''
        const b = new CodeBuffer()
        const p = b.w

        if (opts.cushySrcPathPrefix == null) {
            p(`/// <reference path="cushy.d.ts" />`)
        }
        p('')
        p(`import type { ComfyNode } from '${prefix}core/Node'`)
        p(`import type { Slot } from '${prefix}core/Slot'`)
        p(`import type { ComfyNodeSchemaJSON } from '${prefix}types/ComfySchemaJSON'`)
        p(`import type { ComfyNodeUID } from '${prefix}types/NodeUID'`)
        p(`import type { ActionType } from '${prefix}core/Requirement'`)
        // p(`import type { WorkflowType } from '${prefix}core/WorkflowFn'`)

        p(`declare global {`)
        p(`const action: ActionType`)
        p(``)
        p(`\n// Entrypoint --------------------------`)
        p(`export interface ComfySetup {`)
        // prettier-ignore
        for (const n of this.nodes) {
            p(`    /* category=${n.category} name="${n.nameInComfy}" output=${n.outputs.map(o => o.nameInComfy).join(', ')} */`)
            p(`    ${n.nameInCushy}(args: ${n.nameInCushy}_input, uid?: ComfyNodeUID): ${n.nameInCushy}`)
        }
        p(`}`)

        p(`\n// Requirable --------------------------`)
        p(`export interface Requirable {`)
        const requirables = this.requirables
        for (const n of requirables) p(`    ${escapeJSKey(n.name)}: ${n.name},`)
        p(`}`)

        p(`\n// Embeddings -------------------------------`)
        p(
            `export type Embeddings = ${
                this.data.embeddings.length == 0 //
                    ? '""' // fixes the problem when someone has no embedding
                    : this.data.embeddings.map((e) => wrapQuote(e)).join(' | ')
            }`,
        )

        p(`\n// Suggestions -------------------------------`)
        for (const [k, value] of Object.entries(ComfyPrimitiveMapping)) {
            p(`export interface CanProduce_${value} {}`)
        }
        for (const [tp, nns] of Object.entries(this.nodesByProduction)) {
            p(`export interface CanProduce_${tp} extends Pick<ComfySetup, ${nns.map((i) => `'${i}'`).join(' | ')}> { }`)
        }

        p(`\n// TYPES -------------------------------`)
        const types = [...this.knownTypes.values()] //
            .map((comfyType) => ({
                comfyType,
                normalizedType: normalizeJSIdentifier(comfyType),
                tsType: this.toTSType(comfyType),
            }))
            .sort((a, b) => b.tsType.length - a.tsType.length)

        for (const t of types) {
            // const tsType = this.toTSType(t)
            p(`export type ${t.normalizedType} = ${t.tsType}`)
        }

        p(`\n// ACCEPTABLE INPUTS -------------------------------`)
        for (const t of types) {
            // const tsType = this.toTSType(t)
            p(
                `export type _${t.normalizedType} = ${t.tsType} | HasSingle_${t.normalizedType} | ((x: CanProduce_${t.normalizedType}) => _${t.normalizedType})`,
            )
            // ${i.type} | HasSingle_${i.type}
        }

        p(`\n// ENUMS -------------------------------`)
        for (const e of this.knownEnumsByHash.values()) {
            if (e.values.length > 0) {
                p(`export type ${e.enumNameInCushy} = ${e.values.map((v) => `${JSON.stringify(v)}`).join(' | ')}`)
                if (e.aliases.length > 0) {
                    for (const alias of e.aliases) {
                        p(`export type ${alias} = ${e.enumNameInCushy}`)
                    }
                }
            } else {
                p(`export type ${e.enumNameInCushy} = '🔴' // never`)
            }
        }

        p(`\n// INTERFACES --------------------------`)
        for (const t of this.knownTypes.values()) {
            p(`export interface HasSingle_${t} { _${t}: ${t} } // prettier-ignore`)
        }
        // for (const t of this.knownEnums.values()) {
        //     p(
        //         `export interface HasSingle_${t.enumNameInCushy} { _${t.enumNameInCushy}: ${t.enumNameInCushy} } // prettier-ignore`,
        //     )
        // }

        p(`\n// NODES -------------------------------`)
        for (const n of this.nodes) p(n.codegen())

        p(`\n// INDEX -------------------------------`)
        // p(`export const nodes = {`)
        // for (const n of this.nodes) p(`    ${n.name},`)
        // p(`}`)
        // p(`export type NodeType = keyof typeof nodes`)

        p(`export type Schemas = {`)
        for (const n of this.nodes) p(`    ${n.nameInCushy}: ComfyNodeSchemaJSON,`)
        p(`}`)
        p(`export type ComfyNodeType = keyof Schemas`)

        p(`}`) // 🔴

        // p(`\n// Entrypoint --------------------------`)
        // p(`export interface ComfySetup {`)

        // // prettier-ignore
        // for (const n of this.nodes) {
        //     p(`    ${n.nameInCushy}(args: ${n.nameInCushy}_input, uid?: ComfyNodeUID): ${n.nameInCushy}`)
        // }
        // // p(`\n// misc \n`)
        // // prettier-ignore
        // // for (const n of this.nodes) {
        // //     p(`    ${n.category}_${n.name} = (args: ${n.name}_input, uid?: rt.NodeUID) => new ${n.name}(this, uid, args)`)
        // // }
        // p(`}`)

        // p(`declare const WORKFLOW: (builder: (graph: ComfyGraph) => void) => void`)
        // b.writeTS('./src/core/Comfy.ts')
        // p(`declare const WORKFLOW: import("core/WorkflowFn").WorkflowType`)
        return b.content
    }

    private toTSType = (t: string) => (ComfyPrimitiveMapping[t] ? `${ComfyPrimitiveMapping[t]} | Slot<'${t}'>` : `Slot<'${t}'>`)
}

const escapeJSKey = (s: string) => {
    if (!s.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        // debugger
        return `"${s}"`
    }
    return s
}

export class ComfyNodeSchema {
    /** list of types the node has a single output of */
    singleOuputs: NodeOutputExt[] = []

    constructor(
        //
        public nameInComfy: string,
        public nameInCushy: string,
        public category: string,
        public inputs: NodeInputExt[],
        public outputs: NodeOutputExt[],
    ) {
        this.category = this.category.replaceAll('/', '_')
    }

    codegen(): string {
        const b = new CodeBuffer()
        const p = b.w

        // single type interfaces
        let x: { [key: string]: number } = {}
        for (const i of this.outputs) x[i.type] = (x[i.type] ?? 0) + 1
        this.singleOuputs = this.outputs.filter((i) => x[i.type] === 1)
        const ifaces = this.singleOuputs.map((i) => `HasSingle_${i.nameInCushy}`)
        ifaces.push(`ComfyNode<${this.nameInCushy}_input>`)
        // inputs
        // p(`\n// ${this.name} -------------------------------`)
        const msgIfDifferent = this.nameInComfy !== this.nameInCushy ? ` ("${this.nameInComfy}" in ComfyUI)` : ''
        b.bar(`${this.nameInCushy}${msgIfDifferent} [${this.category}]`)
        p(`export interface ${this.nameInCushy} extends ${ifaces.join(', ')} {`)
        p(`    nameInComfy: "${this.nameInComfy}"`)
        // p(`    $schema: ${this.name}_schema`)
        this.outputs.forEach((i, ix) => {
            p(`    ${escapeJSKey(i.nameInComfy)}: Slot<'${i.type}', ${ix}>,`)
        })
        // INTERFACE
        // if (x[i.type] === 1) p(`    get _${i.type}() { return this.${i.name} } // prettier-ignore`)
        // }
        // CLASS END
        p(`}`)

        // p(`// prettier-ignore`)
        // p(`export const ${this.name}_schema: ComfyNodeSchema = {`)
        // p(`    type: '${this.name}',`)
        // p(`    input: ${JSON.stringify(this.inputs)},`)
        // p(`    outputs: ${JSON.stringify(this.outputs)},`)
        // p(`    category: ${JSON.stringify(this.category)},`)
        // p(`}`)

        p(`export type ${this.nameInCushy}_input = {`)
        for (const i of this.inputs) {
            const type = /*ComfyPrimitiveMapping[i.type] //
                ? i.type
                : */ i.type.startsWith('Enum_') ? i.type : `_${i.type}`

            if (i.opts) p(`    ${this.renderOpts(i.opts)}`)
            const canBeOmmited = i.opts?.default !== undefined || !i.required
            p(`    ${i.nameInComfyEscaped}${canBeOmmited ? '?' : ''}: ${type}`)
        }
        p(`}`)

        return b.content
    }

    renderOpts(opts?: ComfyInputOpts): Maybe<string> {
        if (opts == null) return null
        let out = '/**'
        if (opts.default != null) out += ` default=${JSON.stringify(opts.default)}`
        if (opts.min != null) out += ` min=${JSON.stringify(opts.max)}`
        if (opts.max != null) out += ` max=${JSON.stringify(opts.max)}`
        if (opts.step != null) out += ` step=${JSON.stringify(opts.step)}`
        out += ' */'
        return out
    }
}

export const wrapQuote = (s: string) => {
    if (s.includes("'")) return `"${s}"`
    return `'${s}'`
}
