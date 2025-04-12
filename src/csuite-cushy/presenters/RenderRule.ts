import type { Field } from '../../csuite/model/Field'
import type { FieldSelector, FL_RawFieldSelector } from '../../csuite/selector/selector'
import type { CovariantFn } from '../../csuite/variance/BivariantHack'
import type { RenderProps, RenderPropsFlat } from './RenderProps'

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

export type RenderRuleFn<FIELD extends Field> = CovariantFn<
   [
      field: FIELD,
      set: {
         <F extends Field>(...props: RenderRule_asList<F>): void
         (prop: RenderProps<FIELD>): void
      },
   ],
   void
>

// prettier-ignore
// export type RenderRule<FIELD extends Field> =
// | RenderRule_asList<FIELD>
// | RenderRule_asDict<FIELD>

/** RenderRules, where every rule CAN have sub-rules */
export type RenderRule<FIELD extends Field> = {
   at: FieldPattern<FIELD>
   props: RenderProps<FIELD>
   priority?: number
   addedBy?: Field | null
}

/** RenderRules, where every rule is guaranteed not to have any sub-rule */
export type RenderRuleFlat<FIELD extends Field> = {
   at: FieldPattern<FIELD>
   propsFlat: RenderPropsFlat<FIELD>
   priority?: number
   addedBy?: Field | null
}

// (props when using set() function)
export type RenderRule_asList<FIELD extends Field> = [
   at: FieldPattern<FIELD>,
   props: RenderProps<FIELD>,
   priority?: number,
   addedBy?: Field | null,
]

// (props when using set() function)
export type RenderRuleFalt_asList<FIELD extends Field> = [
   at: FieldPattern<FIELD>,
   propsFlat: RenderPropsFlat<FIELD>,
   priority?: number,
   addedBy?: Field | null,
]

export function convertShortRule<FIELD extends Field>([
   match,
   uiconf,
   priority,
   addedBy,
]: RenderRule_asList<FIELD>): RenderRule<FIELD> {
   return { at: match, props: uiconf, priority, addedBy }
}
