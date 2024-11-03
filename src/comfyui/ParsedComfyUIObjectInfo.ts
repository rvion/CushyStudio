import type { ComfyEnumDef, ComfyNodeSchemaJSON, ComfySchemaJSON } from '../types/ComfySchemaJSON'
import type {
   EnumHash,
   EnumInfo,
   EnumName,
   EnumValue,
   NodeInputExt,
   NodeNameInCushy,
   NodeOutputExt,
} from './comfyui-types'

import { observable, toJS } from 'mobx'

import {
   convertComfyNodeNameToCushyNodeNameValidInJS,
   convetComfySlotNameToCushySlotNameValidInJS,
   normalizeJSIdentifier,
} from '../core/normalizeJSIdentifier'
import { ComfyPrimitiveMapping, ComfyPrimitives } from '../core/Primitives'
import {
   ComfyDefaultNodeWhenUnknown_Name,
   ComfyDefaultNodeWhenUnknown_Schema,
} from '../models/ComfyDefaultNodeWhenUnknown'
import { escapeJSKey } from '../utils/codegen/escapeJSKey'
import { codegenSDK } from './comfyui-sdk-codegen'
import { ParsedComfyUIObjectInfoNodeSchema } from './ParsedComfyUIObjectInfoNodeSchema'

export class ParsedObjectInfo {
   codegenDTS = codegenSDK.bind(this)

   // #region ctor
   constructor(
      // 💬 2024-11-03 rvion:
      // | since we now want to be able to run codegen without starting CushyStudio,
      // | only requiring spec and embedding let us pass either some `ComfySchemaT`
      // | or just a plain POJO with those 3 fields
      public data: {
         id: string
         spec: ComfySchemaJSON
         embeddings: string[]
      },
   ) {
      this.onUpdate()
   }

   // #region props
   knownSlotTypes = new Set<string>()
   knownEnumsByName = new Map<EnumName, EnumInfo>()
   knownEnumsByHash = new Map<EnumHash, EnumInfo>()
   nodes: ParsedComfyUIObjectInfoNodeSchema[] = []
   nodesByNameInComfy: { [key: string]: ParsedComfyUIObjectInfoNodeSchema } = {}
   nodesByNameInCushy: { [key: string]: ParsedComfyUIObjectInfoNodeSchema } = {}
   nodesByProduction: { [key: string]: NodeNameInCushy[] } = {}
   enumsAppearingInOutput = new Set<string>()

   // get host(): HostL { return this.hostRef.item } // prettier-ignore
   // get hostName(): string { return this.hostRef.item.data.name } // prettier-ignore

