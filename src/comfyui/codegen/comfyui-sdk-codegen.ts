import type { ComfyUIObjectInfoParsed } from '../objectInfo/ComfyUIObjectInfoParsed'

import { CodeBuffer } from '../../utils/codegen/CodeBuffer'
import { escapeJSKey } from '../../utils/codegen/escapeJSKey'
import {
   type ComfyUIObjectInfoParsedNodeSchema,
   wrapQuote,
} from '../objectInfo/ComfyUIObjectInfoParsedNodeSchema'

export function codegenSDK(
   this: ComfyUIObjectInfoParsed,
   {
      // options with their defaults
      prefix = '../src/',
   }: { prefix?: string } = {},
): string {
   const b = new CodeBuffer()
   const p = b.w

   // #region Core Imports ----------------------------------------------------------------------------------
   p(`import type { ComfyNode } from '${prefix}comfyui/livegraph/ComfyNode'`)
   p(`import type { ComfyNodeOutput } from '${prefix}comfyui/livegraph/ComfyNodeOutput'`)
   p(`import type { ComfyNodeMetadata } from '${prefix}types/ComfyNodeID'`)
   p(`import type { ComfyNodeSchemaJSON } from '${prefix}comfyui/objectInfo/ComfyUIObjectInfoTypes'`)
   p(``)

   p(`declare global {`)
   b.indent()

   p(`namespace Comfy {`)
   b.indent()

   // #region PythonModulesAvaialbles -----------------------------------------------------------------------
   // This is direcltly in the global/ComfyUI;  shows the list of all modules we have installed
   p(`// #${''}region PythonModulesAvaialbles`)
   p(`export type PythonModulesAvaialbles = `)
   b.indent()
   const pythonModulesArr: [string, string[]][] = Array.from(this.pythonModules.entries()) //
      .toSorted((a, b) => a[0].localeCompare(b[0]))
   for (const [k, v] of pythonModulesArr) {
      p(`/**`)
      // p(` * SDK Namespace: ${pythonModuleToNamespace(k)}`)
      p(`* Nodes: ${v.join(', ')}`)
      p(`*/`)
      p(`| ${wrapQuote(k)}`)
   }
   b.deindent()
   p(`// #${''}endregion`)

   // #region INPUTS ----------------------------------------------------------------------------------------
   const nodes = this.nodes.toSorted((a, b) => a.nameInCushy.localeCompare(b.nameInCushy))
   p(`interface IN {`)
   b.indent()
   for (const n of nodes) {
      p(`${escapeJSKey(n.nameInCushy)}: {`)
      for (const i of n.inputs) {
         const opts = typeof i.opts === 'string' ? null : i.opts
         const type = `Signal['${i.typeName}']`
         // const type = i.type.startsWith('E_') //
         //    ? `Union['${i.type}']`
         //    : `Signal['${i.type}']`
         if (opts) p(`    ${n.renderOpts(opts)}`)
         const canBeOmmited = opts?.default !== undefined || !i.required
         p(`    ${i.nameInComfyEscaped}${canBeOmmited ? '?' : ''}: ${type}`)
      }
      p(`},`)
   }
   b.deindent()
   p('}')
   p('')

   // #region OUTPUTS ---------------------------------------------------------------------------------------
   p(`interface OUT {`)
   b.indent()
   for (const n of nodes) {
      p(`${escapeJSKey(n.nameInCushy)}: {`)
      n.outputs.forEach((i, ix) => {
         p(`   ${escapeJSKey(i.nameInCushy)}: ComfyNodeOutput<'${i.typeName}', ${ix}>,`)
      })
      p(`}`)
   }
   b.deindent()
   p('}')

   // #region NODES -----------------------------------------------------------------------------------------
   p(`interface Node {`)
   for (const n of nodes) {
      p(`   ${escapeJSKey(n.nameInCushy)}: ComfyNode<IN['${n.nameInCushy}'], OUT['${n.nameInCushy}']> & {`)
      for (const hassingle of n.singleOuputs) {
         p(`      ${escapeJSKey(`_${hassingle.typeName}`)}: ComfyNodeOutput<'${hassingle.typeName}'>`)
         // const ifaces = this.singleOuputs.map((i) => `HasSingle_${i.typeName}`)
      }
      p(`   }`)
   }
   p('}')

   // #region BUILDER ---------------------------------------------------------------------------------------
   p(`interface Builder {`)
   for (const n of nodes) {
      // p(`    ${n.nameInCushy},`)
      const baseDescription = `displayName="${n.raw.display_name}" category="${n.category}" name="${n.nameInComfy}" output=[${n.outputs.map((o) => o.nameInCushy).join(', ')}]`
      if (n.raw.description) {
         p(`   /**`)
         p(n.raw.description .split('\n').map((i) => `    * ${i}`).join('\n')) // prettier-ignore
         // p(`    *`)
         p(`    * ${baseDescription}`) // prettier-ignore
         p(`   **/`)
      } else {
         p(`    /** ${baseDescription} */`) // prettier-ignore
      }
      p(
         `   ${escapeJSKey(n.nameInCushy)}(p: IN['${n.nameInCushy}'], meta?: ComfyNodeMetadata): Node['${n.nameInCushy}']`,
      )
   }
   p(`}`)

   // #region SLOTS -----------------------------------------------------------------------------------------
   p(`interface Slots {`)
   // const requirables = this.requirables
   for (const e of this.knownUnionByHash.values()) {
      p('   // ' + e.unionNameInCushy)
      for (const alias of e.enumNames) {
         const enumKey = alias
         // p(`    ${escapeJSKey(enumKey)}: { $Name: ${JSON.stringify(enumKey)},'{value}': Union.${e.unionNameInCushy} },`) // prettier-ignore
         p(`   ${escapeJSKey(enumKey)}: Union['${e.unionNameInCushy}']`) // prettier-ignore
      }
   }
   // for (const n of requirables)
   //    p(`    ${escapeJSKey(n.name)}: { $Name: ${JSON.stringify(n.name)},'{value}': Union.${n.enum.enumNameInCushy} },`) // prettier-ignore
   p(`}`)

   // #region Embeddings ------------------------------------------------------------------------------------
   p(`type Embeddings = ${this.data.embeddings.map((e) => wrapQuote(e)).join(' | ') || '""'}`)

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

   // #region Producer --------------------------------------------------------------------------------------
   p('')
   p('interface Producer {')
   b.indent()
   // p(`// 3.1. primitives`)
   // for (const [k, value] of Object.entries(ComfyPrimitiveMapping))
   //    p(`export interface CanProduce_${value} {}`)
   // p(`// 3.1. types produced`)
   // for (const [tp, nns] of Object.entries(this.nodesByProduction)) {
   // }
   for (const tp of slotTypes) {
      const allProducingNodes: Maybe<ComfyUIObjectInfoParsedNodeSchema[]> =
         this.nodesByProduction[tp.comfyType]

      // 1/2 Empty Interface
      if (allProducingNodes) {
         p(`${escapeJSKey(tp.comfyType)}: Pick<Builder, ${allProducingNodes.map((i) => `'${i.nameInCushy}'`).join(' | ')}>`) // prettier-ignore
      }
      // 2/2 Empty Interface
      else {
         p(`${escapeJSKey(tp.comfyType)}: {}, // no node can output this type.`)
      }
   }
   b.deindent()
   p('}')
   // #endregion

   // #region Types -----------------------------------------------------------------------------------------
   p(`interface Signal {`)
   b.indent()
   // 1/3
   p('// Injected `Bottom` signal')
   p(`INVALID_null: any`)

   // 2/3
   p('')
   p('// Named signals found across all nodes')
   for (const t of slotTypes) {
      p(`${escapeJSKey(t.comfyType)}: ${t.tsType} | HasSingle['${(t.comfyType)}'] | ((x: Producer['${t.comfyType}']) => Signal['${t.comfyType}'])`, ) // prettier-ignore
   }

   // 3/3
   p('')
   p('// Unnamed signals (Unions) found across all nodes')
   for (const t of this.knownUnionByHash.values()) {
      p(`${escapeJSKey(t.unionNameInCushy)}: Union['${t.unionNameInCushy}'] | ComfyNodeOutput<'${t.unionNameInCushy}'> `, ) // prettier-ignore
   }
   b.deindent()
   p(`}\n`)

   // #region Union -----------------------------------------------------------------------------------------
   p('interface Union {')
   for (const e of this.knownUnionByHash.values()) {
      if (e.values.length > 0) {
         p(`   // ${JSON.stringify(e.enumNames)}`)
         // p(`type ${e.unionNameInCushy} = ${e.values.map((v) => `${JSON.stringify(v)}`).join(' | ')}`)
         p(`   ${e.unionNameInCushy}: ${e.values.map((v) => `${JSON.stringify(v)}`).join(' | ')}`)
      } else {
         // p(`type ${e.unionNameInCushy} = '🔴' // never`)
         p(`    ${e.unionNameInCushy}: '🔴' // never`)
      }
   }
   p('}')

   // #region HasSingle -------------------------------------------------------------------------------------
   p(`export interface HasSingle {`)
   for (const t of slotTypes) {
      p(`    ${escapeJSKey(t.comfyType)}: { '_${t.comfyType}': ${t.tsType} } // prettier-ignore`)
   }
   p(`}`)

   // knownEnumOutput // fixme
   for (const t of this.enumsAppearingInOutput.values()) {
      p(`export interface HasSingle_${t} { _${t}: Union['${t}'] } // prettier-ignore`)
   }

   // #region AutoForm type Helper ---------------------------------------------------------------------------
   p(`interface FormHelper {`)
   for (const n of this.nodes) b.w(n.codegenUI())
   p(`}`)

   // #region INDEX -----------------------------------------------------------------------------------------
   p(`// TODO rename to ObjecInfoContent`)
   p(`export type Schemas = {[k in ComfyNodeType]: ComfyNodeSchemaJSON}`)
   // for (const n of this.nodes) p(`    ${n.nameInCushy}: ComfyNodeSchemaJSON,`)
   // p(`}`)
   p(`export type ComfyNodeType = ${this.nodes.map((i) => `'${i.nameInCushy}'`).join(' | ')}`)
   b.deindent()
   p(`}`) // 🔴

   b.deindent()
   p('}')

   return b.content
   // pythonModules: px.pythonModules,
}
