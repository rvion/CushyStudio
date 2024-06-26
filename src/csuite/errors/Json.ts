// prettier-ignore
export type Json =
    | string
    | number
    | boolean
    | JSONDict
    | Array<Json>;

export type JSONDict = { [_: string]: Json }
