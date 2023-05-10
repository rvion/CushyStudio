export type ParamType = 'string' | 'number'

export type ParamT<Kind extends string, Type extends any> = {
    kind: Kind
    name: string
    default: Type | (() => Type)
    /** used as header */
    group?: string
}

// prettier-ignore
export type FlowParam =
    | ParamT<'string', string>
    | ParamT<'number', number>
    | ParamT<'boolean', boolean>
    | ParamT<'strings', string[]>
    | ParamT<'image', string>
