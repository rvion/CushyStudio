import { makeAutoObservable } from 'mobx'
import { CodeBuffer } from './CodeBuffer'
import { ComfySchemaJSON } from './ComfySchemaJSON'

const PRIMITIVES: { [key: string]: string } = {
    FLOAT: 'number',
    INT: 'number',
    STRING: 'string',
}

export type EnumHash = string
export type EnumName = string
export type NodeInputExt = { name: string; type: string; opts?: any }
export type NodeOutputExt = { type: string; name: string }

export class ComfySchema {
    knownTypes = new Set<string>()
    knownEnums = new Map<EnumHash, { name: EnumName; values: string[] }>()
    nodes: ComfyNodeSchema[] = []
    nodesByName: { [key: string]: ComfyNodeSchema } = {}

    constructor(spec: ComfySchemaJSON) {
        this.update(spec)
        makeAutoObservable(this)
    }

    update(spec: ComfySchemaJSON) {
        // reset spec
        this.knownTypes.clear()
        this.knownEnums.clear()
        this.nodes.splice(0, this.nodes.length)
        this.nodesByName = {}

        // compile spec
        const entries = Object.entries(spec)
        for (const [nodeTypeName, nodeTypeDef] of entries) {
            const requiredInputs = Object.entries(nodeTypeDef.input.required)
            const inputs: NodeInputExt[] = []
            const outputs: NodeOutputExt[] = []
            const node = new ComfyNodeSchema(nodeTypeName, nodeTypeDef.category, inputs, outputs)
            this.nodesByName[nodeTypeName] = node
            this.nodes.push(node)
            const outputNamer: { [key: string]: number } = {}
            for (const opt of nodeTypeDef.output) {
                const at = (outputNamer[opt] ??= 0)
                const name = at === 0 ? opt : `${opt}_${at}`
                outputs.push({ type: opt, name })
                outputNamer[opt]++
            }
            for (const ipt of requiredInputs) {
                const inputName = ipt[0]
                const typeDef = ipt[1]
                const typeStuff = typeDef[0]
                const typeOpts = typeDef[1]
                let typeName: string | undefined

                if (typeof typeStuff === 'string') {
                    typeName = typeStuff
                    this.knownTypes.add(typeName)
                } else if (Array.isArray(typeStuff) && typeStuff.every((x) => typeof x === 'string')) {
                    const enumValues: string[] = []
                    for (const enumValue of typeStuff) {
                        enumValues.push(enumValue)
                    }
                    const hash = enumValues.sort().join('|')
                    const similarEnum = this.knownEnums.get(hash)
                    if (similarEnum != null) typeName = similarEnum.name
                    else {
                        typeName = `enum_${nodeTypeName}_${inputName}`
                        this.knownEnums.set(hash, { name: typeName, values: enumValues })
                    }
                } else {
                    throw new Error('object type not supported')
                }
                if (typeName) {
                    node.inputs.push({ name: inputName, type: typeName, opts: typeOpts })
                } else {
                    console.log({ ipt, typeDef, typeStuff })
                    console.log({ typeStuff })
                    throw new Error('object type not supported')
                }
            }
        }
    }
    codegenDTS = (): string => {
        const b = new CodeBuffer()
        const p = b.w
        p(`import type { ComfyNodeOutput } from './ComfyNodeOutput'`)
        p(`import type { ComfyNodeSchema } from './ComfyNodeSchema'`)
        p(`import type { ComfyNodeUID } from './ComfyNodeUID'`)
        p(`import type { ComfyNode } from './ComfyNode'`)

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
            if (e.values.length > 0) p(`export type ${e.name} = ${e.values.map((v) => `'${v}'`).join(' | ')}`)
            else p(`export type ${e.name} = never`)
        }

        p(`\n// INTERFACES --------------------------`)
        for (const t of this.knownTypes.values()) {
            p(`export interface HasSingle_${t} { _${t}: ${t} } // prettier-ignore`)
        }
        for (const t of this.knownEnums.values()) {
            p(`export interface HasSingle_${t.name} { _${t.name}: ${t.name} } // prettier-ignore`)
        }

        p(`\n// NODES -------------------------------`)
        for (const n of this.nodes) p(n.codegen())

        p(`\n// INDEX -------------------------------`)
        // p(`export const nodes = {`)
        // for (const n of this.nodes) p(`    ${n.name},`)
        // p(`}`)
        // p(`export type NodeType = keyof typeof nodes`)

        p(`export type Schemas = {`)
        for (const n of this.nodes) p(`    ${n.name}: ComfyNodeSchema,`)
        p(`}`)
        p(`export type ComfyNodeType = keyof Schemas`)

        p(`\n// Entrypoint --------------------------`)
        p(`export interface ComfySetup {`)

        // prettier-ignore
        for (const n of this.nodes) {
            p(`    ${n.name}(args: ${n.name}_input, uid?: ComfyNodeUID): ${n.name}`)
        }
        p(`\n// misc \n`)
        // prettier-ignore
        // for (const n of this.nodes) {
        //     p(`    ${n.category}_${n.name} = (args: ${n.name}_input, uid?: rt.NodeUID) => new ${n.name}(this, uid, args)`)
        // }
        p(`}`)
        // b.writeTS('./src/core/Comfy.ts')
        return b.content
    }

    private toTSType = (t: string) => PRIMITIVES[t] ?? `ComfyNodeOutput<'${t}'>`
}

export class ComfyNodeSchema {
    constructor(
        //
        public name: string,
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
        ifaces.push(`ComfyNode<${this.name}_input>`)
        // inputs
        // p(`\n// ${this.name} -------------------------------`)
        b.bar(this.name)
        p(`export interface ${this.name} extends ${ifaces.join(', ')} {`)
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

        p(`export type ${this.name}_input = {`)
        for (const i of this.inputs) {
            const type = PRIMITIVES[i.type] ? i.type : `${i.type} | HasSingle_${i.type}`
            p(`    ${i.name}: ${type}`)
        }
        p(`}`)

        return b.content
    }
}

// console.log(`test`)
// const main = new ComfyTypingsGenerator(spec2 as any)
// main.codegen()
