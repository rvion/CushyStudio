import type { ComfyEnumDef, ComfyInputOpts, ComfyNodeSchemaJSON } from '../types/ComfySchemaJSON'
import type { HostL } from './Host'
import type { ComfySchemaT } from 'src/db/TYPES.gen'

import { observable, toJS } from 'mobx'

import { normalizeJSIdentifier } from '../core/normalizeJSIdentifier'
import { ComfyPrimitiveMapping, ComfyPrimitives } from '../core/Primitives'
import { CodeBuffer } from '../utils/codegen/CodeBuffer'
import { escapeJSKey } from '../utils/codegen/escapeJSKey'
import { LiveInstance } from 'src/db/LiveInstance'
import { LiveRef } from 'src/db/LiveRef'

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
    isEnum: boolean
    // isEnum: boolean
    required: boolean
    index: number
}

export type NodeOutputExt = {
    typeName: string
    nameInCushy: string
    nameInComfy: string
    isPrimitive: boolean
}

export type EnumValue = string | boolean | number
export type EnumInfo = {
    // enumNameInComfy: string
    enumNameInCushy: EnumName
    values: EnumValue[]
    aliases: string[]
}

export interface ComfySchemaL extends LiveInstance<ComfySchemaT, ComfySchemaL> {}

export class ComfySchemaL {
    /**
     * return the number of nodes in your current schema
     * quick way to check your instance info
     * */
    get size(): number {
        // console.log(`[👙] `, toJS(this.data.spec), Object.keys(this.data.spec).length)
        return Object.keys(this.data.spec).length
    }

    /**
     * for now, simply ensure that the number of parsed nodes matches the number of nodes
     * present in the object_info.json
     */
    RUN_BASIC_CHECKS = () => {
        const numNodesInSource = Object.keys(this.data.spec).length
        const numNodesInSchema = this.nodes.length
        if (numNodesInSource !== numNodesInSchema) {
            console.log(`🔴 ${numNodesInSource} != ${numNodesInSchema}`)
        }
    }
    // hasWildcard = (embedding: string): embedding is EmbeddingName => this.data.embeddings.includes(embedding as EmbeddingName)
    hasEmbedding = (embedding: string): embedding is EmbeddingName => this.data.embeddings.includes(embedding as EmbeddingName)
    // LORA --------------------------------------------------------------
    /** check if the given lora name is present in the Enum_LoraLoader_lora_name enum */
    hasLora = (loraName: string): boolean => this.getLoras().includes(loraName as Enum_LoraLoader_lora_name)

    /** return the list of all loras available */
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
    getEnumOptionsForSelectPicker = (enumName: string): { asOptionLabel: string; value: EnumValue }[] => {
        const candidates = this.knownEnumsByName.get(enumName)?.values ?? []
        return candidates.map((x) => ({ asOptionLabel: x.toString(), value: x }))
    }

    knownSlotTypes = new Set<string>()
    knownEnumsByName = new Map<EnumName, EnumInfo>()
    knownEnumsByHash = new Map<EnumHash, EnumInfo>()
    nodes: ComfyNodeSchema[] = []
    nodesByNameInComfy: { [key: string]: ComfyNodeSchema } = {}
    nodesByNameInCushy: { [key: string]: ComfyNodeSchema } = {}
    nodesByProduction: { [key: string]: NodeNameInCushy[] } = {}
    enumsAppearingInOutput = new Set<string>()

    onHydrate = () => {
        // this.onUpdate()
    }

    hostRef = new LiveRef<this, HostL>(
        //
        this,
        'hostID',
        () => this.db.hosts,
    )
    // get host(): HostL { return this.hostRef.item } // prettier-ignore
    // get hostName(): string { return this.hostRef.item.data.name } // prettier-ignore

