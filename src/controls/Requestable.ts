import type { ImageT } from 'src/models/Image'
import type { LATER } from 'LATER'
import { BUG } from './BUG'

export type Requestable =
    /** str */
    | Requestable_str
    | Requestable_strOpt
    /** nums */
    | Requestable_int
    | Requestable_intOpt
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
    | Requestable_items
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

export type Requestable_str = { type: 'str'; label?: string; default?: string }
export type Requestable_strOpt = { type: 'str?'; label?: string; default?: string }
export type Requestable_int = { type: 'int'; label?: string; default?: number }
export type Requestable_intOpt = { type: 'int?'; label?: string; default?: number | null }
export type Requestable_bool = { type: 'bool'; label?: string }
export type Requestable_boolOpt = { type: 'bool?'; label?: string }
export type Requestable_embeddings = { type: 'embeddings'; label?: string }
export type Requestable_enum<T extends keyof LATER<'Requirable'>> = { type: 'enum'; enumName: T; label?: string }
export type Requestable_enumOpt<T extends keyof LATER<'Requirable'>> = { type: 'enum?'; enumName: T; label?: string }
export type Requestable_loras = { type: 'loras'; label?: string }
export type Requestable_samMaskPoints = { type: 'samMaskPoints'; label?: string; imageInfo: ImageT }
export type Requestable_selectImage = { type: 'selectImage'; label?: string; imageInfos?: ImageT[] }
export type Requestable_manualMask = { type: 'manualMask'; label?: string; imageInfo: ImageT }
export type Requestable_paint = { type: 'paint'; label?: string; url: string }
export type Requestable_items = { type: 'items'; label?: string; items: { [key: string]: Requestable } }
export type Requestable_selectOne = { type: 'selectOne'; label?: string; choices: string[] } //
export type Requestable_selectOneOrCustom = { type: 'selectOneOrCustom'; label?: string; choices: string[] }
export type Requestable_selectMany = { type: 'selectMany'; label?: string; choices: string[] }
export type Requestable_selectManyOrCustom = { type: 'selectManyOrCustom'; label?: string; choices: string[] }
