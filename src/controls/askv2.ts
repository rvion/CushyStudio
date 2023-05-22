/**
 * This module implements is the early-days core of
 * the cushy form-framework
 * 🔶 design is a bit unusual because of the very specific needs of the project
 * TODO: write them down to explain choices
 */

import type { Base64Image } from 'src/core/b64img'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { Maybe, Tagged } from 'src/utils/types'
import type { ImageL, ImageT } from 'src/models/Image'
import type { Requestable } from './Requestable'

import { logger } from '../logger/logger'
import type * as R from './Requestable'
import { LATER } from 'LATER'

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
    Req extends R.Requestable_enum<infer T> ? LATER<'Requirable'>[T] :
    Req extends R.Requestable_loras ? SimplifiedLoraDef[] :
    /** painting */
    Req extends R.Requestable_samMaskPoints ? {points: SamPointPosStr, labels: SamPointLabelsStr} :
    Req extends R.Requestable_selectImage ? _IMAGE :
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

type ImageInBackend = ImageL | ImageT
const toImageInfos = (img: ImageInBackend): ImageT => {
    try {
        return (img as any).toJSON ? (img as any).toJSON() : img
    } catch (error) {
        logger().info('🔴 UNRECOVERABLE ERROR 🔴' + JSON.stringify(img))
        throw error
    }
}

export class FormBuilder {
    /** str */
    str = (p: Omit<R.Requestable_str, 'type'>): R.Requestable_str => ({ type: 'str', ...p })
    strOpt = (p: Omit<R.Requestable_strOpt, 'type'>): R.Requestable_strOpt => ({ type: 'str?', ...p })

    /** nums */
    int = (p?: Omit<R.Requestable_int, 'type'>) => ({ type: 'int', ...p })
    intOpt = (p?: Omit<R.Requestable_intOpt, 'type'>) => ({ type: 'int?', ...p })

    /** bools */
    bool = (p?: Omit<R.Requestable_bool, 'type'>) => ({ type: 'bool' as const, ...p })
    boolOpt = (p?: Omit<R.Requestable_boolOpt, 'type'>) => ({ type: 'bool?' as const, ...p })

    /** embedding */
    embeddings = (label?: string) => ({ type: 'embeddings' as const, label })

    /** embedding */
    enum = <const T extends keyof LATER<'Requirable'>>(x: Omit<R.Requestable_enum<T>, 'type'>): R.Requestable_enum<T> => ({
        type: 'enum',
        ...x,
    })
    enumOpt = <const T extends keyof LATER<'Requirable'>>(
        x: Omit<R.Requestable_enumOpt<T>, 'type'>,
    ): R.Requestable_enumOpt<T> => ({
        type: 'enum?',
        ...x,
    })

    /** loras */
    // lora = (label?: string) => ({ type: 'lora' as const, label })
    loras = (p: Omit<R.Requestable_loras, 'type'>) => ({ type: 'loras' as const, ...p })

    /** painting */
    private _toImageInfos = () => {}
    samMaskPoints = (label: string, img: ImageL | ImageT) => ({
        type: 'samMaskPoints' as const,
        imageInfo: toImageInfos(img),
    })
    selectImage = (label: string, imgs: (ImageL | ImageT)[]) => ({
        type: 'selectImage' as const,
        imageInfos: imgs.map(toImageInfos),
        label,
    })
    manualMask = (label: string, img: ImageL | ImageT) => ({
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

// ----------------

export type InfoRequestFn = typeof fakeInfoRequestFn

// ----------------------------------------------------------
export const fakeInfoRequestFn = async <const Req extends { [key: string]: Requestable }>(
    //
    req: (q: FormBuilder) => Req,
): Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }> => {
    const q = new FormBuilder()
    const r = req(q)
    return 0 as any
}
