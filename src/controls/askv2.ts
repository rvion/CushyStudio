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
    | { type: 'items'; items: { [key: string]: Requestable } }
    | { type: 'choiceStrict'; choices: string[] }
    | { type: 'choiceOpen'; choices: string[] }
    | BUG

// prettier-ignore
export type Answer<Req> =
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
    Req extends readonly [infer X, ...infer Rest] ? [Answer<X>, ...Answer<Rest>[]] :
    /** painting */
    Req extends 'samMaskPoints' ? Maybe<boolean> :
    Req extends 'manualMask' ? SimplifiedLoraDef :
    Req extends 'paint' ? SimplifiedLoraDef[] :
    /** forms */
    Req extends {type: 'items', items: { [key: string]: any }} ? { [key in keyof Req['items']]: Answer<Req['items'][key]> } :
    Req extends {type: 'choiceStrict', choices: infer T} ? (T extends readonly any[] ? T[number] : T) :
    Req extends {type: 'choiceOpen', choices: string[]} ? string :
    never

class QBuilder {
    group = <const T>(label: string, items: T): { type: 'items'; items: T } => ({ type: 'items', items })

    choiceStrict = <const T>(label: string, choices: T): { type: 'choiceStrict'; choices: T } => {
        return { type: 'choiceStrict', choices }
    }
    choiceOpen = (label: string, choices: string[]): { type: 'choiceOpen'; choices: string[] } => {
        return { type: 'choiceOpen', choices }
    }
}

const ask = <const Req extends { [key: string]: Requestable }>(
    //
    req: (q: QBuilder) => Req,
    layout?: any,
): { [key in keyof Req]: Answer<Req[key]> } => {
    const q = new QBuilder()
    const r = req(q)
    return 0 as any
}

const r1 = ask((q) => ({ width: 'int' }))
const r2 = ask((q) => ({ 'wanna clip skip?': 'int?' }))
const r3 = ask((ui) => ({
    foo: 'int',
    number: 'int?',
    loras: 'loras',
    col1: ui.choiceStrict('pick a primary color', ['red', 'blue', 'green']),
    col2: ui.choiceOpen('choose a color', ['red', 'blue', 'green']),
    qux: ['int', 'int', 'int'],
}))

type K = (typeof r3)['col1'][number]
const y: Maybe<number> = r3.number
const x: string = r3.loras[0].name
const aa = r3.qux[0]
