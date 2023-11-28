import type { ImageInfos } from 'src/models/Image'
import type { EmbeddingName } from 'src/models/Schema'
import type { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { ComfySchemaJSON } from 'src/types/ComfySchemaJSON'
import type { WsMsgExecutionError } from 'src/types/ComfyWsApi'

export type Graph_comfyPromptJSON = ComfyPromptJSON
export type Draft_appParams = Maybe<any>
export type Step_formResult = Maybe<any>
export type Step_formSerial = Maybe<any>
export type ComfyPrompt_error = Maybe<WsMsgExecutionError>
export type ComfySchema_spec = ComfySchemaJSON
export type ComfySchema_embeddings = EmbeddingName[]
export type MediaImage_infos = ImageInfos
