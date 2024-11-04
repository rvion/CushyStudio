import type { ComfyUIObjectInfoParsed } from './ComfyUIObjectInfoParsed'

import { convetComfySlotNameToCushySlotNameValidInJS } from '../core/normalizeJSIdentifier'
import { ComfyPrimitiveMapping } from '../core/Primitives'
import { CodeBuffer } from '../utils/codegen/CodeBuffer'
import { escapeJSKey } from '../utils/codegen/escapeJSKey'
import { wrapQuote } from './ComfyUIObjectInfoParsedNodeSchema'

export function codegenSDK(
   this: ComfyUIObjectInfoParsed,
   {
      // options with their defaults
      prefix = '../src/',
   }: { prefix?: string },
): {
   main: string
   pythonModules: {
      pythonModule: string
      content: string
   }[]
} {
   const b = new CodeBuffer()
   const px = new (class {
      constructor() {}
      buffers = new Map<string, CodeBuffer>()
      get pythonModules(): {
         pythonModule: string
         content: string
      }[] {
         return [...this.buffers.entries()].map(([k, v]) => ({
            pythonModule: k,
            content: v.content,
         }))
      }
      get(pythonModule: string): CodeBuffer {
         if (!this.buffers.has(pythonModule)) {
            const b2 = new CodeBuffer()
            this.buffers.set(pythonModule, b2)
            const p = b2.w
            p(`import type { ComfyNode } from '${prefix}core/ComfyNode'`)
            p(`import type { ComfyNodeMetadata } from '${prefix}types/ComfyNodeID'`)
            p(`import type { ComfyNodeOutput } from '${prefix}core/Slot'`)
            p(`import type { ComfyNodeSchemaJSON } from '${prefix}comfyui/ComfyUIObjectInfoTypes'`)
            p('')
            p('declare global {')
            b2.indent()
            p('namespace ComfyUI {')
            b2.indent()
            p(`namespace ${pythonModuleToNamespace(pythonModule)} {`)
            b2.indent()
         }
         return this.buffers.get(pythonModule)!
      }
   })()
   const p = b.w

   for (const x of this.pythonModules.keys()) px.get(x)

   p('')
   p(`import type { ComfyNode } from '${prefix}core/ComfyNode'`)
   p(`import type { ComfyNodeMetadata } from '${prefix}types/ComfyNodeID'`)
   p(`import type { ComfyNodeOutput } from '${prefix}core/Slot'`)
   p(`import type { ComfyNodeSchemaJSON } from '${prefix}comfyui/ComfyUIObjectInfoTypes'`)

   p(`declare global {`)
   p(``)

   // #region PythonModulesAvaialbles ------------------------------------------------
   // This is direcltly in the global/ComfyUI
   // it shows the list of all modules we have installed
   p(`// #${''}region PythonModulesAvaialbles`)
   p(`export type PythonModulesAvaialbles = `)
   for (const [k, v] of this.pythonModules.entries()) {
      p(`    | ${wrapQuote(k)} // ${v.join(', ')}`)
   }
   p(`// #${''}endregion `)
   // #endregion

   // #region NODES INDEX -------------------------------------------------------------
   // p(`export type _INVALID_null = any {`)
   for (const b2 of px.buffers.values()) {
      b2.w(`// #${''}region NODES INDEX`)
      b2.w(`export interface NODES {`)
   }
   // p(`export interface NODES {`)
   for (const n of this.nodes) {
      const b2 = px.get(n.pythonModule)
      b2.w(`    /* category:${n.category}, name:"${n.nameInComfy}", output:${n.outputs.map((o) => o.nameInCushy).join('+')} */`) // prettier-ignore
      b2.w(`    ${n.nameInCushy}(p: ${n.nameInCushy}_input, meta?: ComfyNodeMetadata): ${n.nameInCushy}`)
   }
   for (const b2 of px.buffers.values()) b2.w(`}`)
   // p(`}`)

   // #region Requireables
   p(`// #${''}region 1. Enums`)
   p(`export interface Requirable {`)
   const requirables = this.requirables
   for (const n of requirables)
      p(`    ${escapeJSKey(n.name)}: { $Name: ${JSON.stringify(n.name)}, $Value: ${n.name} },`)
   p(`}`)
   p(`// #${''}endregion`)
   // #endregion

   // #region Embeddings
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

   // #region Suggestions
   p(`\n// 3. Suggestions -------------------------------`)
   p(`// 3.1. primitives`)
   for (const [k, value] of Object.entries(ComfyPrimitiveMapping)) {
      p(`export interface CanProduce_${value} {}`)
   }
   p(`// 3.1. types produced`)
   // for (const [tp, nns] of Object.entries(this.nodesByProduction)) {
   // }
   for (const tp of slotTypes) {
      const producingNodes: Maybe<string[]> = this.nodesByProduction[tp.comfyType]

      if (producingNodes)
         p(
            `export interface CanProduce_${tp.comfyType} extends Pick<ComfySetup, ${producingNodes
               .map((i) => `'${i}'`)
               .join(' | ')}> { }`,
         )
      else p(`export interface CanProduce_${tp.comfyType} {} // 🔶 no node can output this type.`)
   }

   // #region Types
   // ⏸️ p(`\n// 4. TYPES -------------------------------`)
   // ⏸️ for (const t of slotTypes) {
   // ⏸️     // const tsType = this.toTSType(t)
   // ⏸️     p(`export type ${t.slotTypeAlias} = ${t.tsType}`)
   // ⏸️ }

   p(`\n// 5. ACCEPTABLE INPUTS -------------------------------`)
   p(`export type _INVALID_null = any`)
   for (const t of slotTypes) {
      p( `export type _${t.comfyType} = ${t.tsType} | HasSingle_${t.comfyType} | ((x: CanProduce_${t.comfyType}) => _${t.comfyType})`, ) // prettier-ignore
   }

   p(`\n// 6. ENUMS -------------------------------`)
   const allAcceptableEnums: string[] = []
   for (const e of this.knownEnumsByHash.values()) {
      if (e.values.length > 0) {
         allAcceptableEnums.push(e.enumNameInCushy)
         p(
            `/* 🔴 */export type ${e.enumNameInCushy} = ${e.values.map((v) => `${JSON.stringify(v)}`).join(' | ')}`,
         )
         for (const { enumNameAlias, pythonModule } of e.aliases) {
            allAcceptableEnums.push(enumNameAlias)
            p(`/* 🟢 */export type ${enumNameAlias} = ComfyUI.${e.pythonModule}.${e.enumNameInCushy}`)
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
   for (const n of this.nodes) {
      const b = px.get(n.pythonModule)
      b.w(n.codegen())
      // p(n.codegen())
   }

   // #region AutoForm type Helper
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

   for (const x of this.pythonModules.keys()) {
      const b2 = px.get(x)
      b2.deindent()
      b2.w('}')
      b2.deindent()
      b2.w('}')
      b2.deindent()
      b2.w('}')
   }

   return {
      main: b.content,
      pythonModules: px.pythonModules,
   }
}

function pythonModuleToNamespace(pythonModule: string): string {
   let x = pythonModule
   x = x.replace('custom_nodes.ComfyUI-', '')
   return convetComfySlotNameToCushySlotNameValidInJS(x)
}