   /** on update is called automatically by live instances */
   onUpdate(): void {
      this.log(`updating schema #${this.data.id}`)
      // reset spec
      // this.spec = this.data.spec
      // this.embeddings = this.data.embeddings

      // this.knownSlotTypes.clear()
      // this.knownEnumsByHash.clear()
      // this.knownEnumsByName.clear()
      // this.nodes.splice(0, this.nodes.length)
      // this.nodesByNameInComfy = {}
      // this.nodesByNameInCushy = {}
      // this.nodesByProduction = {}
      // this.enumsAppearingInOutput.clear()

      // compile spec
      const entries: [string, ComfyNodeSchemaJSON][] = Object.entries(this.data.spec)

      entries.push([ComfyDefaultNodeWhenUnknown_Name, ComfyDefaultNodeWhenUnknown_Schema])
      for (const __x of entries) {
         const nodeNameInComfy = __x[0]
         const nodeDef = __x[1]
         // console.chanel?.append(`[${nodeNameInComfy}]`)
         // apply prefix
         const nodeNameInCushy = convertComfyNodeNameToCushyNodeNameValidInJS(nodeNameInComfy)
         // console.log('>>', nodeTypeDef.category, nodeNameInCushy)

         if (typeof nodeDef.output === 'string') {
            console.log(`[❌ ERROR] nodeDef ${nodeDef.name} has an invalid output definition: ${JSON.stringify(nodeDef.output)}`) // prettier-ignore
            nodeDef.output = []
         }

         const inputs: NodeInputExt[] = []
         const outputs: NodeOutputExt[] = []
         const node = new ParsedComfyUIObjectInfoNodeSchema(
            //
            nodeNameInComfy,
            nodeNameInCushy,
            // nodeTypeName,
            nodeDef.category,
            inputs,
            outputs,
         )

         // INDEX NODE
         this.nodesByNameInComfy[nodeNameInComfy] = node
         this.nodesByNameInCushy[nodeNameInCushy] = node
         this.nodes.push(node)

         // OUTPUTS ----------------------------------------------------------------------
         const outputNamer: { [key: string]: number } = {}
         // console.info(JSON.stringify(nodeDef.output))
         // [⏸️ debug] if (typeof nodeDef.output.entries !== 'function') {
         // [⏸️ debug]     console.log(`[🧐] `, nodeDef)
         // [⏸️ debug]     console.log(`[🧐] `, nodeDef.output)
         // [⏸️ debug]     console.log(`[🧐] `, nodeDef.output.entries)
         // [⏸️ debug]     debugger
         // [⏸️ debug] }
         for (const [ix, slotType] of nodeDef.output.entries()) {
            const rawOutputSlotName =
               nodeDef.output_name[ix] || //
               (typeof slotType === 'string' ? slotType : `input_${ix}`)

            const outputNameInComfy = convetComfySlotNameToCushySlotNameValidInJS(rawOutputSlotName)
            const at = (outputNamer[outputNameInComfy] ??= 0)
            const outputNameInCushy = at === 0 ? outputNameInComfy : `${outputNameInComfy}_${at}`
            outputNamer[outputNameInComfy]++
            // console.log('>>', outputNameInComfy, outputNameInCushy)

            let slotTypeName: string
            if (typeof slotType === 'string') {
               slotTypeName = convetComfySlotNameToCushySlotNameValidInJS(slotType)
               this.knownSlotTypes.add(slotTypeName)
            } else if (Array.isArray(slotType)) {
               const uniqueEnumName = `Enum_${nodeNameInCushy}_${outputNameInCushy}_out`
               slotTypeName = this.processEnumNameOrValue({
                  candidateName: uniqueEnumName,
                  comfyEnumDef: slotType,
               })
               this.enumsAppearingInOutput.add(slotTypeName)
            } else {
               throw new Error(`invalid output ${ix} "${slotType}" in node "${nodeNameInComfy}"`)
            }
            // const optNormalized = normalizeJSIdentifier(slotType)
            // this.knownTypes.add(optNormalized)

            // index production
            const arr = this.nodesByProduction[slotTypeName]
            if (arr == null) this.nodesByProduction[slotTypeName] = [nodeNameInCushy]
            else arr.push(nodeNameInCushy)

            // const at = (outputNamer[slotType] ??= 0)
            // const nameInComfy = at === 0 ? slotType : `${slotType}_${at}`
            // const nameInCushy = normalizeJSIdentifier(nameInComfy)
            outputs.push({
               typeName: slotTypeName,
               nameInComfy: outputNameInComfy,
               nameInCushy: outputNameInCushy,
               isPrimitive: false,
            })
            // outputNamer[slotType]++
         }

         // INPUTS ----------------------------------------------------------------------
         const optionalInputs = Object.entries(nodeDef.input?.optional ?? {}) //
            .map(([name, spec]) => ({ required: false, name, spec }))
         const requiredInputs = Object.entries(nodeDef.input?.required ?? {}) //
            .map(([name, spec]) => ({ required: true, name, spec }))
            // REMOVE DUPLICATES
            // ! "CR ControlNet Input Switch": {
            // !    "input": {
            // !        "required": {
            // !            "Input": ["INT",{"default":1,"min":1,"max":2}]
            // !             "control_net1": ["CONTROL_NET"] 👈
            // !        }
            // !         "optional": {
            // !            "control_net1": ["CONTROL_NET"] 👈
            // !        }
            // !    }
            // 👇 this makes only the optional propery to be kept
            .filter((i) => optionalInputs.find((oi) => oi.name === i.name) == null)
         const allInputs = [
            //
            ...requiredInputs,
            ...optionalInputs,
         ]
         for (const ipt of allInputs) {
            const inputNameInComfy = ipt.name
            const inputNameInCushy = normalizeJSIdentifier(ipt.name, '_')
            const typeDef = ipt.spec
            const slotType = typeDef[0]
            const slotOpts = typeDef[1]

            /** name of the type in cushy */
            let inputTypeNameInCushy: string | undefined

            if (slotType == null) {
               const uniqueEnumName = `INVALID_null`
               inputTypeNameInCushy = this.processEnumNameOrValue({
                  candidateName: uniqueEnumName,
                  comfyEnumDef: ['❌'],
               })
            } else if (typeof slotType === 'string') {
               inputTypeNameInCushy = convetComfySlotNameToCushySlotNameValidInJS(slotType)
               this.knownSlotTypes.add(inputTypeNameInCushy)
            } else if (Array.isArray(slotType)) {
               const uniqueEnumName = `Enum_${nodeNameInCushy}_${inputNameInCushy}`
               inputTypeNameInCushy = this.processEnumNameOrValue({
                  candidateName: uniqueEnumName,
                  comfyEnumDef: slotType,
               })
            } else {
               throw new Error(
                  `invalid schema (${JSON.stringify(slotType)}) for input "${
                     ipt.name
                  }" in node "${nodeNameInComfy}" (type: ${typeof slotType}; expected: Array | string)`,
               )
            }

            if (inputTypeNameInCushy) {
               node.inputs.push({
                  required: ipt.required,
                  nameInComfy: inputNameInComfy,
                  nameInComfyEscaped: escapeJSKey(inputNameInComfy),
                  type: inputTypeNameInCushy,
                  opts: slotOpts,
                  isPrimitive: ComfyPrimitives.includes(inputTypeNameInCushy),
                  isEnum: this.knownEnumsByName.has(inputTypeNameInCushy),
                  index: node.inputs.length, // 🔴
               })
            } else {
               console.error(`❌ invalid input schema in node: "${nodeNameInComfy}", input: "${ipt.name}"`, {
                  ipt: toJS(ipt),
                  typeDef: toJS(typeDef),
                  slotType: toJS(slotType),
               })
               // throw new Error(`object type not supported`)
            }
         }
      }

      // this.updateComponents()
   }

