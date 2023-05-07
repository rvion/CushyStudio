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
    | { label?: string; type: 'choiceStrict'; choices: string[] }
    | { label?: string; type: 'choiceOpen'; choices: string[] }
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
    Req extends {type: 'choiceStrict', choices: infer T} ? (T extends readonly any[] ? T[number] : T) :
    Req extends {type: 'choiceOpen', choices: string[]} ? string :
    never

export class InfoRequestBuilder {
    group = <const T>(label: string, items: T): { type: 'items'; items: T } => ({ type: 'items', items })

    choiceStrict = <const T>(label: string, choices: T): { type: 'choiceStrict'; choices: T } => {
        return { type: 'choiceStrict', choices }
    }
    choiceOpen = (label: string, choices: string[]): { type: 'choiceOpen'; choices: string[] } => {
        return { type: 'choiceOpen', choices }
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
