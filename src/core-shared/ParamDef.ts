export type ParamType = 'string' | 'number'

export type ParamT<Kind extends string, Type extends any> = {
    /** used as header */
    group?: string
    name: string
    kind: Kind
    default: Type | (() => Type)
}

// prettier-ignore
export type FlowParam =
    | ParamT<'string', string>
    | ParamT<'number', number>
    | ParamT<'boolean', boolean>
    | ParamT<'strings', string[]>
