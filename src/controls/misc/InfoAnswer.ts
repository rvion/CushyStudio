/**
 * This module implements is the early-days core of
 * the cushy form-framework
 * 🔶 design is a bit unusual because of the very specific needs of the project
 * TODO: write them down to explain choices
 */

import type { ImageID } from 'src/models/Image'

// prettier-ignore

// 🐉 export type InfoRequestFn = <const Req extends { [key: string]: Widget }>(
// 🐉     req: (q: FormBuilder) => Req,
// 🐉 ) => Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }>

// IMAGE
// export type ImageAnswer2 = { type: 'imageSignal'; nodeID: ComfyNodeID; fieldName: string } /** node must be in current graph */
// export type ImageAnswer3 = { type: 'imagePath'; absPath: AbsolutePath }
// export type ImageAnswer4 = { type: 'imageURL'; url: string }
// export type ImageAnswer = ImageAnswer1 | ImageAnswer2 | ImageAnswer3 | ImageAnswer4

// IMAGE ----------------------------------------------------------------------------
export type ImageAnswer = CushyImageAnswer | ComfyImageAnswer | PaintImageAnswer // | ImageAnswer2 | ImageAnswer3 | ImageAnswer4
export type CushyImageAnswer = { type: 'CushyImage'; imageID: ImageID }
export type ComfyImageAnswer = { type: 'ComfyImage'; imageName: Enum_LoadImage_image }
export type PaintImageAnswer = { type: 'PaintImage'; base64: string }
export type ImageAnswerForm<Type extends string, Bool extends boolean> = {
    type: Type
    active: Bool
    pick: 'cushy' | 'comfy' | 'paint' | 'asset'
    cushy: Maybe<CushyImageAnswer>
    comfy: ComfyImageAnswer // always example.png by default
    paint: Maybe<PaintImageAnswer> // base64
}

// SIZES ----------------------------------------------------------------------------
export type SDModelType = 'SD1.5 512' | 'SD2.1 768' | 'SDXL 1024' | 'custom'
export type AspectRatio =
    | '16:9'
    | '1:1'
    | '1:2'
    | '1:4'
    | '21:9'
    | '2:1'
    | '2:3'
    | '3:2'
    | '3:4'
    | '4:1'
    | '4:3'
    | '9:16'
    | '9:21'
    | 'custom'

export type CushySizeByRatio = {
    modelType: SDModelType
    aspectRatio: AspectRatio
}

export type CushySize = {
    type: 'size'
    width: number
    height: number
    modelType: SDModelType
    aspectRatio: AspectRatio
}
