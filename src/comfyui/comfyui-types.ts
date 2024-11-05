import type { ComfyInputOpts } from './ComfyUIObjectInfoTypes'

export type ComfyUnionHash = string //  '26c34bf761d4be4554ab944105c5a3c017c99453
export type ComfyUnionName = string // 'E_26c34bf761d4be4554ab944105c5a3c017c99453'
export type ComfyEnumName = string //  'Comfy.Custom.Impact_Pack.CfgScheduleHookProvider.input.schedule_for_iteration'
export type ComfyUnionValue = string | boolean | number

export type NodeNameInComfy = string
export type NodeNameInCushy = string

// export type QualifiedNodeNameInCushy = {}

export type EmbeddingName = Branded<string, { Embedding: true }>

export type NodeInputExt = {
   nameInComfy: string
   nameInComfyEscaped: string
   type: string
   opts?: ComfyInputOpts
   isPrimitive: boolean
   isEnum: boolean
   required: boolean
   index: number
}

export type NodeOutputExt = {
   typeName: string
   nameInCushy: string
   nameInComfy: string
   isPrimitive: boolean
}

export type EnumInfo = {
   hash: ComfyUnionHash
   // enumNameInComfy: string
   pythonModule: string
   enumNameInCushy: ComfyUnionName
   values: ComfyUnionValue[]
   qualifiedNames: ComfyEnumName[]
}
