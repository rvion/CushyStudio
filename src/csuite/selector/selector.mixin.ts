import type { FieldPattern } from '../../csuite-cushy/presenters/RenderRule'
import type { Field } from '../model/Field'

import { defineFieldMixin } from '../model/defineFieldMixin'
import { FieldSelector } from './selector'

export type SelectorMixin = typeof SelectorMixinImpl

export const SelectorMixinImpl = defineFieldMixin({
   // #region quick checks
   ϟcontains(selector_: string | FieldSelector): boolean {
      const selector = FieldSelector.from(selector_)
      return this.ϟselect(selector).length > 0
   },
   ϟmatches(selector_: FieldPattern<Field>, virtualParents?: Map<Field, Field>): boolean {
      return FieldSelector.match(selector_, this, virtualParents)
      // if (typeof selector_ === 'boolean') return selector_
      // const selector = FieldSelector.from(selector_)
      // return selector.matches(this, virtualParents)
   },
   // extraction
   ϟextract(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).values
   },
   ϟextractLastOrNull(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      const values = selector.runSelect(this).values
      if (values.length === 0) return null
      return values[values.length - 1]
   },
   ϟextractLastOrThrow(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      const values = selector.runSelect(this).values
      if (values.length === 0) throw new Error('extractLastOrThrow: did not yield any value')
      return values[values.length - 1]
   },

   // selection
   ϟselect(selector_: string | FieldSelector): Field[] {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).fields
   },
   ϟselectFirstOrNull(selector_: string | FieldSelector): Field | null {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).fields[0] ?? null
   },
   ϟselectFirstOrThrow<FIELD extends Field>(selector_: string | FieldSelector): FIELD | null {
      const selector = FieldSelector.from(selector_)
      const x = selector.runSelect(this).fields[0]
      if (x == null) throw new Error('selectOneOrThrow: did not yield any Field')
      return x as FIELD
   },

   // #region  all in one
   ϟselectAndExtract(selector: string): { fields: Field[]; values: any[] } {
      return FieldSelector.from(selector).runSelect(this)
   },
})

export const SelectorMixinDescriptors = Object.getOwnPropertyDescriptors(SelectorMixinImpl)