    /** on update is called automatically by live instances */
    onUpdate() {
        this.log(`updating schema (${this.id})`)
        // reset spec
        // this.spec = this.data.spec
        // this.embeddings = this.data.embeddings
        this.knownSlotTypes.clear()
        this.knownEnumsByHash.clear()
        this.knownEnumsByName.clear()
        this.nodes.splice(0, this.nodes.length)
        this.nodesByNameInComfy = {}
        this.nodesByNameInCushy = {}
        this.nodesByProduction = {}
        this.enumsAppearingInOutput.clear()

        // compile spec
        const entries: [string, ComfyNodeSchemaJSON][] = Object.entries(this.data.spec)
        for (const __x of entries) {
            const nodeNameInComfy = __x[0]
            const nodeDef = __x[1]
            // console.chanel?.append(`[${nodeNameInComfy}]`)
            // apply prefix
            const nodeNameInCushy = normalizeJSIdentifier(nodeNameInComfy, ' ')
            // console.log('>>', nodeTypeDef.category, nodeNameInCushy)

            if (typeof nodeDef.output === 'string') {
                console.log(`[❌ ERROR] nodeDef ${nodeDef.name} has an invalid output definition: ${JSON.stringify(nodeDef.output)}`) // prettier-ignore
                nodeDef.output = []
            }

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
            // [⏸️ debug] if (typeof nodeDef.output.entries !== 'function') {
            // [⏸️ debug]     console.log(`[👙] `, nodeDef)
            // [⏸️ debug]     console.log(`[👙] `, nodeDef.output)
            // [⏸️ debug]     console.log(`[👙] `, nodeDef.output.entries)
            // [⏸️ debug]     debugger
            // [⏸️ debug] }
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
                    this.knownSlotTypes.add(slotTypeName)
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
                    nameInComfy: outputNameInComfy,
                    nameInCushy: outputNameInCushy,
                    isPrimitive: false,
                })
                // outputNamer[slotType]++
            }

            // INPUTS ----------------------------------------------------------------------
            const optionalInputs = Object.entries(nodeDef.input?.optional ?? {}) //
                .map(([name, spec]) => ({ required: false, name, spec }))
            const requiredInputs = Object.entries(nodeDef.input?.required ?? {}) //
                .map(([name, spec]) => ({ required: true, name, spec }))
                // REMOVE DUPLICATES
                // ! "CR ControlNet Input Switch": {
                // !    "input": {
                // !        "required": {
                // !            "Input": ["INT",{"default":1,"min":1,"max":2}]
                // !             "control_net1": ["CONTROL_NET"] 👈
                // !        }
                // !         "optional": {
                // !            "control_net1": ["CONTROL_NET"] 👈
                // !        }
                // !    }
                // 👇 this makes only the optional propery to be kept
                .filter((i) => optionalInputs.find((oi) => oi.name === i.name) == null)
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
                    this.knownSlotTypes.add(inputTypeNameInCushy)
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
                        isEnum: this.knownEnumsByName.has(inputTypeNameInCushy),
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
        // for (const n of this.knownSlotTypes) out.push({ name: n, kind: 'prim' })
        for (const n of this.knownEnumsByName) out.push({ name: n[0], kind: 'enum' })
        // for (const n of this.nodes) out.push({ name: n.nameInCushy, kind: 'node' })
        return out
    }

    codegenDTS = (): string => {
        const prefix = '../src/'
        const b = new CodeBuffer()
        const p = b.w

        p('')
        p(`import type { ComfyNode } from '${prefix}core/ComfyNode'`)
        p(`import type { ComfyNodeMetadata } from '${prefix}types/ComfyNodeID'`)
        p(`import type { ComfyNodeOutput } from '${prefix}core/Slot'`)
        p(`import type { ComfyNodeSchemaJSON } from '${prefix}types/ComfySchemaJSON'`)
        p('')
        // p(`import type { GlobalFunctionToDefineAnApp } from '${prefix}cards/App'`)
        p(`import type { GlobalFunctionToDefineAnApp, GlobalGetCurrentForm, GlobalGetCurrentRun } from '${prefix}cards/App'`)
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
        p(``)
        p(`/** @deprecated use the global 'app' function instead to register an app */`)
        p(`const action: GlobalFunctionToDefineAnApp`)
        p(``)
        p(`/** @deprecated use the global 'app' function instead to register an app */`)
        p(`const card: GlobalFunctionToDefineAnApp`)
        p(``)
        p(`const app: GlobalFunctionToDefineAnApp`)
        p(`const getCurrentForm: GlobalGetCurrentForm`)
        p(`const getCurrentRun: GlobalGetCurrentRun`)
        p(``)
        // p(`const actionTags: ActionTags`)
        p(``)
        p(`\n// 0. Entrypoint --------------------------`)
        p(`export interface ComfySetup {`)
        // prettier-ignore
        for (const n of this.nodes) {
            p(`    /* category:${n.category}, name:"${n.nameInComfy}", output:${n.outputs.map(o => o.nameInCushy).join('+')} */`)
            p(`    ${n.nameInCushy}(p: ${n.nameInCushy}_input, meta?: ComfyNodeMetadata): ${n.nameInCushy}`)
        }
        p(`}`)

        p(`\n// 1. Requirable --------------------------`)
        p(`export interface Requirable {`)
        const requirables = this.requirables
        for (const n of requirables) p(`    ${escapeJSKey(n.name)}: { $Name: ${JSON.stringify(n.name)}, $Value: ${n.name} },`)
        p(`}`)

        p(`\n// 2. Embeddings -------------------------------`)
        p(
            `export type Embeddings = ${
                this.data.embeddings.length == 0 //
                    ? '""' // fixes the problem when someone has no embedding
                    : this.data.embeddings.map((e) => wrapQuote(e)).join(' | ')
            }`,
        )

        const slotTypes = [...this.knownSlotTypes.values()] //
            .map((comfyType) => ({
                comfyType,
                /** alias name */
                // slotTypeAlias: comfyType + '__Value',
                /** yep def */
                tsType: this.toTSType(comfyType),
                tsType2: this.toSignalType(comfyType),
            }))
            .sort((a, b) => b.tsType.length - a.tsType.length)

        p(`\n// 3. Suggestions -------------------------------`)
        p(`// 3.1. primitives`)
        for (const [k, value] of Object.entries(ComfyPrimitiveMapping)) {
            p(`export interface CanProduce_${value} {}`)
        }
        p(`// 3.1. types produced`)
        // for (const [tp, nns] of Object.entries(this.nodesByProduction)) {
        // }
        for (const tp of slotTypes) {
            const producingNodes: string[] = this.nodesByProduction[tp.comfyType]
            if (producingNodes)
                p(
                    `export interface CanProduce_${tp.comfyType} extends Pick<ComfySetup, ${producingNodes
                        .map((i) => `'${i}'`)
                        .join(' | ')}> { }`,
                )
            else p(`export interface CanProduce_${tp.comfyType} {} // 🔶 no node can output this type.`)
        }

        p(`\n// 4. TYPES -------------------------------`)

        // ⏸️ for (const t of slotTypes) {
        // ⏸️     // const tsType = this.toTSType(t)
        // ⏸️     p(`export type ${t.slotTypeAlias} = ${t.tsType}`)
        // ⏸️ }

        p(`\n// 5. ACCEPTABLE INPUTS -------------------------------`)
        for (const t of slotTypes) {
            // const tsType = this.toTSType(t)
            p(
                `export type _${t.comfyType} = ${t.tsType} | HasSingle_${t.comfyType} | ((x: CanProduce_${t.comfyType}) => _${t.comfyType})`,
            )
            // ${i.type} | HasSingle_${i.type}
        }

        p(`\n// 6. ENUMS -------------------------------`)
        const allAcceptableEnums: string[] = []
        for (const e of this.knownEnumsByHash.values()) {
            if (e.values.length > 0) {
                allAcceptableEnums.push(e.enumNameInCushy)
                p(`export type ${e.enumNameInCushy} = ${e.values.map((v) => `${JSON.stringify(v)}`).join(' | ')}`)
                if (e.aliases.length > 0) {
                    for (const alias of e.aliases) {
                        allAcceptableEnums.push(alias)
                        p(`export type ${alias} = ${e.enumNameInCushy}`)
                    }
                }
            } else {
                p(`export type ${e.enumNameInCushy} = '🔴' // never`)
            }
        }
        // p(`export type KnownEnumNames = {${[...this.knownEnumsByName.keys()].map((e) => `'${e}': ${e}`).join(',\n    ')}}`)
        // p(`export type KnownEnumNames = {${[...this.knownEnumsByName.keys()].map((e) => `'${e}': ${e}`).join(',\n    ')}}`)
        // p(`// export type KnownEnumNames = keyof Requirable // <-- too slow.. 😢`)
        // p(`export type KnownEnumNames =\n   | ${allAcceptableEnums.map((e) => JSON.stringify(e)).join('\n   | ')}`)

        p(`\n// 7. INTERFACES --------------------------`)
        for (const t of slotTypes) {
            p(`export interface HasSingle_${t.comfyType} { _${t.comfyType}: ${t.tsType} } // prettier-ignore`)
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

        p(`\n// 8.2 NODE UI helpers --------------------`)
        p(`export interface FormHelper {`)
        for (const n of this.nodes) b.append(n.codegenUI())
        p(`}`)

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

    private toTSType = (t: string) =>
        ComfyPrimitiveMapping[t] ? `${ComfyPrimitiveMapping[t]} | ComfyNodeOutput<'${t}'>` : `ComfyNodeOutput<'${t}'>`
    private toSignalType = (t: string) => `ComfyNodeOutput<'${t}'>`
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

    codegenUI() {
        const b = new CodeBuffer()
        const p = b.w
        p(`    ${this.nameInCushy}: {`)
        this.inputs.forEach((i, ix) => {
            if (i.isPrimitive) {
                const tsType = ComfyPrimitiveMapping[i.type]
                if (tsType == null) return console.log(`[🔶] invariant violation`)
                p(`        ${escapeJSKey(i.nameInComfy)}: { kind: '${tsType}', type: ${tsType} }`)
            }
            if (i.isEnum) {
                p(`        ${escapeJSKey(i.nameInComfy)}: { kind: 'enum', type: ${i.type} }`)
            }
        })
        p(`    }`)
        return b.content
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
            p(`    ${escapeJSKey(i.nameInCushy)}: ComfyNodeOutput<'${i.typeName}', ${ix}>,`)
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
                this.nameInComfy === 'Cache Node' //
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
