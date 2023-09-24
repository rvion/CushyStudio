/**
 * This module implements is the early-days core of
 * the cushy form-framework
 * 🔶 design is a bit unusual because of the very specific needs of the project
 * TODO: write them down to explain choices
 */

import type { Base64Image } from 'src/core/b64img'
import type { ImageID } from 'src/models/Image'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { Maybe, Tagged } from 'src/utils/types'
import type { Requestable } from './InfoRequest'

import type { LATER } from 'LATER'
import type { ComfyNodeID } from 'src/types/NodeUID'
import type { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import type { FormBuilder } from './FormBuilder'
import type * as R from './InfoRequest'

// prettier-ignore
export type InfoAnswer<Req> =
    /** str */
    Req extends R.Requestable_str ? string :
    Req extends R.Requestable_strOpt ? Maybe<string> :
    /** nums */
    Req extends R.Requestable_int ? number :
    Req extends R.Requestable_intOpt ? Maybe<number> :
    Req extends R.Requestable_float ? number :
    Req extends R.Requestable_floatOpt ? Maybe<number> :
    /** bools */
    Req extends R.Requestable_bool ? boolean :
    Req extends R.Requestable_boolOpt ? Maybe<boolean> :
    Req extends R.Requestable_size ? Maybe<CushySize> :
    /** embedding */
    Req extends R.Requestable_embeddings ? Maybe<boolean> :
    /** loras */
    Req extends R.Requestable_enum<infer T> ? LATER<'Requirable'>[T] :
    Req extends R.Requestable_loras ? SimplifiedLoraDef[] :
    /** painting */
    Req extends R.Requestable_samMaskPoints ? {points: SamPointPosStr, labels: SamPointLabelsStr} :
    Req extends R.Requestable_selectImage ? ImageAnswer :
    Req extends R.Requestable_manualMask ? Base64Image :
    Req extends R.Requestable_paint ? Base64Image :

    /** group */
    Req extends { type: 'items', items: { [key: string]: any } } ? { [key in keyof Req['items']]: InfoAnswer<Req['items'][key]> } :
    Req extends { type: 'itemsOpt', items: { [key: string]: any } } ? Maybe<{ [key in keyof Req['items']]: InfoAnswer<Req['items'][key]> }> :
    /** select one */
    Req extends { type: 'selectOne', choices: infer T } ? (T extends readonly any[] ? T[number] : T) :
    Req extends { type: 'selectOneOrCustom', choices: string[] } ? string :
    /** select many */
    Req extends { type: 'selectMany', choices: infer T } ? (T extends readonly any[] ? T[number][] : T) :
    Req extends { type: 'selectManyOrCustom', choices: string[] } ? string[] :
    /** array */
    Req extends readonly [infer X, ...infer Rest] ? [InfoAnswer<X>, ...InfoAnswer<Rest>[]] :
    never

export type InfoRequestFn = <const Req extends { [key: string]: Requestable }>(
    req: (q: FormBuilder) => Req,
) => Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }>

// SAM
export type SamPointPosStr = Tagged<string, 'SamPointPosStr'>
export type SamPointLabelsStr = Tagged<string, 'SamPointLabelsStr'>

// IMAGE
export type ImageAnswer1 = { type: 'imageID'; imageID: ImageID }
export type ImageAnswer2 = { type: 'imageSignal'; nodeID: ComfyNodeID; fieldName: string } /** node must be in current graph */
export type ImageAnswer3 = { type: 'imagePath'; absPath: AbsolutePath }
export type ImageAnswer4 = { type: 'imageURL'; url: string }
export type ImageAnswer = ImageAnswer1 | ImageAnswer2 | ImageAnswer3 | ImageAnswer4

export type CushySizeByRatio = {
    kind: 'SD1.5 512' | 'SD2.1 768' | 'SDXL 1024' | 'custom'
    ratio: '16:9' | '1:1' | '1:2' | '1:4' | '21:9' | '2:1' | '2:3' | '3:2' | '3:4' | '4:1' | '4:3' | '9:16' | '9:21'
}

export type CushySize = {
    width: number
    height: number
}
