import type { NodeInputExt, NodeOutputExt } from './comfyui-types'
import type { ComfyInputOpts } from './ComfyUIObjectInfoTypes'

import { ComfyPrimitiveMapping } from '../core/Primitives'
import { CodeBuffer } from '../utils/codegen/CodeBuffer'
import { escapeJSKey } from '../utils/codegen/escapeJSKey'

/**
 *
 */
export class ComfyUIObjectInfoParsedNodeSchema {
   /** list of types the node has a single output of */
   singleOuputs: NodeOutputExt[] = []

   constructor(
      public nameInComfy: string,
      public nameInCushy: string,
      public category: string,
      public inputs: NodeInputExt[],
      public outputs: NodeOutputExt[],
      public pythonModule: string,
   ) {
      this.category = this.category.replaceAll('/', '_')
   }

   codegenUI(): string {
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
      const x: { [key: string]: number } = {}
      for (const i of this.outputs) x[i.typeName] = (x[i.typeName] ?? 0) + 1
      this.singleOuputs = this.outputs.filter((i) => x[i.typeName] === 1)
      const ifaces = this.singleOuputs.map((i) => `HasSingle_${i.typeName}`)
      ifaces.push(`ComfyNode<${this.nameInCushy}_input, ${this.nameInCushy}_output>`)
      // inputs
      // p(`\n// ${this.name} -------------------------------`)
      // const msgIfDifferent = this.nameInComfy !== this.nameInCushy ? ` ("${this.nameInComfy}" in ComfyUI)` : ''
      p(`// --------------------------------------------------------------------------------------------`)
      p(`// #region ${this.nameInComfy} [${this.category}]`)
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

export const wrapQuote = (s: string): string => {
   if (s.includes("'")) return `"${s}"`
   return `'${s}'`
}
