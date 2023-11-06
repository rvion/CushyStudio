import type { ComfyEnumDef, ComfyInputOpts, ComfySchemaJSON } from '../types/ComfySchemaJSON'

import { observable, toJS } from 'mobx'
import { LiveInstance } from 'src/db/LiveInstance'
import { ComfyPrimitiveMapping, ComfyPrimitives } from '../core/Primitives'
import { normalizeJSIdentifier } from '../core/normalizeJSIdentifier'
import { CodeBuffer } from '../utils/CodeBuffer'
import { escapeJSKey } from './escapeJSKey'

export type EnumHash = string
export type EnumName = string

export type NodeNameInComfy = string
export type NodeNameInCushy = string
export type EmbeddingName = Branded<string, { Embedding: true }>

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
    typeName: string
    nameInCushy: string
    isPrimitive: boolean
}

export type EnumValue = string | boolean | number

export type SchemaT = {
    id: 'main-schema'
    createdAt: number
    updatedAt: number
    spec: ComfySchemaJSON
    embeddings: EmbeddingName[]
}

export interface SchemaL extends LiveInstance<SchemaT, SchemaL> {}
export type EnumInfo = {
    // enumNameInComfy: string
    enumNameInCushy: EnumName
    values: EnumValue[]
    aliases: string[]
}

export class SchemaL {
    // LORA --------------------------------------------------------------
    hasLora = (loraName: string): boolean => this.getLoras().includes(loraName as Enum_LoraLoader_lora_name)
    getLoras = (): Enum_LoraLoader_lora_name[] => {
        const candidates = this.knownEnumsByName.get('Enum_LoraLoader_lora_name')?.values ?? []
        return candidates as Enum_LoraLoader_lora_name[]
    }

    // IMAGES --------------------------------------------------------------
    hasImage = (imgName: string): boolean => this.getImages().includes(imgName as Enum_LoadImage_image)
    getImages = (): Enum_LoadImage_image[] => {
        const candidates = this.knownEnumsByName.get('Enum_LoadImage_image')?.values ?? []
        return candidates as Enum_LoadImage_image[]
    }

    /** only use this function after an upload success, when you say this asset is now part of ComfyUI */
    unsafely_addImageInSchemaWithoutReloading = (imgName: string): void => {
        const enumInfo = this.knownEnumsByName.get('Enum_LoadImage_image')
        if (enumInfo == null) throw new Error(`Enum_LoadImage_image not found`)
        enumInfo.values.push(imgName as Enum_LoadImage_image)
    }

    // CHECKPOINT --------------------------------------------------------------
    hasCheckpoint = (ckptName: string): boolean => this.getCheckpoints().includes(ckptName as Enum_CheckpointLoaderSimple_ckpt_name) // prettier-ignore
    getCheckpoints = (): Enum_CheckpointLoaderSimple_ckpt_name[] => {
        const candidates = this.knownEnumsByName.get('Enum_CheckpointLoaderSimple_ckpt_name')?.values ?? []
        return candidates as Enum_CheckpointLoaderSimple_ckpt_name[]
    }

    // ENUM --------------------------------------------------------------
    getEnumOptionsForSelectPicker = (enumName: string): { label: EnumValue; value: EnumValue }[] => {
        const candidates = this.knownEnumsByName.get(enumName)?.values ?? []
        return candidates.map((x) => ({ label: x, value: x }))
    }

    knownTypes = new Set<string>()
    knownEnumsByName = new Map<EnumName, EnumInfo>()
    knownEnumsByHash = new Map<EnumHash, EnumInfo>()
    nodes: ComfyNodeSchema[] = []
    nodesByNameInComfy: { [key: string]: ComfyNodeSchema } = {}
    nodesByNameInCushy: { [key: string]: ComfyNodeSchema } = {}
    nodesByProduction: { [key: string]: NodeNameInCushy[] } = {}
    enumsAppearingInOutput = new Set<string>()

