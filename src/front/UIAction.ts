import type { LiteGraphJSON } from 'src/core/LiteGraph'
import type { ImageID } from '../models/Image'

export type UIPage = UIPagePaint | UIPageForm | UIPageComfy | UIPageComfig | UIPageIFrame

export type UIPageForm = { type: 'form' }
export type UIPagePaint = { type: 'paint'; imageID?: ImageID }
export type UIPageComfy = { type: 'comfy'; json?: LiteGraphJSON }
export type UIPageComfig = { type: 'config' }
export type UIPageIFrame = { type: 'iframe'; url: string }
