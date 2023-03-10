import { CodeBuffer } from '../generator/CodeBuffer'
import { NodeInput, NodeOutput } from './ComfyNodeSchema'
import spec from './ComfySpec.json' assert { type: 'json' }

const entries = Object.entries(spec)

export type EnumHash = string
export type EnumName = string

const PRIMITIVES: { [key: string]: string } = {
    FLOAT: 'number',
    INT: 'number',
    STRING: 'string',
}

export class LibCodegenerator {
    knownTypes = new Set<string>()
    knownEnums = new Map<EnumHash, { name: EnumName; values: string[] }>()
    nodes: NodeDecl[] = []

    constructor() {
        for (const [nodeName, nodeDef] of entries) {
            const requiredInputs = Object.entries(nodeDef.input.required)
            const inputs: NodeInput[] = []
            const outputs: NodeOutput[] = []
            const node = new NodeDecl(nodeName, nodeDef.category, inputs, outputs)
            this.nodes.push(node)
            const outputNamer: { [key: string]: number } = {}
            for (const opt of nodeDef.output) {
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
                        typeName = `enum_${nodeName}_${inputName}`
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

    toTSType = (t: string) => PRIMITIVES[t] ?? `ComfyNodeOutput<'${t}'>`

    codegen = (): void => {
        const b = new CodeBuffer()
        const p = b.w
        p(`import { ComfyNodeOutput } from './ComfyNodeOutput'`)
        p(`import { ComfyNodeSchema } from './ComfyNodeSchema'`)
        p(`import { ComfyNodeUID } from './ComfyNodeUID'`)
        p(`import { ComfyNode } from './ComfyNode'`)
        p(`import { ComfyScript } from './ComfyScript'`)

        p(`\n// TYPES -------------------------------`)
        const types = [...this.knownTypes.values()] //
            .map((comfyType) => ({ comfyType, tsType: this.toTSType(comfyType) }))
            .sort((a, b) => b.tsType.length - a.tsType.length)

        for (const t of types) {
            // const tsType = this.toTSType(t)
            p(`type ${t.comfyType} = ${t.tsType}`)
        }

        p(`\n// ENUMS -------------------------------`)
        for (const e of this.knownEnums.values()) {
            if (e.values.length > 0) p(`type ${e.name} = ${e.values.map((v) => `'${v}'`).join(' | ')}`)
            else p(`type ${e.name} = never`)
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
        p(`export const nodes = {`)
        for (const n of this.nodes) p(`    ${n.name},`)
        p(`}`)
        p(`export type NodeType = keyof typeof nodes`)

        p(`export const schemas = {`)
        for (const n of this.nodes) p(`    ${n.name}: ${n.name}_schema,`)
        p(`}`)
        p(`export type ComfyNodeType = keyof typeof nodes`)

        p(`\n// Entrypoint --------------------------`)
        p(`export class Comfy extends ComfyScript {`)

        // prettier-ignore
        for (const n of this.nodes) {
            p(`    ${n.name} = (args: ${n.name}_input, uid?: ComfyNodeUID) => new ${n.name}(this, uid, args)`)
        }
        p(`\n// misc \n`)
        // prettier-ignore
        // for (const n of this.nodes) {
        //     p(`    ${n.category}_${n.name} = (args: ${n.name}_input, uid?: rt.NodeUID) => new ${n.name}(this, uid, args)`)
        // }
        p(`}`)
        b.writeTS('./src/core/Comfy.ts')
    }
}

export class NodeDecl {
    constructor(
        //
        public name: string,
        public category: string,
        public inputs: NodeInput[],
        public outputs: NodeOutput[],
    ) {
        this.category = this.category.replaceAll('/', '_')
    }

    codegen() {
        const b = new CodeBuffer()
        const p = b.w
        // inputs
        // p(`\n// ${this.name} -------------------------------`)
        b.bar(this.name)
        p(`export class ${this.name} extends ComfyNode<${this.name}_input>{`)
        p(`    $schema = ${this.name}_schema`)
        this.outputs.forEach((i, ix) => {
            p(`    ${i.name} = new ComfyNodeOutput<'${i.type}'>(this, ${ix}, '${i.type}')`)
        })
        // INTERFACE
        let x: { [key: string]: number } = {}
        for (const i of this.outputs) x[i.type] = (x[i.type] ?? 0) + 1
        for (const i of this.outputs) {
            if (x[i.type] === 1) p(`    get _${i.type}() { return this.${i.name} } // prettier-ignore`)
        }
        // CLASS END
        p(`}`)

        p(`// prettier-ignore`)
        p(`export const ${this.name}_schema: ComfyNodeSchema = {`)
        p(`    type: '${this.name}',`)
        p(`    input: ${JSON.stringify(this.inputs)},`)
        p(`    outputs: ${JSON.stringify(this.outputs)},`)
        p(`    category: ${JSON.stringify(this.category)},`)
        p(`}`)

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
const main = new LibCodegenerator()
main.codegen()
