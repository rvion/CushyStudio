import type { FieldPattern } from '../../csuite-cushy/presenters/RenderRule'
import type { Field } from '../model/Field'

import { defineFieldMixin } from '../model/defineFieldMixin'
import { FieldSelector } from './selector'

export type SelectorMixin = typeof SelectorMixinImpl

export const SelectorMixinImpl = defineFieldMixin({
   // #region quick checks
   zContains(selector_: string | FieldSelector): boolean {
      const selector = FieldSelector.from(selector_)
      return this.zSelect(selector).length > 0
   },
   zMatches(selector_: FieldPattern<Field>, virtualParents?: Map<Field, Field>): boolean {
      return FieldSelector.match(selector_, this, virtualParents)
      // if (typeof selector_ === 'boolean') return selector_
      // const selector = FieldSelector.from(selector_)
      // return selector.matches(this, virtualParents)
   },
   // extraction
   zExtract(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).values
   },
   zExtractLastOrNull(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      const values = selector.runSelect(this).values
      if (values.length === 0) return null
      return values[values.length - 1]
   },
   zExtractLastOrThrow(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      const values = selector.runSelect(this).values
      if (values.length === 0) throw new Error('extractLastOrThrow: did not yield any value')
      return values[values.length - 1]
   },

   // selection
   zSelect(selector_: string | FieldSelector): Field[] {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).fields
   },
   zSelectFirstOrNull(selector_: string | FieldSelector): Field | null {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).fields[0] ?? null
   },
   zSelectFirstOrThrow<FIELD extends Field>(selector_: string | FieldSelector): FIELD | null {
      const selector = FieldSelector.from(selector_)
      const x = selector.runSelect(this).fields[0]
      if (x == null) throw new Error('selectOneOrThrow: did not yield any Field')
      return x as FIELD
   },

   // #region  all in one
   zSelectAndExtract(selector: string): { fields: Field[]; values: any[] } {
      return FieldSelector.from(selector).runSelect(this)
   },
})

export const SelectorMixinDescriptors = Object.getOwnPropertyDescriptors(SelectorMixinImpl)
