import type {
   ComfyEnumName,
   ComfyUnionHash,
   ComfyUnionInfo,
   ComfyUnionName,
   ComfyUnionValue,
   NodeInputExt,
   NodeNameInComfy,
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
import { getUnionNameBasedOnFirstFoundEnumName } from './getUnionNameBasedOnFirstFoundEnumName'
import { pythonModuleToNamespace, pythonModuleToShortestUnambiguousPrefix } from './pythonModuleToNamespace'

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
   knownUnionByEnumName = new Map<ComfyEnumName, ComfyUnionInfo>()
   knownUnionByHash = new Map<ComfyUnionHash, ComfyUnionInfo>()
   knownUnionByName = new Map<ComfyUnionName, ComfyUnionInfo>()
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
         // const ownEnums: { in: 'input' | 'output'; ownName: string; enum: ComfyUnionInfo }[] = []
         const node = new ComfyUIObjectInfoParsedNodeSchema(
            VV,
            // ownEnums,
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

            // 1. Primitive
            if (typeof slotType === 'string') {
               slotTypeName = convetComfySlotNameToCushySlotNameValidInJS(slotType)
               this.knownSlotTypes.add(slotTypeName)
            }
            // 2. ENUM
            else if (Array.isArray(slotType)) {
               const uniqueEnumName = `${pythonModuleToShortestUnambiguousPrefix(pythonModule)}${nodeNameInCushy}.${outputNameInCushy}.OUT`
               const RESX = this.processEnumNameOrValue({
                  pythonModule,
                  enumName: uniqueEnumName,
                  comfyEnumDef: slotType,
               })
               slotTypeName = RESX.unionNameInCushy
               // ownEnums.push({ in: 'output', ownName: uniqueEnumName, enum: RESX })
               this.enumsAppearingInOutput.add(slotTypeName)
            }
            // 3. ????
            else {
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
                  enumName: uniqueEnumName,
                  comfyEnumDef: ['❌'],
               })
               inputTypeNameInCushy = RESX.unionNameInCushy
               // ownEnums.push({ in: 'input', ownName: RESX.ownName, enum: RESX.enum })
            } else if (typeof slotType === 'string') {
               inputTypeNameInCushy = convetComfySlotNameToCushySlotNameValidInJS(slotType)
               this.knownSlotTypes.add(inputTypeNameInCushy)
            } else if (Array.isArray(slotType)) {
               const uniqueEnumName = `${pythonModuleToShortestUnambiguousPrefix(pythonModule)}${nodeNameInCushy}.${inputNameInCushy}`
               const RESX = this.processEnumNameOrValue({
                  pythonModule,
                  enumName: uniqueEnumName,
                  comfyEnumDef: slotType,
               })
               inputTypeNameInCushy = RESX.unionNameInCushy
               // ownEnums.push({ in: 'input', ownName: RESX.ownName, enum: RESX.enum })
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
                  isEnum: this.knownUnionByName.has(inputTypeNameInCushy),
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
      enumName: string
      comfyEnumDef: ComfyEnumDef
   }): ComfyUnionInfo => {
      // 1. build enum
      const enumValues: ComfyUnionValue[] = []
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
      let unionInfo: Maybe<ComfyUnionInfo> = this.knownUnionByHash.get(hash)
      if (unionInfo == null) {
         const unionNameInCushy = getUnionNameBasedOnFirstFoundEnumName(p.enumName, hash, hashContent)
         // 💬 2024-09-30 rvion:
         // | 🔴 making that observable seems wrong; huge perf problem at instanciation.
         // case 3.A. PRE-EXISTING
         unionInfo = observable({
            hash,
            unionNameInCushy: unionNameInCushy,
            values: enumValues,
            enumNames: [],
         })
         this.knownUnionByHash.set(hash, unionInfo)
         this.knownUnionByName.set(unionNameInCushy, unionInfo)
      }
      // else {
      // case 3.B. PRE-EXISTING
      unionInfo.enumNames.push(p.enumName)
      // enumInfo.qualifiedNames.push({
      //    pythonModule: p.pythonModule,
      //    enumNameAlias: p.candidateName,
      // })
      // }

      // ❌ if (p.candidateName === 'Enum_DualCLIPLoader_clip_name1') debugger

      // 4.sore enum by name
      this.knownUnionByEnumName.set(p.enumName, unionInfo)
      return unionInfo
      // {
      //    typeName: unionInfo.unionNameInCushy,
      //    ownName: p.enumName,
      //    enum: unionInfo,
      // }
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
   // get requirables(): {
   //    name: string
   //    enum: ComfyUnionInfo
   //    kind: 'enum'
   // }[] {
   //    const out: { name: string; enum: ComfyUnionInfo; kind: 'enum' }[] = []
   //    // for (const n of this.knownSlotTypes) out.push({ name: n, kind: 'prim' })
   //    for (const n of this.knownUnionByEnumName)
   //       out.push({
   //          name: n[0],
   //          kind: 'enum',
   //          enum: n[1],
   //       })
   //    // for (const n of this.nodes) out.push({ name: n.nameInCushy, kind: 'node' })
   //    return out
   // }

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
