import { makeAutoObservable } from 'mobx'
import { CodeBuffer } from '../utils/CodeBuffer'
import { ComfyPrimitiveMapping, ComfyPrimitives } from './ComfyPrimitives'
import { ComfySchemaJSON } from './ComfySchemaJSON'

export type EnumHash = string
export type EnumName = string
export type NodeInputExt = { name: string; type: string; opts?: any; isPrimitive: boolean }
export type NodeOutputExt = { type: string; name: string; isPrimitive: boolean }

export class ComfySchema {
    knownTypes = new Set<string>()

    knownEnums = new Map<
        EnumHash,
        {
            enumNameInComfy: string
            enumNameInCushy: EnumName
            values: string[]
        }
    >()
    nodes: ComfyNodeSchema[] = []
    nodesByNameInComfy: { [key: string]: ComfyNodeSchema } = {}
    nodesByNameInCushy: { [key: string]: ComfyNodeSchema } = {}

    constructor(public spec: ComfySchemaJSON) {
        this.update(spec)
        makeAutoObservable(this)
    }

    normalizeJSIdentifier = (name: string) => {
        return name
            .replace(/[^a-zA-Z0-9_]/g, ' ')
            .split(' ')
            .map((i) => i.trim())
            .filter((i) => i.length > 0)
            .map((i) => i[0].toUpperCase() + i.slice(1))
            .join('')
    }

