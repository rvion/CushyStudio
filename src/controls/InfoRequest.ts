import type { ImageT } from 'src/models/Image'
import type { LATER } from 'LATER'
import { InfoAnswer } from './InfoAnswer'

export type Requestable_str          = { type: 'str';    label?: string; default?: string; textarea?: boolean } // prettier-ignore
export type Requestable_strOpt       = { type: 'str?';   label?: string; default?: string; textarea?: boolean } // prettier-ignore
export type Requestable_int          = { type: 'int';    label?: string; default?: number  } // prettier-ignore
export type Requestable_float        = { type: 'float';  label?: string; default?: number  } // prettier-ignore
export type Requestable_bool         = { type: 'bool';   label?: string; default?: boolean } // prettier-ignore
export type Requestable_intOpt       = { type: 'int?';   label?: string; default?: number  } // prettier-ignore
export type Requestable_floatOpt     = { type: 'float?'; label?: string; default?: number  } // prettier-ignore
export type Requestable_boolOpt      = { type: 'bool?';  label?: string; default?: boolean } // prettier-ignore
//
export type Requestable_embeddings   = { type: 'embeddings'; label?: string, default?: LATER<'Embeddings'>  } // prettier-ignore
//
export type Requestable_loras        = { type: 'loras';      label?: string, default?: LATER<'Enum_LoraLoader_lora_name'> } // prettier-ignore
//
export type Requestable_selectImage  = { type: 'selectImage';   label?: string; default?: undefined;  /*imageInfos?: ImageT[]*/ } // prettier-ignore
export type Requestable_manualMask   = { type: 'manualMask';    label?: string; default?: undefined; imageInfo: ImageT } // prettier-ignore
export type Requestable_paint        = { type: 'paint';         label?: string; default?: undefined; url: string } // prettier-ignore
export type Requestable_samMaskPoints= { type: 'samMaskPoints'; label?: string; default?: undefined; imageInfo: ImageT } // prettier-ignore
//
export type Requestable_items<T extends { [key: string]: Requestable }>    = { type: 'items';    label?: string; items: T, default?: {[k in keyof T]: InfoAnswer<T[k]>} } // prettier-ignore
export type Requestable_itemsOpt<T extends { [key: string]: Requestable }> = { type: 'itemsOpt'; label?: string; items: T, default?: {[k in keyof T]: InfoAnswer<T[k]>} } // prettier-ignore
//
export type Requestable_selectOne          = { type: 'selectOne';          label?: string; choices: string[]; default?: string[] } // prettier-ignore
export type Requestable_selectOneOrCustom  = { type: 'selectOneOrCustom';  label?: string; choices: string[]; default?: string[] } // prettier-ignore
export type Requestable_selectMany         = { type: 'selectMany';         label?: string; choices: string[]; default?: string[] } // prettier-ignore
export type Requestable_selectManyOrCustom = { type: 'selectManyOrCustom'; label?: string; choices: string[]; default?: string[] } // prettier-ignore
//
export type Requestable_enumOpt<T extends keyof LATER<'Requirable'>> = { type: 'enum?'; enumName: T; default?: LATER<'Requirable'>[T]; label?: string } // prettier-ignore
export type Requestable_enum<T extends keyof LATER<'Requirable'>>    = { type: 'enum';  enumName: T; default?: LATER<'Requirable'>[T]; label?: string } // prettier-ignore

export type Requestable =
    /** str */
    | Requestable_str
    | Requestable_strOpt
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
    | Requestable_selectImage
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
    /** array */
    | Requestable[]
    /** ?? */
    | BUG

export class BUG {}
