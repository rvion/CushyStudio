import type { RenderProps } from './RenderProps'

import { Field } from '../../csuite/model/Field'
import { FieldSelector, type FL_RawFieldSelector } from '../../csuite/selector/selector'

export const RENDER_PRIORITY_DEFAULT_RULES = 10
export const RENDER_PRIORITY_UIUI = 20
export const RENDER_PRIORITY_ON_SET = 50
export const RENDER_PRIORITY_FINAL = 120

// stuff we can build selector from
export type FieldPattern<FIELD extends Field> =
   /** a single specific field */
   | FIELD
   /** a set of specific fields */
   | FIELD[]
   /** a real field selector already built */
   | FieldSelector
   /** a selector expression */
   | FL_RawFieldSelector
   /**
    * true: all fields; false: nothing
    * (useful when value comes from a config)
    */
   | boolean

// prettier-ignore
export type RenderRule<FIELD extends Field> =
   | RenderRule_asList<FIELD>
   | RenderRule_asDict<FIELD>

export type RenderRule_asDict<FIELD extends Field> = {
   pattern: FieldPattern<FIELD>
   uiconf: RenderProps<FIELD>
   priority?: number
   addedBy?: Field | null
}

// alternative rule syntax
export type RenderRule_asList<FIELD extends Field> = [
   pattern: FieldPattern<FIELD>,
   uiconf: RenderProps<FIELD>,
   priority?: number,
   addedBy?: Field | null,
]

export function normalizeRule<FIELD extends Field>(
   //
   rule: RenderRule<FIELD>,
): RenderRule_asDict<FIELD> {
   if (Array.isArray(rule)) return convertShortRule(rule)
   return rule
}

export function convertShortRule<FIELD extends Field>([
   match,
   uiconf,
   priority,
   addedBy,
]: RenderRule_asList<FIELD>): RenderRule_asDict<FIELD> {
   return { pattern: match, uiconf, priority, addedBy }
}
