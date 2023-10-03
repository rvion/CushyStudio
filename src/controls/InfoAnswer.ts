/**
 * This module implements is the early-days core of
 * the cushy form-framework
 * 🔶 design is a bit unusual because of the very specific needs of the project
 * TODO: write them down to explain choices
 */

import type { ImageID } from 'src/models/Image'
import type { FormBuilder } from './FormBuilder'
import type { Requestable } from './InfoRequest'

// prettier-ignore
export type InfoAnswer<Req extends Requestable> = Req['default']

export type InfoRequestFn = <const Req extends { [key: string]: Requestable }>(
    req: (q: FormBuilder) => Req,
) => Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }>

// SAM
export type SamPointPosStr = Tagged<string, 'SamPointPosStr'>
export type SamPointLabelsStr = Tagged<string, 'SamPointLabelsStr'>

// IMAGE
export type ImageAnswer1 = { type: 'imageID'; imageID: ImageID }
// export type ImageAnswer2 = { type: 'imageSignal'; nodeID: ComfyNodeID; fieldName: string } /** node must be in current graph */
// export type ImageAnswer3 = { type: 'imagePath'; absPath: AbsolutePath }
// export type ImageAnswer4 = { type: 'imageURL'; url: string }
// export type ImageAnswer = ImageAnswer1 | ImageAnswer2 | ImageAnswer3 | ImageAnswer4
export type ImageAnswer = ImageAnswer1 // ImageAnswer1 | ImageAnswer2 | ImageAnswer3 | ImageAnswer4

export type CushySizeByRatio = {
    kind: 'SD1.5 512' | 'SD2.1 768' | 'SDXL 1024' | 'custom'
    ratio: '16:9' | '1:1' | '1:2' | '1:4' | '21:9' | '2:1' | '2:3' | '3:2' | '3:4' | '4:1' | '4:3' | '9:16' | '9:21'
}

export type CushySize = {
    width: number
    height: number
}
