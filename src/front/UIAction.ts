import type { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { ImageID } from '../models/Image'

export type UIAction = UIActionPaint | UIActionForm | UIActionComfy | UIActionComfig

export type UIActionForm = { type: 'form' }
export type UIActionPaint = { type: 'paint'; imageID?: ImageID }
export type UIActionComfy = { type: 'comfy'; json?: LiteGraphJSON }
export type UIActionComfig = { type: 'config' }

// export type UIActionAny = { type: 'any'; form: any }