   processEnumNameOrValue = (p: {
      //
      candidateName: string
      comfyEnumDef: ComfyEnumDef
   }): string => {
      // 1. build enum
      const enumValues: EnumValue[] = []
      for (const enumValue of p.comfyEnumDef) {
         if (typeof enumValue === 'string') enumValues.push(enumValue)
         else if (typeof enumValue === 'boolean') enumValues.push(enumValue)
         else if (typeof enumValue === 'number') enumValues.push(enumValue)
         else enumValues.push(enumValue.content)
      }
      // 2. hash its value
      const hash =
         enumValues.length === 0 //
            ? `[[empty:${p.candidateName}]]`
            : enumValues.sort().join('|')

      // 3. retrieve or create an EnumInfo
      let enumInfo: Maybe<EnumInfo> = this.knownEnumsByHash.get(hash)
      if (enumInfo == null) {
         // 💬 2024-09-30 rvion:
         // | 🔴 making that observable seems wrong; huge perf problem at instanciation.
         // case 3.A. PRE-EXISTING
         enumInfo = observable({ enumNameInCushy: p.candidateName, values: enumValues, aliases: [] })
         this.knownEnumsByHash.set(hash, enumInfo)
      } else {
         // case 3.B. PRE-EXISTING
         enumInfo.aliases.push(p.candidateName)
      }

      // ❌ if (p.candidateName === 'Enum_DualCLIPLoader_clip_name1') debugger

      // 4.sore enum by name
      this.knownEnumsByName.set(p.candidateName, enumInfo)
      return enumInfo.enumNameInCushy
   }

   // updateComponents() {
   //     this.components = []
   //     this.knownEnums.forEach((enumDef) => {
   //         this.components.push({
   //             name: enumDef.enumNameInCushy,
   //             type: 'enum',
   //             // values: enumDef.values,
   //             children: enumDef.values.map((v) => ({ name: v, type: 'enum-value' })),
   //         })
   //     })
   // }
   get requirables(): {
      name: string
      kind: 'enum' | 'node' | 'prim'
   }[] {
      const out: { name: string; kind: 'enum' | 'node' | 'prim' }[] = []
      // for (const n of this.knownSlotTypes) out.push({ name: n, kind: 'prim' })
      for (const n of this.knownEnumsByName) out.push({ name: n[0], kind: 'enum' })
      // for (const n of this.nodes) out.push({ name: n.nameInCushy, kind: 'node' })
      return out
   }

   // #region utils
   private log(...args: any[]): void {
      console.log(`[👅]:`, ...args)
   }

   toTSType(t: string): string {
      return ComfyPrimitiveMapping[t]
         ? `${ComfyPrimitiveMapping[t]} | ComfyNodeOutput<'${t}'>`
         : `ComfyNodeOutput<'${t}'>`
   }

   toSignalType(t: string): string {
      return `ComfyNodeOutput<'${t}'>`
   }
}
