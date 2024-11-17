import type { ComfyInputOpts } from './objectInfo/ComfyUIObjectInfoTypes'

export type ComfyUnionHash = string //  '26c34bf761d4be4554ab944105c5a3c017c99453
export type ComfyUnionName = string // 'E_26c34bf761d4be4554ab944105c5a3c017c99453'
export type ComfyUnionValue = string | boolean | number

export type ComfyPythonModule = string
export type NodeNameInComfy = string
export type NodeNameInCushy = string

/**
 * the textual name of the a slot type
 * (slot = input or output of a node)
 *
 * = keyof Comfy.Signal
 */
export type ComfyNodeSlotTypeName = keyof Comfy.Signal
export const asComfyNodeSlotTypeName = (x: string): ComfyNodeSlotTypeName => x as ComfyNodeSlotTypeName

export type ComfyNodeSlotName = keyof Comfy.Slots //  'Impact_Pack.CfgScheduleHookProvider<-schedule_for_iteration'
export const asComfyNodeSlotName = (x: string): ComfyNodeSlotName => x as ComfyNodeSlotName

// export type QualifiedNodeNameInCushy = {}

export type EmbeddingName = Branded<string, { Embedding: true }>

export type NodeInputExt = {
   slotName: ComfyNodeSlotName
   nameInComfy: string
   nameInComfyEscaped: string
   typeName: ComfyNodeSlotTypeName
   opts?: ComfyInputOpts
   isPrimitive: boolean
   isEnum: boolean
   required: boolean
   index: number
}

export type NodeOutputExt = {
   slotName: ComfyNodeSlotName
   typeName: ComfyNodeSlotTypeName
   nameInCushy: string
   nameInComfy: string
   isPrimitive: boolean
}

export type ComfyUnionInfo = {
   hash: ComfyUnionHash
   unionNameInCushy: ComfyUnionName
   values: ComfyUnionValue[]
   enumNames: ComfyNodeSlotName[]
}
