import { Type } from '@sinclair/typebox'

import type { ImageInfos } from 'src/models/Image'
import type { EmbeddingName } from 'src/models/Schema'
import type { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { ComfySchemaJSON } from 'src/types/ComfySchemaJSON'
import type { WsMsgExecutionError } from 'src/types/ComfyWsApi'

export type Graph_comfyPromptJSON = ComfyPromptJSON
export const Graph_comfyPromptJSON_Schema = Type.Any()

export type Draft_appParams = Maybe<any>
export const Draft_appParams_Schema = Type.Any()

export type Step_formResult = Maybe<any>
export const Step_formResult_Schema = Type.Any()

export type Step_formSerial = Maybe<any>
export const Step_formSerial_Schema = Type.Any()

export type ComfyPrompt_error = Maybe<WsMsgExecutionError>
export const ComfyPrompt_error_Schema = Type.Any()

export type ComfySchema_spec = ComfySchemaJSON
export const ComfySchema_spec_Schema = Type.Any()

export type ComfySchema_embeddings = EmbeddingName[]
export const ComfySchema_embeddings_Schema = Type.Any()

export type MediaImage_infos = ImageInfos
export const MediaImage_infos_Schema = Type.Any()
