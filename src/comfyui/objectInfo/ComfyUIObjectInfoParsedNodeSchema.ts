import type { ComfyUnionInfo, NodeInputExt, NodeOutputExt } from '../comfyui-types'
import type { ComfyInputOpts, ComfyNodeSchemaJSON } from './ComfyUIObjectInfoTypes'

import { ComfyPrimitiveMapping } from '../../core/Primitives'
import { CodeBuffer } from '../../utils/codegen/CodeBuffer'
import { escapeJSKey } from '../../utils/codegen/escapeJSKey'

export type NodeOwnEnum = { in: 'input' | 'output'; ownName: string; enum: ComfyUnionInfo }
/**
 *
 */
export class ComfyUIObjectInfoParsedNodeSchema {
   /** list of types the node has a single output of */
   _singleOuputs: Maybe<NodeOutputExt[]> = null
   get singleOuputs(): NodeOutputExt[] {
      if (this._singleOuputs != null) return this._singleOuputs
      const x: { [key: string]: number } = {}
      for (const i of this.outputs) x[i.typeName] = (x[i.typeName] ?? 0) + 1
      this._singleOuputs = this.outputs.filter((i) => x[i.typeName] === 1)
      return this._singleOuputs
   }

   constructor(
      public raw: ComfyNodeSchemaJSON,
      public nameInComfy: string,
      public nameInCushy: string, // same but qualified to keep track of pythonNamespace
      public category: string,
      public inputs: NodeInputExt[],
      public outputs: NodeOutputExt[],
      public pythonModule: string,
   ) {
      if (this.nameInCushy !== this.nameInCushy) {
         throw new Error(`[🔴] invariant violation: ${this.nameInCushy}  !== ${this.nameInCushy}`)
      }
      this.category = this.category.replaceAll('/', '_')
   }

   codegenUI(): string {
      const b = new CodeBuffer()
      const p = b.w
      p(`   ${escapeJSKey(this.nameInCushy)}: {`)
      this.inputs.forEach((i, ix) => {
         // 1/3
         if (i.isPrimitive) {
            const tsType = ComfyPrimitiveMapping[i.typeName]
            if (tsType == null) return console.log(`[🔶] invariant violation`)
            p(`      ${escapeJSKey(i.nameInComfy)}: { kind: '${tsType}', type: ${tsType} }`)
         }
         // 2/3
         else if (i.isEnum) {
            p(`      ${escapeJSKey(i.nameInComfy)}: { kind: 'enum', type: Union['${i.typeName}'] }`)
            // p(`      ${escapeJSKey(i.nameInComfy)}: { kind: 'enum', type: '${this.nameInCushy}.${i.nameInComfy}' }`) // prettier-ignore
         }
         // 3/3
         else {
            p(`      // ${escapeJSKey(i.nameInComfy)}: { kind: 'object', type: ${i.typeName} }`)
         }
      })
      p(`   }`)
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
