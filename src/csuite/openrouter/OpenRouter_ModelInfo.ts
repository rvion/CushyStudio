import type { IsEqual } from '../../types/Misc'
import type { OpenRouter_Models } from './OpenRouter_models'

import * as v from 'valibot'

type stringifiedNumber = string

// #region InstructType
export type InstructType =
   | 'llama2'
   | 'zephyr'
   | 'openchat'
   | 'alpaca'
   | 'vicuna'
   | 'neural'
   | 'gpt'
   | 'airoboros'
   | 'claude'
   | 'chatml'
   | 'mistral'
   | 'llama3'
   | 'phi3'
   | 'zephyr'
   | 'none'
   | 'gemma'

export const InstructType_valibot = v.union([
   v.literal('llama2'),
   v.literal('zephyr'),
   v.literal('openchat'),
   v.literal('alpaca'),
   v.literal('vicuna'),
   v.literal('neural'),
   v.literal('gpt'),
   v.literal('airoboros'),
   v.literal('claude'),
   v.literal('chatml'),
   v.literal('mistral'),
   v.literal('llama3'),
   v.literal('phi3'),
   v.literal('zephyr'),
   v.literal('none'),
   v.literal('gemma'),
])

// #region OpenRouter_ModelInfo
export type OpenRouter_ModelInfo = {
   id: string
   name: string
   created: number
   description: string
   pricing: {
      prompt: stringifiedNumber // "0"
      completion: stringifiedNumber // "0"
      image: stringifiedNumber // "0"
      request: stringifiedNumber // "0"
   }
   context_length: number
   architecture: {
      modality: string
      tokenizer: string
      instruct_type: InstructType | null
   }
   top_provider: {
      context_length: number | null
      max_completion_tokens: number | null
      is_moderated: boolean
   }
   per_request_limits?: Maybe<{ prompt_tokens: string; completion_tokens: string }>
}

export const OpenRouter_ModelInfo_valibot = v.strictObject({
   id: v.string(),
   name: v.string(),
   created: v.number(),
   description: v.string(),
   pricing: v.strictObject({
      prompt: v.string(),
      completion: v.string(),
      image: v.string(),
      request: v.string(),
   }),
   context_length: v.number(),
   architecture: v.strictObject({
      modality: v.string(),
      tokenizer: v.string(),
      instruct_type: v.nullable(InstructType_valibot),
   }),
   top_provider: v.strictObject({
      context_length: v.nullable(v.number()),
      max_completion_tokens: v.nullable(v.number()),
      is_moderated: v.boolean(),
   }),
   per_request_limits: v.optional(
      v.nullable(
         v.strictObject({
            prompt_tokens: v.string(),
            completion_tokens: v.string(),
         }),
      ),
   ),
})

const _: IsEqual<OpenRouter_ModelInfo, v.InferInput<typeof OpenRouter_ModelInfo_valibot>> = true

// #region payload response

export type OpenRouter_GetModelInfos_Response = {
   data: OpenRouter_ModelInfo[]
}

export const OpenRouter_GetModelInfos_Response_valibot = v.strictObject({
   data: v.array(OpenRouter_ModelInfo_valibot),
})
