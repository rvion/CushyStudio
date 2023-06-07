import type { ToolID } from 'src/models/Tool'
import type { ImageID } from '../models/Image'

export type UIAction = UIActionPaint | UIActionForm | UIActionAny | UIActionFlow

export type UIActionPaint = { type: 'paint'; imageID: ImageID }
export type UIActionForm = { type: 'form'; form: any }
export type UIActionAny = { type: 'any'; form: any }
export type UIActionFlow = { type: 'flow'; flowID: ToolID }
