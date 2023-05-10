/**
 * This module implements is the early-days core of
 * the cushy form-framework
 * 🔶 design is a bit unusual because of the very specific needs of the project
 * TODO: write them down to explain choices
 */

import type { Base64Image } from 'src/core-shared/b64img'
import type { SimplifiedLoraDef } from 'src/presets/presets'
import type { Maybe, Tagged } from 'src/utils/types'
import type { ImageInfos } from 'src/core-shared/GeneratedImageSummary'
import type { IGeneratedImage } from 'src/sdk/IFlowExecution'
import type { Requestable } from './Requestable'

import { logger } from 'src/logger/logger'
import type * as R from './Requestable'

export type SamPointPosStr = Tagged<string, 'SamPointPosStr'>
export type SamPointLabelsStr = Tagged<string, 'SamPointLabelsStr'>

// prettier-ignore
export type InfoAnswer<Req> =
    /** str */
    Req extends R.Requestable_str ? string :
    Req extends R.Requestable_strOpt ? Maybe<string> :
    /** nums */
    Req extends R.Requestable_int ? number :
    Req extends R.Requestable_intOpt ? Maybe<number> :
    /** bools */
    Req extends R.Requestable_bool ? boolean :
    Req extends R.Requestable_boolOpt ? Maybe<boolean> :
    /** embedding */
    Req extends R.Requestable_embeddings ? Maybe<boolean> :
    /** loras */
    Req extends R.Requestable_lora ? SimplifiedLoraDef :
    Req extends R.Requestable_loras ? SimplifiedLoraDef[] :
    /** painting */
    Req extends R.Requestable_samMaskPoints ? {points: SamPointPosStr, labels: SamPointLabelsStr} :
    Req extends R.Requestable_selectImage ? ImageInfos :
    Req extends R.Requestable_manualMask ? Base64Image :
    Req extends R.Requestable_paint ? Base64Image :

    /** group */
    Req extends { type: 'items', items: { [key: string]: any } } ? { [key in keyof Req['items']]: InfoAnswer<Req['items'][key]> } :
    /** select one */
    Req extends { type: 'selectOne', choices: infer T } ? (T extends readonly any[] ? T[number] : T) :
    Req extends { type: 'selectOneOrCustom', choices: string[] } ? string :
    /** select many */
    Req extends { type: 'selectMany', choices: infer T } ? (T extends readonly any[] ? T[number][] : T) :
    Req extends { type: 'selectManyOrCustom', choices: string[] } ? string[] :
    /** array */
    Req extends readonly [infer X, ...infer Rest] ? [InfoAnswer<X>, ...InfoAnswer<Rest>[]] :
    never

type ImageInBackend = IGeneratedImage | ImageInfos
const toImageInfos = (img: ImageInBackend) => {
    try {
        return (img as any).toJSON ? (img as any).toJSON() : img
    } catch (error) {
        logger().info('🔴 🔴' + JSON.stringify(img))
    }
}

export class InfoRequestBuilder {
    /** str */
    str = (label?: string): R.Requestable_str => ({ type: 'str' as const, label })
    strOpt = (label?: string) => ({ type: 'str?' as const, label })
    /** nums */
    int = (label?: string) => ({ type: 'int' as const, label })
    intOpt = (label?: string) => ({ type: 'int?' as const, label })
    /** bools */
    bool = (label?: string) => ({ type: 'bool' as const, label })
    boolOpt = (label?: string) => ({ type: 'bool?' as const, label })
    /** embedding */
    embeddings = (label?: string) => ({ type: 'embeddings' as const, label })
    /** loras */
    lora = (label?: string) => ({ type: 'lora' as const, label })
    loras = (label?: string) => ({ type: 'loras' as const, label })

    /** painting */
    private _toImageInfos = () => {}
    samMaskPoints = (label: string, img: IGeneratedImage | ImageInfos) => ({
        type: 'samMaskPoints' as const,
        imageInfo: toImageInfos(img),
    })
    selectImage = (label: string, imgs: (IGeneratedImage | ImageInfos)[]) => ({
        type: 'selectImage' as const,
        imageInfos: imgs.map(toImageInfos),
        label,
    })
    manualMask = (label: string, img: IGeneratedImage | ImageInfos) => ({
        type: 'manualMask' as const,
        label,
        imageInfo: toImageInfos(img),
    })

    paint = (label: string, url: string) => ({ type: 'paint' as const, label, url })
    /** group */
    group = <const T>(label: string, items: T): { type: 'items'; items: T } => ({ type: 'items', items })
    /** select one */
    selectOne = <const T>(label: string, choices: T): { type: 'selectOne'; choices: T } => ({ type: 'selectOne', choices })
    selectOneOrCustom = (label: string, choices: string[]): { type: 'selectOneOrCustom'; choices: string[] } => ({
        type: 'selectOneOrCustom',
        choices,
    })
    /** select many */
    selectMany = <const T>(label: string, choices: T): { type: 'selectMany'; choices: T } => ({ type: 'selectMany', choices })
    selectManyOrCustom = (label: string, choices: string[]): { type: 'selectManyOrCustom'; choices: string[] } => ({
        type: 'selectManyOrCustom',
        choices,
    })
}

export type InfoRequestFn = typeof fakeInfoRequestFn

// ----------------------------------------------------------
export const fakeInfoRequestFn = async <const Req extends { [key: string]: Requestable }>(
    //
    req: (q: InfoRequestBuilder) => Req,
    layout?: 0,
): Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }> => {
    const q = new InfoRequestBuilder()
    const r = req(q)
    return 0 as any
}
