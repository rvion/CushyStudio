import type { ComfyInputOpts } from './ComfyUIObjectInfoTypes'

export type EnumHash = string
export type EnumName = string
export type EnumValue = string | boolean | number

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
   hash: EnumHash
   // enumNameInComfy: string
   pythonModule: string
   enumNameInCushy: EnumName
   values: EnumValue[]
   aliases: { pythonModule: string; enumNameAlias: EnumName }[]
}
