import type { ComfyEnumDef, ComfyNodeSchemaJSON, ComfySchemaJSON } from './ComfyUIObjectInfoTypes'

import crypto from 'crypto'
import { isObservable, observable, toJS } from 'mobx'

import { ComfyPrimitiveMapping, ComfyPrimitives } from '../../core/Primitives'
import {
   ComfyDefaultNodeWhenUnknown_Name,
   ComfyDefaultNodeWhenUnknown_Schema,
} from '../../models/ComfyDefaultNodeWhenUnknown'
import { escapeJSKey } from '../../utils/codegen/escapeJSKey'
import { convertComfyModuleAndNodeNameToCushyQualifiedNodeKey } from '../codegen/_convertComfyModuleAndNodeNameToCushyQualifiedNodeKey'
import { getUnionNameBasedOnFirstFoundEnumName } from '../codegen/_getUnionNameBasedOnFirstFoundEnumName'
import { codegenSDK } from '../codegen/comfyui-sdk-codegen'
import {
   asComfyNodeSlotName,
   asComfyNodeSlotTypeName,
   type ComfyNodeSlotName,
   type ComfyNodeSlotTypeName,
   type ComfyPythonModule,
   type ComfyUnionHash,
   type ComfyUnionInfo,
   type ComfyUnionName,
   type ComfyUnionValue,
   type NodeInputExt,
   type NodeNameInComfy,
   type NodeNameInCushy,
   type NodeOutputExt,
} from '../comfyui-types'
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
      // eslint-disable-next-line no-debugger
      if (isObservable(data.spec)) debugger
      this.onUpdate()
   }

   // #region props
   knownSlotTypes = new Set<ComfyNodeSlotTypeName>()
   knownUnionBySlotName = new Map<ComfyNodeSlotName, ComfyUnionInfo>()
   knownUnionByHash = new Map<ComfyUnionHash, ComfyUnionInfo>()
   knownUnionByName = new Map<ComfyUnionName, ComfyUnionInfo>()
   nodes: ComfyUIObjectInfoParsedNodeSchema[] = []
   pythonModuleByNodeNameInCushy: Map<NodeNameInCushy, ComfyPythonModule> = new Map()
   pythonModuleByNodeNameInComfy: Map<NodeNameInComfy, ComfyPythonModule> = new Map()
   nodesByNameInComfy: { [key: NodeNameInComfy]: ComfyUIObjectInfoParsedNodeSchema } = {}
   nodesByNameInCushy: { [key: NodeNameInCushy]: ComfyUIObjectInfoParsedNodeSchema } = {}
   nodesByProduction: { [key in ComfyNodeSlotTypeName]?: ComfyUIObjectInfoParsedNodeSchema[] } = {}

   // some nodes output anonymous unions. we need to keep track of them for codegen
   enumsAppearingInOutput = new Set<ComfyNodeSlotTypeName>()

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
         const nodeNameInCushy = convertComfyModuleAndNodeNameToCushyQualifiedNodeKey(
            pythonModule,
            nodeNameInComfy,
         )
         // console.log('>>', nodeTypeDef.category, nodeNameInCushy)

         if (typeof nodeDef.output === 'string') {
            console.log(`[❌ ERROR] nodeDef ${nodeDef.name} has an invalid output definition: ${JSON.stringify(nodeDef.output)}`) // prettier-ignore
            nodeDef.output = []
         }
         this.pythonModuleByNodeNameInCushy.set(nodeNameInCushy, pythonModule)
         this.pythonModuleByNodeNameInComfy.set(nodeNameInComfy, pythonModule)

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
         const nameCountDict: { [key: string]: number } = {}
         for (const [ix, slotType] of nodeDef.output.entries()) {
            const rawOutputSlotName =
               nodeDef.output_name[ix] || //
               (typeof slotType === 'string' ? slotType : `input_${ix}`)

            const outputNameInComfy = rawOutputSlotName
            const at = (nameCountDict[outputNameInComfy] ??= 0)
            const outputNameInCushy = at === 0 ? outputNameInComfy : `${outputNameInComfy}_${at}`
            nameCountDict[outputNameInComfy]++
            // console.log('>>', outputNameInComfy, outputNameInCushy)

            let slotTypeName: ComfyNodeSlotTypeName // keyof Comfy.Signal
            const outputSlotName = asComfyNodeSlotName(`${node.nameInCushy}.${outputNameInCushy}.OUT`)

            // 1. Primitive
            if (typeof slotType === 'string') {
               slotTypeName = asComfyNodeSlotTypeName(slotType)
               this.knownSlotTypes.add(slotTypeName)
            }
            // 2. ENUM
            else if (Array.isArray(slotType)) {
               const RESX = this.processSlot({
                  pythonModule,
                  slotName: outputSlotName,
                  comfyUnionDef: slotType,
               })
               slotTypeName = asComfyNodeSlotTypeName(RESX.unionNameInCushy)
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
               slotName: outputSlotName,
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
            // const inputNameInCushy = normalizeJSIdentifier(ipt.name, '_')
            const typeDef = ipt.spec
            const slotType = typeDef[0]
            const slotOpts = typeDef[1]

            /** name of the type in cushy */
            let inputTypeNameInCushy: ComfyNodeSlotTypeName
            const inputSlotName = asComfyNodeSlotName(`${node.nameInCushy}.${inputNameInComfy}`)

            // 1/4
            if (slotType == null) {
               // const inputSlotName = `${node.nameInCushy}.❌null❌`
               // const inputSlotName = asComfyNodeSlotName('INVALID_null') // TODO: rename everywhere
               const RESX = this.processSlot({
                  pythonModule,
                  slotName: inputSlotName,
                  comfyUnionDef: ['❌'],
               })
               inputTypeNameInCushy = asComfyNodeSlotTypeName(RESX.unionNameInCushy)
               // ownEnums.push({ in: 'input', ownName: RESX.ownName, enum: RESX.enum })
            }
            // 2/4
            else if (typeof slotType === 'string') {
               inputTypeNameInCushy = asComfyNodeSlotTypeName(slotType)
               this.knownSlotTypes.add(inputTypeNameInCushy)
            }
            // 3/4
            else if (Array.isArray(slotType)) {
               const RESX = this.processSlot({
                  pythonModule,
                  slotName: inputSlotName,
                  comfyUnionDef: slotType,
               })
               inputTypeNameInCushy = asComfyNodeSlotTypeName(RESX.unionNameInCushy)
               // ownEnums.push({ in: 'input', ownName: RESX.ownName, enum: RESX.enum })
            }
            // 4/4
            else {
               throw new Error(
                  `invalid schema (${JSON.stringify(slotType)}) for input "${
                     ipt.name
                  }" in node "${nodeNameInComfy}" (type: ${typeof slotType}; expected: Array | string)`,
               )
            }

            if (inputTypeNameInCushy) {
               node.inputs.push({
                  slotName: inputSlotName,
                  required: ipt.required,
                  nameInComfy: inputNameInComfy,
                  nameInComfyEscaped: escapeJSKey(inputNameInComfy),
                  typeName: inputTypeNameInCushy,
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

   // #region processSlot
   processSlot = (p: {
      //
      pythonModule: string
      slotName: ComfyNodeSlotName
      comfyUnionDef: ComfyEnumDef
   }): ComfyUnionInfo => {
      // 1. build enum
      const enumValues: ComfyUnionValue[] = []
      for (const enumValue of p.comfyUnionDef) {
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
      const hash = crypto.createHash('sha1').update(hashContent).digest('hex').slice(0, 8)

      // 3. retrieve or create an EnumInfo
      let unionInfo: Maybe<ComfyUnionInfo> = this.knownUnionByHash.get(hash)
      if (unionInfo == null) {
         const unionNameInCushy = getUnionNameBasedOnFirstFoundEnumName(p.slotName, hash, hashContent)
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
      unionInfo.enumNames.push(p.slotName)
      // enumInfo.qualifiedNames.push({
      //    pythonModule: p.pythonModule,
      //    enumNameAlias: p.candidateName,
      // })
      // }

      // ❌ if (p.candidateName === 'DualCLIPLoader.clip_name1') debugger

      // 4.sore enum by name
      this.knownUnionBySlotName.set(p.slotName, unionInfo)
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
