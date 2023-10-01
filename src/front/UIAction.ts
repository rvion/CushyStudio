import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { ImageID } from '../models/Image'

export type UIAction = UIActionPaint | UIActionForm | UIActionComfy | UIActionComfig | UIActionIFrame

export type UIActionForm = { type: 'form' }
export type UIActionPaint = { type: 'paint'; imageID?: ImageID }
export type UIActionComfy = { type: 'comfy'; json?: LiteGraphJSON }
export type UIActionComfig = { type: 'config' }
export type UIActionIFrame = { type: 'iframe'; url: string }

// export type UIActionAny = { type: 'any'; form: any }