    /** on update is called automatically by live instances */
    onUpdate() {
        this.log('updating schema')
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
        this.enumsAppearingInOutput.clear()

        // compile spec
        const entries = Object.entries(this.data.spec)
        for (const [nodeNameInComfy, nodeDef] of entries) {
            // console.chanel?.append(`[${nodeNameInComfy}]`)
            // apply prefix
            const normalizedNodeNameInCushy = normalizeJSIdentifier(nodeNameInComfy, ' ')
            const nodeNameInCushy = normalizedNodeNameInCushy
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

            // OUTPUTS ----------------------------------------------------------------------
            const outputNamer: { [key: string]: number } = {}
            // console.info(JSON.stringify(nodeDef.output))
            for (const [ix, slotType] of nodeDef.output.entries()) {
                const rawOutputSlotName =
                    nodeDef.output_name[ix] || //
                    (typeof slotType === 'string' ? slotType : `input_${ix}`)

                const outputNameInComfy = normalizeJSIdentifier(rawOutputSlotName, '_')
                const at = (outputNamer[outputNameInComfy] ??= 0)
                const outputNameInCushy = at === 0 ? outputNameInComfy : `${outputNameInComfy}_${at}`
                outputNamer[outputNameInComfy]++
                // console.log('>>', outputNameInComfy, outputNameInCushy)

                let slotTypeName: string
                if (typeof slotType === 'string') {
                    slotTypeName = normalizeJSIdentifier(slotType, '_')
                    this.knownTypes.add(slotTypeName)
                } else if (Array.isArray(slotType)) {
                    const uniqueEnumName = `Enum_${nodeNameInCushy}_${outputNameInCushy}_out`
                    slotTypeName = this.processEnumNameOrValue({ candidateName: uniqueEnumName, comfyEnumDef: slotType })
                    this.enumsAppearingInOutput.add(slotTypeName)
                } else {
                    throw new Error(`invalid output ${ix} "${slotType}" in node "${nodeNameInComfy}"`)
                }
                // const optNormalized = normalizeJSIdentifier(slotType)
                // this.knownTypes.add(optNormalized)

                // index production
                let arr = this.nodesByProduction[slotTypeName]
                if (arr == null) this.nodesByProduction[slotTypeName] = [nodeNameInCushy]
                else arr.push(nodeNameInCushy)

                // const at = (outputNamer[slotType] ??= 0)
                // const nameInComfy = at === 0 ? slotType : `${slotType}_${at}`
                // const nameInCushy = normalizeJSIdentifier(nameInComfy)
                outputs.push({
                    typeName: slotTypeName,
                    // nameInCushy: outputNameInComfy,
                    nameInCushy: outputNameInCushy,
                    isPrimitive: false,
                })
                // outputNamer[slotType]++
            }

            // INPUTS ----------------------------------------------------------------------
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
                const inputNameInCushy = normalizeJSIdentifier(ipt.name, '_')
                const typeDef = ipt.spec
                const slotType = typeDef[0]
                const slotOpts = typeDef[1]

                /** name of the type in cushy */
                let inputTypeNameInCushy: string | undefined

                if (typeof slotType === 'string') {
                    inputTypeNameInCushy = normalizeJSIdentifier(slotType, '_')
                    this.knownTypes.add(inputTypeNameInCushy)
                } else if (Array.isArray(slotType)) {
                    const uniqueEnumName = `Enum_${nodeNameInCushy}_${inputNameInCushy}`
                    inputTypeNameInCushy = this.processEnumNameOrValue({ candidateName: uniqueEnumName, comfyEnumDef: slotType })
                } else {
                    throw new Error(`invalid input "${ipt.name}" in node "${nodeNameInComfy}"`)
                }

                if (inputTypeNameInCushy) {
                    node.inputs.push({
                        required: ipt.required,
                        nameInComfy: inputNameInComfy,
                        nameInComfyEscaped: escapeJSKey(inputNameInComfy),
                        type: inputTypeNameInCushy,
                        opts: slotOpts,
                        isPrimitive: ComfyPrimitives.includes(inputTypeNameInCushy),
                        index: node.inputs.length, // 🔴
                    })
                } else {
                    console.log(toJS({ ipt, typeDef, typeStuff: slotType }))
                    console.log(toJS({ typeStuff: slotType }))
                    throw new Error(`object type not supported`)
                }
            }
        }

