import type {
   EnumHash,
   EnumInfo,
   EnumName,
   EnumValue,
   NodeInputExt,
   NodeNameInComfy,
   NodeNameInCushy,
   NodeOutputExt,
} from './comfyui-types'
import type { ComfyEnumDef, ComfyNodeSchemaJSON, ComfySchemaJSON } from './ComfyUIObjectInfoTypes'

import crypto from 'crypto'
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
import { ComfyUIObjectInfoParsedNodeSchema } from './ComfyUIObjectInfoParsedNodeSchema'

export class ComfyUIObjectInfoParsed {
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
   nodes: ComfyUIObjectInfoParsedNodeSchema[] = []
   nodesByNameInComfy: { [key: string]: ComfyUIObjectInfoParsedNodeSchema } = {}
   nodesByNameInCushy: { [key: string]: ComfyUIObjectInfoParsedNodeSchema } = {}
   nodesByProduction: { [key: string]: ComfyUIObjectInfoParsedNodeSchema[] } = {}
   enumsAppearingInOutput = new Set<string>()
   pythonModules = new Map<string, NodeNameInComfy[]>()
   // get host(): HostL { return this.hostRef.item } // prettier-ignore
   // get hostName(): string { return this.hostRef.item.data.name } // prettier-ignore

   /** on update is called automatically by live instances */
   onUpdate(): void {
      this.log(`updating schema #${this.data.id}`)
      const entries: [string, ComfyNodeSchemaJSON][] = Object.entries(this.data.spec)
      entries.push([ComfyDefaultNodeWhenUnknown_Name, ComfyDefaultNodeWhenUnknown_Schema])

      for (const [KK, VV] of entries) {
         // record python module
         const pythonModule = VV.python_module
         const prev = this.pythonModules.get(pythonModule)
         if (prev == null) this.pythonModules.set(pythonModule, [KK])
         else prev.push(KK)

         const nodeNameInComfy = KK
         const nodeDef = VV
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
         const ownEnums: { in: 'input' | 'output'; ownName: string; enum: EnumInfo }[] = []
         const node = new ComfyUIObjectInfoParsedNodeSchema(
            VV,
            ownEnums,
            //
            nodeNameInComfy,
            nodeNameInCushy,
            // nodeTypeName,
            nodeDef.category,
            inputs,
            outputs,
            pythonModule,
         )

         // INDEX NODE
         this.nodesByNameInComfy[nodeNameInComfy] = node
         this.nodesByNameInCushy[nodeNameInCushy] = node
         this.nodes.push(node)

         // #region OUTPUTS ----------------------------------------------------------------------
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
               const uniqueEnumName = `${nodeNameInCushy}.output.${outputNameInCushy}`
               const RESX = this.processEnumNameOrValue({
                  pythonModule,
                  candidateName: uniqueEnumName,
                  comfyEnumDef: slotType,
               })
               slotTypeName = RESX.typeName
               ownEnums.push({ in: 'output', ownName: RESX.ownName, enum: RESX.enum })
               this.enumsAppearingInOutput.add(slotTypeName)
            } else {
               throw new Error(`invalid output ${ix} "${slotType}" in node "${nodeNameInComfy}"`)
            }
            // const optNormalized = normalizeJSIdentifier(slotType)
            // this.knownTypes.add(optNormalized)

            // index production
            const arr = this.nodesByProduction[slotTypeName]
            if (arr == null) this.nodesByProduction[slotTypeName] = [node]
            else arr.push(node)

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

         // #region INPUTS ----------------------------------------------------------------------
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
               const RESX = this.processEnumNameOrValue({
                  pythonModule,
                  candidateName: uniqueEnumName,
                  comfyEnumDef: ['❌'],
               })
               inputTypeNameInCushy = RESX.typeName
               ownEnums.push({ in: 'input', ownName: RESX.ownName, enum: RESX.enum })
            } else if (typeof slotType === 'string') {
               inputTypeNameInCushy = convetComfySlotNameToCushySlotNameValidInJS(slotType)
               this.knownSlotTypes.add(inputTypeNameInCushy)
            } else if (Array.isArray(slotType)) {
               const uniqueEnumName = `${nodeNameInCushy}.input.${inputNameInCushy}`
               const RESX = this.processEnumNameOrValue({
                  pythonModule,
                  candidateName: uniqueEnumName,
                  comfyEnumDef: slotType,
               })
               inputTypeNameInCushy = RESX.typeName
               ownEnums.push({ in: 'input', ownName: RESX.ownName, enum: RESX.enum })
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

   // #region processEnumNameOrValue
   processEnumNameOrValue = (p: {
      //
      pythonModule: string
      candidateName: string
      comfyEnumDef: ComfyEnumDef
   }): { typeName: string; ownName: string; enum: EnumInfo } => {
      // 1. build enum
      const enumValues: EnumValue[] = []
      for (const enumValue of p.comfyEnumDef) {
         if (typeof enumValue === 'string') enumValues.push(enumValue)
         else if (typeof enumValue === 'boolean') enumValues.push(enumValue)
         else if (typeof enumValue === 'number') enumValues.push(enumValue)
         else enumValues.push(enumValue.content)
      }
      // 2. hash its value
      const hashContent =
         enumValues.length === 0 //
            ? `[[empty]]` // `[[empty:${p.candidateName}]]`
            : enumValues.sort().join('|')
      const hash = crypto.createHash('sha1').update(hashContent).digest('hex')

      // 3. retrieve or create an EnumInfo
      let enumInfo: Maybe<EnumInfo> = this.knownEnumsByHash.get(hash)
      if (enumInfo == null) {
         // 💬 2024-09-30 rvion:
         // | 🔴 making that observable seems wrong; huge perf problem at instanciation.
         // case 3.A. PRE-EXISTING
         enumInfo = observable({
            hash,
            pythonModule: p.pythonModule,
            enumNameInCushy: 'E_' + hash, //p.candidateName,
            values: enumValues,
            aliases: [],
         })
         this.knownEnumsByHash.set(hash, enumInfo)
      }
      // else {
      // case 3.B. PRE-EXISTING
      enumInfo.aliases.push({
         pythonModule: p.pythonModule,
         enumNameAlias: p.candidateName,
      })
      // }

      // ❌ if (p.candidateName === 'Enum_DualCLIPLoader_clip_name1') debugger

      // 4.sore enum by name
      this.knownEnumsByName.set(p.candidateName, enumInfo)
      return {
         typeName: enumInfo.enumNameInCushy,
         ownName: p.candidateName,
         enum: enumInfo,
      }
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
      enum: EnumInfo
      kind: 'enum'
   }[] {
      const out: { name: string; enum: EnumInfo; kind: 'enum' }[] = []
      // for (const n of this.knownSlotTypes) out.push({ name: n, kind: 'prim' })
      for (const n of this.knownEnumsByName)
         out.push({
            name: n[0],
            kind: 'enum',
            enum: n[1],
         })
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
