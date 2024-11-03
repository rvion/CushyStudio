import type { ComfyInputOpts } from '../types/ComfySchemaJSON'

export type EnumHash = string
export type EnumName = string
export type EnumValue = string | boolean | number

export type NodeNameInComfy = string
export type NodeNameInCushy = string

export type EmbeddingName = Branded<string, { Embedding: true }>

export type NodeInputExt = {
   nameInComfy: string
   nameInComfyEscaped: string
   type: string
   opts?: ComfyInputOpts
   isPrimitive: boolean
   isEnum: boolean
   // isEnum: boolean
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
   // enumNameInComfy: string
   enumNameInCushy: EnumName
   values: EnumValue[]
   aliases: string[]
}
