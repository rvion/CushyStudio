import type {
   ComfyNodeSlotName,
   ComfyPythonModule,
   ComfyUnionInfo,
   EmbeddingName,
   NodeNameInComfy,
   NodeNameInCushy,
} from '../comfyui/comfyui-types'
import type { ComfyUIObjectInfoParsedNodeSchema } from '../comfyui/objectInfo/ComfyUIObjectInfoParsedNodeSchema'
import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { HostL } from './Host'

import { observable } from 'mobx'

import { ComfyUIObjectInfoParsed } from '../comfyui/objectInfo/ComfyUIObjectInfoParsed'
import { BaseInst } from '../db/BaseInst'
import { LiveRef } from '../db/LiveRef'
import { LiveTable } from '../db/LiveTable'

export class ComfySchemaRepo extends LiveTable<TABLES['comfy_schema'], typeof ComfySchemaL> {
   constructor(liveDB: LiveDB) {
      super(liveDB, 'comfy_schema', '📑', ComfySchemaL)
   }
}

export class ComfySchemaL extends BaseInst<TABLES['comfy_schema']> {
   dataObservabilityConfig = { spec: observable.ref }

   /**
    * return the number of nodes in your current schema
    * quick way to check your instance info
    * */
   get size(): number {
      // console.log(`[🧐] `, toJS(this.data.spec), Object.keys(this.data.spec).length)
      return Object.keys(this.data.spec).length
   }

   hostRef = new LiveRef<this, HostL>(this, 'hostID', 'host')

   parseObjectInfo: ComfyUIObjectInfoParsed = new ComfyUIObjectInfoParsed({
      id: 'empty',
      spec: {},
      embeddings: [],
   })

   // forward to underlying parsedObjectInfo
   get pythonModuleByNodeNameInCushy(): Map<NodeNameInCushy, ComfyPythonModule> { return this.parseObjectInfo.pythonModuleByNodeNameInCushy } // prettier-ignore
   get pythonModuleByNodeNameInComfy(): Map<NodeNameInComfy, ComfyPythonModule> { return this.parseObjectInfo.pythonModuleByNodeNameInComfy } // prettier-ignore
   get knownUnionBySlotName(): Map<ComfyNodeSlotName, ComfyUnionInfo> { return this.parseObjectInfo.knownUnionBySlotName } // prettier-ignore
   get nodes(): ComfyUIObjectInfoParsedNodeSchema[] { return this.parseObjectInfo.nodes } // prettier-ignore
   get nodesByNameInCushy(): Record<string, ComfyUIObjectInfoParsedNodeSchema> { return this.parseObjectInfo.nodesByNameInCushy } // prettier-ignore
   get nodesByNameInComfy(): Record<string, ComfyUIObjectInfoParsedNodeSchema> { return this.parseObjectInfo.nodesByNameInComfy } // prettier-ignore

   isInvalid: boolean = false
   onUpdate = (): void => {
      try {
         this.parseObjectInfo = new ComfyUIObjectInfoParsed(this.data)
      } catch (error) {
         this.isInvalid = true
         console.error(`❌ [ComfySchemaL.onUpdate] `, error)
      }
   }

   /**
    * for now, simply ensure that the number of parsed nodes matches the number of nodes
    * present in the object_info.json
    */
   RUN_BASIC_CHECKS = (): void => {
      const numNodesInSource = Object.keys(this.data.spec).length
      const numNodesInSchema = this.nodes.length
      if (numNodesInSource !== numNodesInSchema) {
         console.log(`🔴 ${numNodesInSource} != ${numNodesInSchema}`)
      }
   }
   // hasWildcard = (embedding: string): embedding is EmbeddingName => this.data.embeddings.includes(embedding as EmbeddingName)
   hasEmbedding = (embedding: string): embedding is EmbeddingName =>
      this.data.embeddings.includes(embedding as EmbeddingName)

   // LORA --------------------------------------------------------------
   /** check if the given lora name is present in the Enum_LoraLoader_lora_name enum */
   hasLora = (loraName: string): boolean => this.getLoras().includes(loraName as Comfy.Slots['LoraLoader.lora_name']) // prettier-ignore

   /** return the list of all loras available */
   getLoras = (): Comfy.Slots['LoraLoader.lora_name'][] => {
      const candidates = this.knownUnionBySlotName.get('LoraLoader.lora_name')?.values ?? []
      return candidates as Comfy.Slots['LoraLoader.lora_name'][]
   }

   // IMAGES --------------------------------------------------------------
   hasImage = (imgName: string): boolean =>
      this.getImages().includes(imgName as Comfy.Slots['LoadImage.image'])

   getImages = (): Comfy.Slots['LoadImage.image'][] => {
      const candidates = this.knownUnionBySlotName.get('LoadImage.image')?.values ?? []
      return candidates as Comfy.Slots['LoadImage.image'][]
   }

   /** only use this function after an upload success, when you say this asset is now part of ComfyUI */
   unsafely_addImageInSchemaWithoutReloading = (imgName: string): void => {
      const enumInfo = this.knownUnionBySlotName.get('LoadImage.image')
      if (enumInfo == null) throw new Error(`LoadImage.image not found`)
      enumInfo.values.push(imgName as Comfy.Slots['LoadImage.image'])
   }

   // CHECKPOINT --------------------------------------------------------------
   hasCheckpoint = (ckptName: string): boolean => this.getCheckpoints().includes(ckptName as Comfy.Slots['CheckpointLoaderSimple.ckpt_name']) // prettier-ignore
   getCheckpoints = (): Comfy.Slots['CheckpointLoaderSimple.ckpt_name'][] => {
      const candidates = this.knownUnionBySlotName.get('CheckpointLoaderSimple.ckpt_name')?.values ?? []
      return candidates as Comfy.Slots['CheckpointLoaderSimple.ckpt_name'][]
   }

   onHydrate = (): void => {
      // this.onUpdate()
   }
}
