import type { ImageT } from 'src/models/Image'
import type { LATER } from 'LATER'
import type { ImageAnswer, InfoAnswer } from './InfoAnswer'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { WidgetPromptOutput } from 'src/prompter/WidgetPromptUI'

export type Tooltip = string
export type InptReq<Type extends string, Def, Extra = {}> = {
    type: Type
    group?: string
    label?: string
    tooltip?: string
    default: Def
} & Extra

export type InptOpt<Type extends string, Def, Extra = {}> = {
    type: Type
    label?: string
    group?: string
    tooltip?: string
    default?: Maybe<Def>
} & Extra

export type Requestable_str          = InptReq<'str',     string, {textarea?: boolean }> // prettier-ignore
export type Requestable_strOpt       = InptOpt<'str?',    string, {textarea?: boolean }> // prettier-ignore
export type Requestable_prompt       = InptReq<'prompt',  WidgetPromptOutput > // prettier-ignore
export type Requestable_promptOpt    = InptOpt<'prompt?', WidgetPromptOutput > // prettier-ignore
export type Requestable_int          = InptReq<'int',     number, {min?:number, max?:number}  > // prettier-ignore
export type Requestable_float        = InptReq<'float',   number, {min?:number, max?:number}  > // prettier-ignore
export type Requestable_bool         = InptReq<'bool',    boolean > // prettier-ignore
export type Requestable_intOpt       = InptOpt<'int?',    number  > // prettier-ignore
export type Requestable_floatOpt     = InptOpt<'float?',  number  > // prettier-ignore
export type Requestable_boolOpt      = InptOpt<'bool?',   boolean > // prettier-ignore
export type Requestable_size         = InptReq<'size',    boolean > // prettier-ignore
//
export type Requestable_embeddings   = InptReq<'embeddings',  LATER<'Embeddings'>> // prettier-ignore
export type Requestable_loras        = InptReq<'loras',       SimplifiedLoraDef[]> // prettier-ignore
//
export type Requestable_image        = InptReq<'image',  ImageAnswer>; /*imageInfos?: ImageT[]*/ // prettier-ignore
export type Requestable_imageOpt     = InptOpt<'image?', ImageAnswer>; /*imageInfos?: ImageT[]*/ // prettier-ignore
export type Requestable_manualMask   = InptReq<'manualMask',    null,    { imageInfo: ImageT}> // prettier-ignore
export type Requestable_paint        = InptReq<'paint',         null,    { url: string }> // prettier-ignore
export type Requestable_samMaskPoints= InptReq<'samMaskPoints', null,    { imageInfo: ImageT }> // prettier-ignore
//
export type Requestable_items   <T extends { [key: string]: Requestable }> = InptReq< 'items',    {[k in keyof T]: InfoAnswer<T[k]>},  {items: T,  }> // prettier-ignore
export type Requestable_itemsOpt<T extends { [key: string]: Requestable }> = InptOpt< 'items?', {[k in keyof T]: InfoAnswer<T[k]>},  {items: T,  }> // prettier-ignore
//
export type Requestable_selectOne          = InptReq< 'selectOne',            string,   {choices: string[] }> // prettier-ignore
export type Requestable_selectOneOrCustom  = InptReq< 'selectOneOrCustom',    string,   {choices: string[] }> // prettier-ignore
export type Requestable_selectMany         = InptReq< 'selectMany',           string[], {choices: string[] }> // prettier-ignore
export type Requestable_selectManyOrCustom = InptReq< 'selectManyOrCustom',   string[], {choices: string[] }> // prettier-ignore
//
export type Requestable_enumOpt<T extends keyof LATER<'Requirable'>> = InptOpt<'enum?', LATER<'Requirable'>[T], {enumName: T}> // prettier-ignore
export type Requestable_enum   <T extends keyof LATER<'Requirable'>> = InptReq<'enum',  LATER<'Requirable'>[T], {enumName: T}> // prettier-ignore

export type Requestable =
    /** str */
    | Requestable_str
    | Requestable_strOpt
    | Requestable_prompt
    | Requestable_promptOpt
    /** nums */
    | Requestable_int
    | Requestable_intOpt
    | Requestable_float
    | Requestable_floatOpt
    /** bools */
    | Requestable_bool
    | Requestable_boolOpt
    /** embedding */
    | Requestable_embeddings
    /** embedding */
    | Requestable_enum<any>
    | Requestable_enumOpt<any>
    /** loras */
    | Requestable_loras
    /** painting */
    | Requestable_samMaskPoints
    | Requestable_image
    | Requestable_imageOpt
    | Requestable_manualMask
    | Requestable_paint
    /** group */
    | Requestable_items<any> // a group that is always on
    | Requestable_itemsOpt<any> // a group that can be toggle on/off (wrap results in a Maybe)
    /** select one */
    | Requestable_selectOne
    | Requestable_selectOneOrCustom
    /** select many */
    | Requestable_selectMany
    | Requestable_selectManyOrCustom
