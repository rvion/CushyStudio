import type { Field } from '../model/Field'

import { defineFieldMixin } from '../model/defineFieldMixin'
import { FieldSelector } from './selector'

export type SelectorMixin = typeof SelectorMixinImpl

export const SelectorMixinImpl = defineFieldMixin({
   // #region quick checks
   contains(selector_: string | FieldSelector): boolean {
      const selector = FieldSelector.from(selector_)
      return this.select(selector).length > 0
   },
   matches(selector_: string | FieldSelector, virtualParents: Map<Field, Field>): boolean {
      const selector = FieldSelector.from(selector_)
      return selector.matches(this, virtualParents)
   },
   // extraction
   extract(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).values
   },
   extractLastOrNull(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      const values = selector.runSelect(this).values
      if (values.length === 0) return null
      return values[values.length - 1]
   },
   extractLastOrThrow(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      const values = selector.runSelect(this).values
      if (values.length === 0) throw new Error('extractLastOrThrow: did not yield any value')
      return values[values.length - 1]
   },

   // selection
   select(selector_: string | FieldSelector): Field[] {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).fields
   },
   selectFirstOrNull(selector_: string | FieldSelector): Field | null {
      const selector = FieldSelector.from(selector_)
      return selector.runSelect(this).fields[0] ?? null
   },
   selectFirstOrThrow<FIELD extends Field>(selector_: string | FieldSelector): FIELD | null {
      const selector = FieldSelector.from(selector_)
      const x = selector.runSelect(this).fields[0]
      if (x == null) throw new Error('selectOneOrThrow: did not yield any Field')
      return x as FIELD
   },

   // #region  all in one
   selectAndExtract(selector: string): { fields: Field[]; values: any[] } {
      return FieldSelector.from(selector).runSelect(this)
   },
})

export const SelectorMixinDescriptors = Object.getOwnPropertyDescriptors(SelectorMixinImpl)
