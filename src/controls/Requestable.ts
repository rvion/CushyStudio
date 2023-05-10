import type { ImageInfos } from 'src/core-shared/GeneratedImageSummary'
import { BUG } from './BUG'

export type Requestable = { label?: string } & Requestable_

export type Requestable_ =
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
    /** loras */
    | Requestable_lora
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

export type Requestable_str = { type: 'str' }
export type Requestable_strOpt = { type: 'str?' }
export type Requestable_int = { type: 'int' }
export type Requestable_intOpt = { type: 'int?' }
export type Requestable_bool = { type: 'bool' }
export type Requestable_boolOpt = { type: 'bool?' }
export type Requestable_embeddings = { type: 'embeddings' }
export type Requestable_lora = { type: 'lora' }
export type Requestable_loras = { type: 'loras' }
export type Requestable_samMaskPoints = { type: 'samMaskPoints'; imageInfo: ImageInfos }
export type Requestable_selectImage = { type: 'selectImage'; imageInfos: ImageInfos[] }
export type Requestable_manualMask = { type: 'manualMask'; imageInfo: ImageInfos }
export type Requestable_paint = { type: 'paint'; url: string }
export type Requestable_items = { type: 'items'; items: { [key: string]: Requestable } }
export type Requestable_selectOne = { type: 'selectOne'; choices: string[] } //

export type Requestable_selectOneOrCustom = { type: 'selectOneOrCustom'; choices: string[] }
export type Requestable_selectMany = { type: 'selectMany'; choices: string[] }
export type Requestable_selectManyOrCustom = { type: 'selectManyOrCustom'; choices: string[] }
