import type { SimplifiedLoraDef } from 'src/presets/presets'
import type { Maybe } from 'src/utils/types'

class BUG {}

export type Requestable =
    /** str */
    | 'str'
    | 'str?'
    /** nums */
    | 'int'
    | 'int?'
    /** bools */
    | 'bool'
    | 'bool?'
    /** embedding/lora */
    | 'embeddings'
    | 'lora'
    | 'loras'
    /** array */
    | Requestable[]
    /** painting */
    | 'samMaskPoints'
    | 'manualMask'
    | 'paint'
    /** forms */
    | { label?: string; type: 'items'; items: { [key: string]: Requestable } }
    // choices (type will be renamed before)
    | { label?: string; type: 'selectOne'; choices: string[] } //
    | { label?: string; type: 'selectOneOrCustom'; choices: string[] }
    | { label?: string; type: 'selectMany'; choices: string[] }
    | { label?: string; type: 'selectManyOrCustom'; choices: string[] }
    | BUG

// prettier-ignore
export type InfoAnswer<Req> =
    /** str */
    Req extends 'str' ? string :
    Req extends 'str?' ? Maybe<string> :
    /** nums */
    Req extends 'int' ? number :
    Req extends 'int?' ? Maybe<number> :
    /** bools */
    Req extends 'bool' ? boolean :
    Req extends 'bool?' ? Maybe<boolean> :
    /** embedding/lora */
    Req extends 'embeddings' ? Maybe<boolean> :
    Req extends 'lora' ? SimplifiedLoraDef :
    Req extends 'loras' ? SimplifiedLoraDef[] :
    /** array */
    Req extends readonly [infer X, ...infer Rest] ? [InfoAnswer<X>, ...InfoAnswer<Rest>[]] :
    /** painting */
    Req extends 'samMaskPoints' ? Maybe<boolean> :
    Req extends 'manualMask' ? SimplifiedLoraDef :
    Req extends 'paint' ? SimplifiedLoraDef[] :
    /** forms */
    Req extends {type: 'items', items: { [key: string]: any }} ? { [key in keyof Req['items']]: InfoAnswer<Req['items'][key]> } :
    Req extends {type: 'selectOne', choices: infer T} ? (T extends readonly any[] ? T[number] : T) :
    Req extends {type: 'selectOneOrCustom', choices: string[]} ? string :
    Req extends {type: 'selectMany', choices: infer T} ? (T extends readonly any[] ? T[number][] : T) :
    Req extends {type: 'selectManyOrCustom', choices: string[]} ? string[] :
    never

export class InfoRequestBuilder {
    group = <const T>(label: string, items: T): { type: 'items'; items: T } => ({ type: 'items', items })

    selectOne = <const T>(label: string, choices: T): { type: 'selectOne'; choices: T } => {
        return { type: 'selectOne', choices }
    }
    selectOneOrCustom = (label: string, choices: string[]): { type: 'selectOneOrCustom'; choices: string[] } => {
        return { type: 'selectOneOrCustom', choices }
    }

    selectMany = <const T>(label: string, choices: T): { type: 'selectMany'; choices: T } => {
        return { type: 'selectMany', choices }
    }
    selectManyOrCustom = (label: string, choices: string[]): { type: 'selectManyOrCustom'; choices: string[] } => {
        return { type: 'selectManyOrCustom', choices }
    }
}

export type InfoRequestFn = typeof fakeInfoRequestFn
export const fakeInfoRequestFn = async <const Req extends { [key: string]: Requestable }>(
    //
    req: (q: InfoRequestBuilder) => Req,
    layout?: 0,
): Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }> => {
    const q = new InfoRequestBuilder()
    const r = req(q)
    return 0 as any
}
