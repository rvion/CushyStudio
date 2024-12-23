import type { Field } from '../model/Field'

import { defineFieldMixin } from '../model/defineFieldMixin'
import { FieldSelector } from './selector'

export type SelectorMixin = typeof SelectorMixinImpl

export const SelectorMixinImpl = defineFieldMixin({
   // extraction
   extract(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      return selector.selectFrom(this).values
   },
   extractLastOrNull(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      const values = selector.selectFrom(this).values
      if (values.length === 0) return null
      return values[values.length - 1]
   },
   extractLastOrThrow(selector_: string | FieldSelector): any {
      const selector = FieldSelector.from(selector_)
      const values = selector.selectFrom(this).values
      if (values.length === 0) throw new Error('extractLastOrThrow: did not yield any value')
      return values[values.length - 1]
   },

   // selection
   select(selector_: string | FieldSelector): Field[] {
      const selector = FieldSelector.from(selector_)
      return selector.selectFrom(this).fields
   },
   selectFirstOrNull(selector_: string | FieldSelector): Field | null {
      const selector = FieldSelector.from(selector_)
      return selector.selectFrom(this).fields[0] ?? null
   },
   selectFirstOrThrow(selector_: string | FieldSelector): Field | null {
      const selector = FieldSelector.from(selector_)
      const x = selector.selectFrom(this).fields[0]
      if (x == null) throw new Error('selectOneOrThrow: did not yield any Field')
      return x
   },

   // #region  all in one
   selectAndExtract(selector: string): { fields: Field[]; values: any[] } {
      return FieldSelector.from(selector).selectFrom(this)
   },

   // #region quick checks
   contains(selector_: string | FieldSelector): boolean {
      const selector = FieldSelector.from(selector_)
      return this.select(selector).length > 0
   },
   matches(selector_: string | FieldSelector): boolean {
      const selector = FieldSelector.from(selector_)
      return this.select(selector).includes(this)
   },
})

export const SelectorMixinDescriptors = Object.getOwnPropertyDescriptors(SelectorMixinImpl)
