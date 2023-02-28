import spec from '../spec/nodes-2023-02-28.json' assert { type: 'json' }
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
        p(`    constructor(public p: ${this.name}_input){}`)
        // p(`    }`)
        p(`}`)
        p(`export type ${this.name}_input = {`)
        this.inputs.forEach((i) => {
            p(`    ${i.name}: ${i.type}`)
        })
        p(`}`)
        // outputs
        p(`export type ${this.name}_output = {`)
        this.outputs.forEach((i) => {
            p(`    ${i.name}: ${i.type}`)
        })
        p(`}`)

        return out.join('\n')
    }
}

import * as mod from 'https://deno.land/std@0.119.0/hash/mod.ts'

export class MAIN {
    knownTypes = new Set()
    knownEnums = new Map<EnumHash, { name: EnumName; values: string[] }>()
    nodes: NodeDecl[] = []

    constructor() {
        for (const [nodeName, nodeDef] of entries) {
            console.log(nodeName)
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
    codegen = (): string => {
        return [
            `// TYPES -------------------------------`,
            ...[...this.knownTypes.values()].map((t) => `type ${t} = any`),
            `\n// ENUMS -------------------------------`,
            ...[...this.knownEnums.values()].map((e) => {
                if (e.values.length > 0) {
                    return `type ${e.name} = ${e.values.map((v) => `'${v}'`).join(' | ')}`
                }
                return `type ${e.name} = never`
            }),
            this.nodes.map((n) => n.codegen()).join('\n'),
        ].join('\n')
    }
}

const main = new MAIN()
const code = main.codegen()
Deno.writeTextFileSync('./src/builder.ts', code)
