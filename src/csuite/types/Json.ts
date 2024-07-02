// prettier-ignore
/** type to enforce that a value is JSON serializable */
export type Json =
    | string
    | number
    | boolean
    | JSONDict
    | Array<Json>;

export type JSONDict = { [_: string]: Json }
