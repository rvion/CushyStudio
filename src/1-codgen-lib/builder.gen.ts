import spec from './nodes.json' assert { type: 'json' }

const entries = Object.entries(spec)

export type NodeInput = { name: string; type: string; opts: any }
export type NodeOutput = { type: string; name: string }
export type EnumHash = string
export type EnumName = string
export class NodeDecl {
    constructor(
        //
        public name: string,
        public inputs: NodeInput[],
        public outputs: NodeOutput[],
    ) {
    }
    codegen() {
        const out: string[] = []
        const p = (x: string) => out.push(x)
        // inputs
        p(`\n// ${this.name} -------------------------------`)
        p(`export class ${this.name} {`)
        p(`    static inputs = ${JSON.stringify(this.inputs)}`)
        p(`    static outputs = ${JSON.stringify(this.outputs)}`)
        p(`    constructor(public comfy: Comfy, public p: ${this.name}_input)`)
        p(`    {}`)
        this.outputs.forEach((i) => {
            p(`    ${i.name} = new rt.Signal<'${i.type}'>('${i.type}')`)
        })
        p(`}`)
        p(`export type ${this.name}_input = {`)
        this.inputs.forEach((i) => p(`    ${i.name}: ${i.type}`))
        p(`}`)

        return out.join('\n')
    }
}

import * as mod from 'https://deno.land/std@0.119.0/hash/mod.ts'
import { saveTsFile } from '../0-utils/saveTsFile.ts'

export class MAIN {
    knownTypes = new Set<string>()
    knownNodes: string[] = []
    knownEnums = new Map<EnumHash, { name: EnumName; values: string[] }>()
    nodes: NodeDecl[] = []

    constructor() {
        for (const [nodeName, nodeDef] of entries) {
            this.knownNodes.push(nodeName)
            // console.log(nodeName)
            const requiredInputs = Object.entries(nodeDef.input.required)
            const inputs: NodeInput[] = []
            const outputs: NodeOutput[] = []
            const node = new NodeDecl(nodeName, inputs, outputs)
            this.nodes.push(node)
            const outputNamer: { [key: string]: number } = {}
            for (const opt of nodeDef.output) {
                const at = outputNamer[opt] ??= 0
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
                    const hasher = mod.createHash('sha256')
                    const enumValues: string[] = []
                    for (const enumValue of typeStuff) {
                        hasher.update(enumValue)
                        enumValues.push(enumValue)
                    }
                    const hash = hasher.toString()
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

    toTSType = (t: string) => {
        if (t === 'FLOAT') return 'number'
        if (t === 'INT') return 'number'
        if (t === 'STRING') return 'string'
        return `rt.Signal<'${t}'>`
    }

    codegen = (): string => {
        let out = ''
        const p = (txt: string) => out += txt + '\n'
        p(`import * as rt from './runtime.ts'`)

        p(`// TYPES -------------------------------`)
        for (const t of this.knownTypes.values()) {
            const tsType = this.toTSType(t)
            p(`type ${t} = ${tsType}`)
        }

        p(`\n// ENUMS -------------------------------`)
        for (const e of this.knownEnums.values()) {
            if (e.values.length > 0) p(`type ${e.name} = ${e.values.map((v) => `'${v}'`).join(' | ')}`)
            else p(`type ${e.name} = never`)
        }
        p(`\n// NODES -------------------------------`)
        for (const n of this.nodes) p(n.codegen())

        p(`\n// INDEX -------------------------------`)
        p(`export const nodes = {`)
        for (const n of this.knownNodes) p(`    ${n},`)
        p(`}`)
        p(`export type NodeType = keyof typeof nodes`)

        p(`\n// Entrypoint --------------------------`)
        p(`export class Comfy {`)
        for (const n of this.knownNodes) p(`    ${n}= (args: ${n}_input) => new ${n}(this, args)`)
        p(`}`)

        return out
    }
}
// console.log(`test`)
const main = new MAIN()
const code = main.codegen()
await saveTsFile('./src/2-lib/builder.ts', code)