        // this.updateComponents()
    }

    processEnumNameOrValue = (p: {
        //
        candidateName: string
        comfyEnumDef: ComfyEnumDef
    }): string => {
        // 1. build enum
        const enumValues: EnumValue[] = []
        for (const enumValue of p.comfyEnumDef) {
            if (typeof enumValue === 'string') enumValues.push(enumValue)
            else if (typeof enumValue === 'boolean') enumValues.push(enumValue)
            else if (typeof enumValue === 'number') enumValues.push(enumValue)
            else enumValues.push(enumValue.content)
        }
        // 2. hash its value
        const hash =
            enumValues.length === 0 //
                ? `[[empty:${p.candidateName}]]`
                : enumValues.sort().join('|')

        // 3. retrieve or create an EnumInfo
        let enumInfo: Maybe<EnumInfo> = this.knownEnumsByHash.get(hash)
        if (enumInfo == null) {
            // case 3.A. PRE-EXISTING
            enumInfo = observable({ enumNameInCushy: p.candidateName, values: enumValues, aliases: [] })
            this.knownEnumsByHash.set(hash, enumInfo)
        } else {
            // case 3.B. PRE-EXISTING
            enumInfo.aliases.push(p.candidateName)
        }

        // ❌ if (p.candidateName === 'Enum_DualCLIPLoader_clip_name1') debugger

        // 4.sore enum by name
        this.knownEnumsByName.set(p.candidateName, enumInfo)
        return enumInfo.enumNameInCushy
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

    codegenDTS = (): string => {
        const prefix = '../src/'
        const b = new CodeBuffer()
        const p = b.w

        // 1️⃣ if (opts.cushySrcPathPrefix == null) {
        // 1️⃣     p(`/// <reference path="cushy.d.ts" />`)
        // 1️⃣ }
        p('')
        p(`import type { ComfyNode } from '${prefix}core/Node'`)
        p(`import type { Slot } from '${prefix}core/Slot'`)
        p(`import type { ComfyNodeSchemaJSON } from '${prefix}types/ComfySchemaJSON'`)
        p(`import type { ComfyNodeID } from '${prefix}types/ComfyNodeID'`)
        p(`import type { CardType, ActionTags } from '${prefix}cards/Card'`)
        // p(`import type { ActionType, ActionTags } from '${prefix}library/Card'`)
        // p(`import type { WorkflowType } from '${prefix}core/WorkflowFn'`)
        p('')
        p(`// CONTENT IN THIS FILE:`)
        p('//')
        p('//  0. Entrypoint')
        p('//  1. Requirable')
        p('//  2. Embeddings')
        p('//  3. Suggestions')
        p('//  4. TYPES')
        p('//  5. ACCEPTABLE')
        p('//  6. ENUMS')
        p('//  7. INTERFACES')
        p('//  8. NODES')
        p('//  9. INDEX')
        p('')
        p(`declare global {`)
        p(`const action: CardType`)
        p(`const card: CardType`)
        p(`const actionTags: ActionTags`)
        p(``)
        p(`\n// 0. Entrypoint --------------------------`)
        p(`export interface ComfySetup {`)
        // prettier-ignore
        for (const n of this.nodes) {
            p(`    /* category:${n.category}, name:"${n.nameInComfy}", output:${n.outputs.map(o => o.nameInCushy).join('+')} */`)
            p(`    ${n.nameInCushy}(p: ${n.nameInCushy}_input, id?: ComfyNodeID): ${n.nameInCushy}`)
        }
        p(`}`)

        p(`\n// 1. Requirable --------------------------`)
        p(`export interface Requirable {`)
        const requirables = this.requirables
        for (const n of requirables) p(`    ${escapeJSKey(n.name)}: ${n.name},`)
        p(`}`)

        p(`\n// 2. Embeddings -------------------------------`)
        p(
            `export type Embeddings = ${
                this.data.embeddings.length == 0 //
                    ? '""' // fixes the problem when someone has no embedding
                    : this.data.embeddings.map((e) => wrapQuote(e)).join(' | ')
            }`,
        )

        p(`\n// 3. Suggestions -------------------------------`)
        for (const [k, value] of Object.entries(ComfyPrimitiveMapping)) {
            p(`export interface CanProduce_${value} {}`)
        }
        for (const [tp, nns] of Object.entries(this.nodesByProduction)) {
            p(`export interface CanProduce_${tp} extends Pick<ComfySetup, ${nns.map((i) => `'${i}'`).join(' | ')}> { }`)
        }
        for (const tp of this.knownTypes) {
            if (!(tp in this.nodesByProduction)) p(`export interface CanProduce_${tp} {}`)
        }

        p(`\n// 4. TYPES -------------------------------`)
        const types = [...this.knownTypes.values()] //
            .map((comfyType) => ({
                comfyType,
                normalizedType: comfyType,
                tsType: this.toTSType(comfyType),
            }))
            .sort((a, b) => b.tsType.length - a.tsType.length)

        for (const t of types) {
            // const tsType = this.toTSType(t)
            p(`export type ${t.normalizedType} = ${t.tsType}`)
        }

        p(`\n// 5. ACCEPTABLE INPUTS -------------------------------`)
        for (const t of types) {
            // const tsType = this.toTSType(t)
            p(
                `export type _${t.normalizedType} = ${t.tsType} | HasSingle_${t.normalizedType} | ((x: CanProduce_${t.normalizedType}) => _${t.normalizedType})`,
            )
            // ${i.type} | HasSingle_${i.type}
        }

        p(`\n// 6. ENUMS -------------------------------`)
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
        // p(`export type KnownEnumNames = {${[...this.knownEnumsByName.keys()].map((e) => `'${e}': ${e}`).join(',\n    ')}}`)
        // p(`export type KnownEnumNames = {${[...this.knownEnumsByName.keys()].map((e) => `'${e}': ${e}`).join(',\n    ')}}`)
        p(`export type KnownEnumNames = keyof Requirable`)

        p(`\n// 7. INTERFACES --------------------------`)
        for (const t of this.knownTypes.values()) {
            p(`export interface HasSingle_${t} { _${t}: ${t} } // prettier-ignore`)
        }
        // knownEnumOutput
        for (const t of this.enumsAppearingInOutput.values()) {
            p(`export interface HasSingle_${t} { _${t}: ${t} } // prettier-ignore`)
        }
        // for (const t of this.knownEnums.values()) {
        //     p(
        //         `export interface HasSingle_${t.enumNameInCushy} { _${t.enumNameInCushy}: ${t.enumNameInCushy} } // prettier-ignore`,
        //     )
        // }

        p(`\n// 8. NODES -------------------------------`)
        for (const n of this.nodes) p(n.codegen())

        p(`\n// 9. INDEX -------------------------------`)
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
        //     p(`    ${n.nameInCushy}(args: ${n.nameInCushy}_input, uid?: ComfyNodeID): ${n.nameInCushy}`)
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
        for (const i of this.outputs) x[i.typeName] = (x[i.typeName] ?? 0) + 1
        this.singleOuputs = this.outputs.filter((i) => x[i.typeName] === 1)
        const ifaces = this.singleOuputs.map((i) => `HasSingle_${i.typeName}`)
        ifaces.push(`ComfyNode<${this.nameInCushy}_input, ${this.nameInCushy}_output>`)
        // inputs
        // p(`\n// ${this.name} -------------------------------`)
        // const msgIfDifferent = this.nameInComfy !== this.nameInCushy ? ` ("${this.nameInComfy}" in ComfyUI)` : ''
        p(`// ${this.nameInComfy} [${this.category}]`)
        p(`export interface ${this.nameInCushy} extends ${ifaces.join(', ')} {`)
        p(`    nameInComfy: "${this.nameInComfy}"`)
        p(`}`)
        p(`export interface ${this.nameInCushy}_output {`)
        // p(`    $schema: ${this.name}_schema`)
        this.outputs.forEach((i, ix) => {
            p(`    ${escapeJSKey(i.nameInCushy)}: Slot<'${i.typeName}', ${ix}>,`)
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

        p(`export interface ${this.nameInCushy}_input {`)
        for (const i of this.inputs) {
            const opts = typeof i.opts === 'string' ? null : i.opts
            const type = /*ComfyPrimitiveMapping[i.type] //
                ? i.type
                : */ i.type.startsWith('Enum_') ? i.type : `_${i.type}`
            if (opts) p(`    ${this.renderOpts(opts)}`)
            const canBeOmmited = opts?.default !== undefined || !i.required
            p(`    ${i.nameInComfyEscaped}${canBeOmmited ? '?' : ''}: ${type}`)
        }
        p(`}`)

        return b.content
    }

    renderOpts(opts?: ComfyInputOpts): Maybe<string> {
        if (opts == null) return null
        if (typeof opts === 'string') return null
        let out = '/**'
        if (opts.default != null)
            out +=
                this.nameInCushy === 'WASCacheNode' //
                    ? ` default='<redacted>'`
                    : ` default=${JSON.stringify(opts.default)}`
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
