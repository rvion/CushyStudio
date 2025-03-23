import type { RenderProps } from './RenderProps'

import { Field } from '../../csuite/model/Field'
import { FieldSelector, type FL_RawFieldSelector } from '../../csuite/selector/selector'

export const RENDER_PRIORITY_DEFAULT_RULES = 10
export const RENDER_PRIORITY_UIUI = 20
export const RENDER_PRIORITY_ON_SET = 50
export const RENDER_PRIORITY_FINAL = 120

export type RenderRule<FIELD extends Field> = {
   addedBy?: Field | null
   selector: FIELD | FieldSelector | FL_RawFieldSelector | true
   uiconf: RenderProps<FIELD>
   priority?: number
}
