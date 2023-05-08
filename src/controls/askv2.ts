/**
 * This module implements is the early-days core of
 * the cushy form-framework
 * 🔶 design is a bit unusual because of the very specific needs of the project
 * TODO: write them down to explain choices
 */

import type { Base64Image } from 'src/core-shared/b64img'
import type { SimplifiedLoraDef } from 'src/presets/presets'
import type { Maybe, Tagged } from 'src/utils/types'
import { BUG } from './BUG'

export type Requestable = { label?: string } & Requestable_

export type Requestable_ =
    /** str */
    | { type: 'str' }
    | { type: 'str?' }
    /** nums */
    | { type: 'int' }
    | { type: 'int?' }
    /** bools */
    | { type: 'bool' }
    | { type: 'bool?' }
    /** embedding */
    | { type: 'embeddings' }
    /** loras */
    | { type: 'lora' }
    | { type: 'loras' }
    /** painting */
    | { type: 'samMaskPoints'; url: string }
    | { type: 'manualMask'; url: string }
    | { type: 'paint'; url: string }
    /** group */
    | { type: 'items'; items: { [key: string]: Requestable } }
    /** select one */
    | { type: 'selectOne'; choices: string[] } //
    | { type: 'selectOneOrCustom'; choices: string[] }
    /** select many */
    | { type: 'selectMany'; choices: string[] }
    | { type: 'selectManyOrCustom'; choices: string[] }
    /** array */
    | Requestable[]
    /** ?? */
    | BUG

export type SamPointPosStr = Tagged<string, 'SamPointPosStr'>
export type SamPointLabelsStr = Tagged<string, 'SamPointLabelsStr'>

// prettier-ignore
export type InfoAnswer<Req> =
    /** str */
    Req extends {type: 'str' }  ? string :
    Req extends {type: 'str?' } ? Maybe<string> :
    /** nums */
    Req extends {type: 'int' }  ? number :
    Req extends {type: 'int?' } ? Maybe<number> :
    /** bools */
    Req extends {type: 'bool' }  ? boolean :
    Req extends {type: 'bool?' } ? Maybe<boolean> :
    /** embedding */
    Req extends {type: 'embeddings' } ? Maybe<boolean> :
    /** loras */
    Req extends {type: 'lora' }  ? SimplifiedLoraDef :
    Req extends {type: 'loras' } ? SimplifiedLoraDef[] :
    /** painting */

    // {"samMaskPoints":{"points":"[89.39583587646484, 394.6302185058594], [141.39583587646484, 227.63021850585938]","labels":"[1, 1]"}}
    Req extends {type: 'samMaskPoints' } ? {points: SamPointPosStr, labels: SamPointLabelsStr} :
    Req extends {type: 'manualMask' } ? Base64Image :
    Req extends {type: 'paint'} ? Base64Image :
    /** group */
    Req extends {type: 'items', items: { [key: string]: any }} ? { [key in keyof Req['items']]: InfoAnswer<Req['items'][key]> } :
    /** select one */
    Req extends {type: 'selectOne', choices: infer T} ? (T extends readonly any[] ? T[number] : T) :
    Req extends {type: 'selectOneOrCustom', choices: string[]} ? string :
    /** select many */
    Req extends {type: 'selectMany', choices: infer T} ? (T extends readonly any[] ? T[number][] : T) :
    Req extends {type: 'selectManyOrCustom', choices: string[]} ? string[] :
    /** array */
    Req extends readonly [infer X, ...infer Rest] ? [InfoAnswer<X>, ...InfoAnswer<Rest>[]] :
    never

export class InfoRequestBuilder {
    /** str */
    str = (label?: string) => ({ type: 'str' as const, label })
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
    samMaskPoints = (label: string, url: string) => ({ type: 'samMaskPoints' as const, label, url })
    manualMask = (label: string, url: string) => ({ type: 'manualMask' as const, label, url })
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
