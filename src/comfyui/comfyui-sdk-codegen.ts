import type { ParsedObjectInfo } from './ParsedComfyUIObjectInfo'

import { ComfyPrimitiveMapping } from '../core/Primitives'
import { CodeBuffer } from '../utils/codegen/CodeBuffer'
import { escapeJSKey } from '../utils/codegen/escapeJSKey'
import { wrapQuote } from './ParsedComfyUIObjectInfoNodeSchema'

export function codegenSDK(
   //
   this: ParsedObjectInfo,
   {
      // options with their defaults
      prefix = '../src/',
   }: { prefix?: string },
): string {
   const b = new CodeBuffer()
   const p = b.w

   p('')
   p(`import type { ComfyNode } from '${prefix}core/ComfyNode'`)
   p(`import type { ComfyNodeMetadata } from '${prefix}types/ComfyNodeID'`)
   p(`import type { ComfyNodeOutput } from '${prefix}core/Slot'`)
   p(`import type { ComfyNodeSchemaJSON } from '${prefix}types/ComfySchemaJSON'`)
   p('')
   // p(`import type { GlobalFunctionToDefineAnApp } from '${prefix}cards/App'`)
   // p(`import type { GlobalFunctionToDefineAnApp, GlobalFunctionToDefineAView, GlobalGetCurrentForm, GlobalGetCurrentRun } from '${prefix}cards/App'`) // prettier-ignore
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
   // p(`/** @deprecated use the global 'app' function instead to register an app */`)
   // p(`const action: GlobalFunctionToDefineAnApp`)
   // p(``)
   // p(`/** @deprecated use the global 'app' function instead to register an app */`)
   // p(`const card: GlobalFunctionToDefineAnApp`)
   // p(``)
   // p(`const app: GlobalFunctionToDefineAnApp`)
   // p(`const view: GlobalFunctionToDefineAView`)
   // p(`const getCurrentForm: GlobalGetCurrentForm`)
   // p(`const getCurrentRun: GlobalGetCurrentRun`)
   // p(``)
   // p(`const actionTags: ActionTags`)
   p(``)
   p(`\n// 0. Entrypoint --------------------------`)
   // p(`export type _INVALID_null = any {`)
   p(`export interface ComfySetup {`)
   // prettier-ignore
   for (const n of this.nodes) {
               p(`    /* category:${n.category}, name:"${n.nameInComfy}", output:${n.outputs.map(o => o.nameInCushy).join('+')} */`)
               p(`    ${n.nameInCushy}(p: ${n.nameInCushy}_input, meta?: ComfyNodeMetadata): ${n.nameInCushy}`)
           }
   p(`}`)

   // #region Requireables
   p(`\n// 1. Requirable --------------------------`)
   p(`export interface Requirable {`)
   const requirables = this.requirables
   for (const n of requirables)
      p(`    ${escapeJSKey(n.name)}: { $Name: ${JSON.stringify(n.name)}, $Value: ${n.name} },`)
   p(`}`)

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
   p(`\n// 4. TYPES -------------------------------`)

   // ⏸️ for (const t of slotTypes) {
   // ⏸️     // const tsType = this.toTSType(t)
   // ⏸️     p(`export type ${t.slotTypeAlias} = ${t.tsType}`)
   // ⏸️ }

   p(`\n// 5. ACCEPTABLE INPUTS -------------------------------`)
   p(`export type _INVALID_null = any`)
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