    update(spec: ComfySchemaJSON) {
        // reset spec
        this.spec = spec
        this.knownTypes.clear()
        this.knownEnums.clear()
        this.nodes.splice(0, this.nodes.length)
        this.nodesByNameInComfy = {}
        this.nodesByNameInCushy = {}

        // compile spec
        const entries = Object.entries(spec)
        for (const [nodeNameInComfy, nodeTypeDef] of entries) {
            // apply prefix
            const normalizedNodeNameInCushy = this.normalizeJSIdentifier(nodeNameInComfy)
            const nodeNameInCushy = nodeTypeDef.category.startsWith('WAS Suite/')
                ? `WAS${normalizedNodeNameInCushy}`
                : normalizedNodeNameInCushy
            // console.log('>>', nodeTypeDef.category, nodeNameInCushy)

            const requiredInputs = Object.entries(nodeTypeDef.input.required)
            const inputs: NodeInputExt[] = []
            const outputs: NodeOutputExt[] = []
            const node = new ComfyNodeSchema(
                //
                nodeNameInComfy,
                nodeNameInCushy,
                // nodeTypeName,
                nodeTypeDef.category,
                inputs,
                outputs,
            )
            this.nodesByNameInComfy[nodeNameInComfy] = node
            this.nodesByNameInCushy[nodeNameInCushy] = node
            this.nodes.push(node)
            const outputNamer: { [key: string]: number } = {}
            for (const opt of nodeTypeDef.output) {
                const at = (outputNamer[opt] ??= 0)
                const name = at === 0 ? opt : `${opt}_${at}`
                outputs.push({ type: opt, name, isPrimitive: false })
                outputNamer[opt]++
            }

            for (const ipt of requiredInputs) {
                const inputName = ipt[0]
                const typeDef = ipt[1]
                const typeStuff = typeDef[0]
                const typeOpts = typeDef[1]

                /** name of the type in cushy */
                let inputTypeNameInCushy: string | undefined

                if (typeof typeStuff === 'string') {
                    inputTypeNameInCushy = this.normalizeJSIdentifier(typeStuff)
                    this.knownTypes.add(inputTypeNameInCushy)
                } else if (Array.isArray(typeStuff) && typeStuff.every((x) => typeof x === 'string')) {
                    const enumValues: string[] = []
                    for (const enumValue of typeStuff) {
                        enumValues.push(enumValue)
                    }
                    const hash = enumValues.sort().join('|')
                    const similarEnum = this.knownEnums.get(hash)
                    if (similarEnum != null) inputTypeNameInCushy = similarEnum.enumNameInCushy
                    else {
                        inputTypeNameInCushy = `Enum_${nodeNameInCushy}_${inputName}`
                        this.knownEnums.set(hash, {
                            enumNameInCushy: this.normalizeJSIdentifier(inputTypeNameInCushy),
                            enumNameInComfy: inputName,
                            values: enumValues,
                        })
                    }
                } else {
                    throw new Error('object type not supported')
                }

                if (inputTypeNameInCushy) {
                    node.inputs.push({
                        name: inputName,
                        type: inputTypeNameInCushy,
                        opts: typeOpts,
                        isPrimitive: ComfyPrimitives.includes(inputTypeNameInCushy),
                    })
                } else {
                    console.log({ ipt, typeDef, typeStuff })
                    console.log({ typeStuff })
                    throw new Error('object type not supported')
                }
            }
        }
    }
    codegenDTS = (useLocalPath = false): string => {
        const b = new CodeBuffer()
        const p = b.w
        const prefix = useLocalPath ? '.' : 'core'
        p(`/// <reference types="./cushy" />\n`)
        p(`import type { ComfyNodeOutput } from '${prefix}/ComfyNodeOutput'`)
        p(`import type { ComfyNodeUID } from '${prefix}/ComfyNodeUID'`)
        p(`import type { ComfyNode } from '${prefix}/CSNode'`)
        p(`import type { ComfyNodeSchemaJSON } from '${prefix}/ComfySchemaJSON'`)
        p(`import type { Graph } from '${prefix}/Graph'`)
        p(`import type { Workflow } from './${prefix}/Workflow'`)
        p(`\n// TYPES -------------------------------`)
        const types = [...this.knownTypes.values()] //
            .map((comfyType) => ({ comfyType, tsType: this.toTSType(comfyType) }))
            .sort((a, b) => b.tsType.length - a.tsType.length)

        for (const t of types) {
            // const tsType = this.toTSType(t)
            p(`export type ${t.comfyType} = ${t.tsType}`)
        }

        p(`\n// ENUMS -------------------------------`)
        for (const e of this.knownEnums.values()) {
            if (e.values.length > 0) p(`export type ${e.enumNameInCushy} = ${e.values.map((v) => `'${v}'`).join(' | ')}`)
            else p(`export type ${e.enumNameInCushy} = never`)
        }

        p(`\n// INTERFACES --------------------------`)
        for (const t of this.knownTypes.values()) {
            p(`export interface HasSingle_${t} { _${t}: ${t} } // prettier-ignore`)
        }
        for (const t of this.knownEnums.values()) {
            p(
                `export interface HasSingle_${t.enumNameInCushy} { _${t.enumNameInCushy}: ${t.enumNameInCushy} } // prettier-ignore`,
            )
        }

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

        p(`\n// Entrypoint --------------------------`)
        p(`export interface ComfySetup {`)

        // prettier-ignore
        for (const n of this.nodes) {
            p(`    ${n.nameInCushy}(args: ${n.nameInCushy}_input, uid?: ComfyNodeUID): ${n.nameInCushy}`)
        }
        // p(`\n// misc \n`)
        // prettier-ignore
        // for (const n of this.nodes) {
        //     p(`    ${n.category}_${n.name} = (args: ${n.name}_input, uid?: rt.NodeUID) => new ${n.name}(this, uid, args)`)
        // }
        p(`}`)
        p(`declare global {`)
        // p(`    export const C: ComfySetup & ComfyGraph`)
        p(`    export const WORKFLOW: (builder: (graph: ComfySetup & ComfyGraph) => void) => Workflow`)
        p(`}`)

        // p(`declare const WORKFLOW: (builder: (graph: ComfyGraph) => void) => void`)
        // p('declare const C: ComfySetup & ComfyGraph')
        // b.writeTS('./src/core/Comfy.ts')
        return b.content
    }

    private toTSType = (t: string) => ComfyPrimitiveMapping[t] ?? `ComfyNodeOutput<'${t}'>`
}

export class ComfyNodeSchema {
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
        const ifaces = this.outputs.filter((i) => x[i.type] === 1).map((i) => `HasSingle_${i.type}`)
        ifaces.push(`ComfyNode<${this.nameInCushy}_input>`)
        // inputs
        // p(`\n// ${this.name} -------------------------------`)
        b.bar(this.nameInCushy)
        p(`export interface ${this.nameInCushy} extends ${ifaces.join(', ')} {`)
        // p(`    $schema: ${this.name}_schema`)
        this.outputs.forEach((i, ix) => {
            p(`    ${i.name}: ComfyNodeOutput<'${i.type}', ${ix}>,`)
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
            const type = ComfyPrimitiveMapping[i.type] ? i.type : `${i.type} | HasSingle_${i.type}`
            p(`    ${i.name}: ${type}`)
        }
        p(`}`)

        return b.content
    }
}

// console.log(`test`)
// const main = new ComfyTypingsGenerator(spec2 as any)
// main.codegen()
